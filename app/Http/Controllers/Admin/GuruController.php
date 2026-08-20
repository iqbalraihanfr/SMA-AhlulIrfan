<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\KategoriGuru;
use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Support\AturanGambar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ATURAN PRIVASI: formulir ini tidak boleh punya kolom identitas kependudukan
 * apa pun. Naskah sumber memuat data sensitif, jadi larangan ini bukan
 * teoretis.
 */
class GuruController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaGuru->value)];
    }

    public function index(): Response
    {
        return Inertia::render('Guru/Index', [
            'daftar' => Guru::urut()->get()->map(fn (Guru $g) => [
                'id' => $g->id,
                'nama' => $g->nama,
                'kategori' => $g->kategori->value,
                'kategoriLabel' => $g->kategori->label(),
                'peran' => $g->peran(),
                'aktif' => $g->aktif,
                'fotoUrl' => $g->getFirstMediaUrl('foto', 'thumbnail') ?: null,
                'inisial' => $g->inisial(),
                'urlUbah' => route('admin.guru.edit', $g),
                'urlHapus' => route('admin.guru.destroy', $g),
            ]),
            'pilihanKategori' => $this->pilihanKategori(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Guru/Form', [
            'guru' => null,
            'pilihanKategori' => $this->pilihanKategori(),
            'aksi' => route('admin.guru.store'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validasi($request);

        $guru = Guru::create($data);
        $this->simpanFoto($request, $guru);

        return to_route('admin.guru.index')->with('sukses', "{$guru->nama} ditambahkan.");
    }

    public function edit(Guru $guru): Response
    {
        $foto = $guru->getFirstMedia('foto');

        return Inertia::render('Guru/Form', [
            'guru' => [
                'id' => $guru->id,
                'nama' => $guru->nama,
                'kategori' => $guru->kategori->value,
                'jenis_kelamin' => $guru->jenis_kelamin,
                'jabatan' => $guru->jabatan,
                'mata_pelajaran' => $guru->mata_pelajaran,
                'urutan' => $guru->urutan,
                'aktif' => $guru->aktif,
                'fotoUrl' => $foto?->getUrl('card'),
                'fotoAlt' => $foto?->getCustomProperty('alt'),
            ],
            'pilihanKategori' => $this->pilihanKategori(),
            'aksi' => route('admin.guru.update', $guru),
        ]);
    }

    public function update(Request $request, Guru $guru): RedirectResponse
    {
        $guru->update($this->validasi($request));
        $this->simpanFoto($request, $guru);

        return to_route('admin.guru.index')->with('sukses', "{$guru->nama} diperbarui.");
    }

    public function destroy(Guru $guru): RedirectResponse
    {
        $nama = $guru->nama;
        $guru->delete();

        return to_route('admin.guru.index')->with('sukses', "{$nama} dihapus.");
    }

    private function validasi(Request $request): array
    {
        return $request->validate([
            'nama' => ['required', 'string', 'max:150'],
            'kategori' => ['required', Rule::enum(KategoriGuru::class)],
            'jenis_kelamin' => ['nullable', 'in:L,P'],
            'jabatan' => ['nullable', 'string', 'max:100'],
            'mata_pelajaran' => ['nullable', 'string', 'max:100'],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:999'],
            'aktif' => ['required', 'boolean'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'kategori.required' => 'Pilih pendidik atau tenaga kependidikan.',
            'jenis_kelamin.in' => 'Jenis kelamin harus L atau P.',
        ]);
    }

    private function simpanFoto(Request $request, Guru $guru): void
    {
        $request->validate([
            'foto' => ['nullable', AturanGambar::statis(5 * 1024)],
            'foto_alt' => ['nullable', 'required_with:foto', 'string', 'max:200'],
        ], [
            'foto.max' => 'Ukuran foto maksimal 5 MB.',
            'foto.mimes' => 'Foto harus berformat JPG, PNG, atau WebP.',
            'foto_alt.required_with' => 'Teks alternatif foto wajib diisi.',
        ]);

        if (! $request->hasFile('foto')) {
            return;
        }

        $guru->addMediaFromRequest('foto')
            ->withCustomProperties(['alt' => $request->string('foto_alt')->value()])
            ->toMediaCollection('foto');
    }

    /** @return array<int, array{value: string, label: string}> */
    private function pilihanKategori(): array
    {
        return array_map(
            fn (KategoriGuru $k) => ['value' => $k->value, 'label' => $k->label()],
            KategoriGuru::cases()
        );
    }
}
