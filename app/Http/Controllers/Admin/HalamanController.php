<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Http\Controllers\Controller;
use App\Models\KontenHalaman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman berbasis prosa: Sejarah, Visi-Misi, Sambutan, Kurikulum, Prestasi,
 * Tata Tertib, Organisasi Siswa, E-Learning.
 *
 * Baris-barisnya dibuat seeder dan tidak bisa ditambah atau dihapus dari sini —
 * setiap kunci terikat pada route publik tertentu. Membiarkan admin menghapus
 * baris `kurikulum` akan mematikan /kurikulum tanpa cara memulihkannya dari
 * antarmuka.
 */
class HalamanController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaHalaman->value)];
    }

    /** Route publik tiap kunci, untuk tombol "lihat" dan penjelasan dampak. */
    private const ROUTE_PUBLIK = [
        'sejarah' => 'profil',
        'visi_misi' => 'profil',
        'sambutan_kepsek' => 'beranda',
        'kurikulum' => 'kurikulum',
        'prestasi' => 'prestasi',
        'tata_tertib' => 'tata-tertib',
        'organisasi_siswa' => 'organisasi-siswa',
        'e_learning' => 'e-learning',
    ];

    public function index(): Response
    {
        return Inertia::render('Halaman/Index', [
            'daftar' => KontenHalaman::orderBy('id')->get()->map(fn (KontenHalaman $h) => [
                'id' => $h->id,
                'kunci' => $h->kunci,
                'judul' => $h->judul,
                'terbit' => $h->terbit,
                'adaNaskah' => filled($h->isi),
                'urlUbah' => route('admin.halaman.edit', $h),
                'urlPublik' => $h->terbit ? route(self::ROUTE_PUBLIK[$h->kunci] ?? 'beranda') : null,
            ]),
        ]);
    }

    public function edit(KontenHalaman $halaman): Response
    {
        return Inertia::render('Halaman/Form', [
            'halaman' => [
                'id' => $halaman->id,
                'kunci' => $halaman->kunci,
                'judul' => $halaman->judul,
                'isi' => $halaman->isi ?? '',
                'terbit' => $halaman->terbit,
            ],
            'aksi' => route('admin.halaman.update', $halaman),
        ]);
    }

    public function update(Request $request, KontenHalaman $halaman): RedirectResponse
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:150'],
            'isi' => ['nullable', 'string'],
            'terbit' => ['required', 'boolean'],
        ], [
            'judul.required' => 'Judul halaman wajib diisi.',
        ]);

        // Menerbitkan halaman kosong menghasilkan halaman setengah isi di situs
        // publik — persis yang ingin dicegah aturan penyembunyian navigasi.
        if ($data['terbit'] && blank($data['isi'])) {
            return back()
                ->withInput()
                ->withErrors(['isi' => 'Halaman tidak bisa diterbitkan selama isinya masih kosong.']);
        }

        $halaman->update($data);

        return to_route('admin.halaman.index')->with(
            'sukses',
            $data['terbit']
                ? "Halaman {$halaman->judul} disimpan dan tampil di situs."
                : "Halaman {$halaman->judul} disimpan sebagai draf dan disembunyikan dari navigasi."
        );
    }
}
