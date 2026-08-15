<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\TipeSimpul;
use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StrukturController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaStruktur->value)];
    }

    public function index(): Response
    {
        return Inertia::render('Struktur/Index', [
            'daftar' => StrukturOrganisasi::with('guru')
                ->orderBy('atasan_id')->orderBy('baris')->orderBy('urutan')
                ->get()
                ->map(fn (StrukturOrganisasi $s) => [
                    'id' => $s->id,
                    'label' => $s->label,
                    'nama' => $s->namaTampil(),
                    'tipe' => $s->tipe->value,
                    'atasanId' => $s->atasan_id,
                    'baris' => $s->baris,
                    'urutan' => $s->urutan,
                    'urlUbah' => route('admin.struktur.edit', $s),
                    'urlHapus' => route('admin.struktur.destroy', $s),
                ]),
            'urlTambah' => route('admin.struktur.create'),
            'urlPublik' => route('struktur'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Struktur/Form', [
            'simpul' => null,
            'pilihan' => $this->pilihan(null),
            'aksi' => route('admin.struktur.store'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $simpul = StrukturOrganisasi::create($this->validasi($request, null));

        return to_route('admin.struktur.index')->with('sukses', "Simpul {$simpul->label} ditambahkan.");
    }

    public function edit(StrukturOrganisasi $struktur): Response
    {
        return Inertia::render('Struktur/Form', [
            'simpul' => [
                'id' => $struktur->id,
                'label' => $struktur->label,
                'guru_id' => $struktur->guru_id,
                'atasan_id' => $struktur->atasan_id,
                'tipe' => $struktur->tipe->value,
                'nama_luar' => $struktur->nama_luar,
                'baris' => $struktur->baris,
                'urutan' => $struktur->urutan,
            ],
            'pilihan' => $this->pilihan($struktur),
            'aksi' => route('admin.struktur.update', $struktur),
        ]);
    }

    public function update(Request $request, StrukturOrganisasi $struktur): RedirectResponse
    {
        $struktur->update($this->validasi($request, $struktur));

        return to_route('admin.struktur.index')->with('sukses', "Simpul {$struktur->label} diperbarui.");
    }

    public function destroy(StrukturOrganisasi $struktur): RedirectResponse
    {
        // Akar tidak boleh dihapus: tanpa akar, halaman bagan memberi 404 dan
        // tidak ada cara membuat akar baru dari antarmuka.
        abort_if($struktur->atasan_id === null, 422, 'Simpul teratas tidak bisa dihapus.');

        $label = $struktur->label;
        $struktur->delete();

        return to_route('admin.struktur.index')->with('sukses', "Simpul {$label} dihapus beserta turunannya.");
    }

    private function validasi(Request $request, ?StrukturOrganisasi $simpul): array
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'tipe' => ['required', Rule::enum(TipeSimpul::class)],
            'guru_id' => ['nullable', 'exists:guru,id'],
            'nama_luar' => ['nullable', 'string', 'max:150'],
            'atasan_id' => [
                'nullable',
                'exists:struktur_organisasi,id',
                // Simpul tidak boleh jadi atasannya sendiri — hasilnya pohon
                // melingkar dan render rekursif akan menggantung.
                Rule::notIn($simpul ? [$simpul->id] : []),
            ],
            'baris' => ['required', 'integer', 'min:1', 'max:9'],
            'urutan' => ['required', 'integer', 'min:0', 'max:99'],
        ], [
            'label.required' => 'Nama jabatan wajib diisi.',
            'atasan_id.not_in' => 'Simpul tidak bisa menjadi atasan dirinya sendiri.',
            'guru_id.exists' => 'Guru yang dipilih tidak ditemukan.',
        ]);

        // Simpul kelompok (Wali Kelas, Guru Mapel) memang tanpa nama; simpul
        // orang mengambil namanya dari relasi guru, bukan diketik ulang.
        if ($data['tipe'] !== TipeSimpul::Orang->value) {
            $data['guru_id'] = null;
        }

        if ($data['tipe'] === TipeSimpul::Orang->value) {
            $data['nama_luar'] = null;
        }

        return $data;
    }

    private function pilihan(?StrukturOrganisasi $simpul): array
    {
        return [
            'guru' => Guru::urut()->get(['id', 'nama'])->map(fn (Guru $g) => [
                'value' => $g->id,
                'label' => $g->nama,
            ]),
            'atasan' => StrukturOrganisasi::when($simpul, fn ($q) => $q->whereKeyNot($simpul->id))
                ->orderBy('label')
                ->get(['id', 'label'])
                ->map(fn (StrukturOrganisasi $s) => ['value' => $s->id, 'label' => $s->label]),
            'tipe' => [
                ['value' => TipeSimpul::Orang->value, 'label' => 'Orang — nama diambil dari data guru'],
                ['value' => TipeSimpul::Kelompok->value, 'label' => 'Kelompok — kotak tanpa nama'],
                ['value' => TipeSimpul::Penasihat->value, 'label' => 'Penasihat — digambar di samping atasannya'],
            ],
        ];
    }
}
