<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Http\Controllers\Controller;
use App\Models\Ekstrakurikuler;
use App\Support\AturanGambar;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EkstrakurikulerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaEkstrakurikuler->value)];
    }

    public function index(): Response
    {
        return Inertia::render('Ekstrakurikuler/Index', [
            'daftar' => Ekstrakurikuler::urut()->get()->map(fn (Ekstrakurikuler $e) => [
                'id' => $e->id,
                'nama' => $e->nama,
                'pembina' => $e->pembina,
                'jadwal' => $e->jadwal,
                'adaGambar' => filled($e->getFirstMediaUrl('gambar')),
                'urlUbah' => route('admin.ekstrakurikuler.edit', $e),
                'urlHapus' => route('admin.ekstrakurikuler.destroy', $e),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Ekstrakurikuler/Form', [
            'ekskul' => null,
            'aksi' => route('admin.ekstrakurikuler.store'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $ekskul = Ekstrakurikuler::create($this->validasi($request, null));
        $this->simpanGambar($request, $ekskul);

        return to_route('admin.ekstrakurikuler.index')->with('sukses', "{$ekskul->nama} ditambahkan.");
    }

    public function edit(Ekstrakurikuler $ekstrakurikuler): Response
    {
        $gambar = $ekstrakurikuler->getFirstMedia('gambar');

        return Inertia::render('Ekstrakurikuler/Form', [
            'ekskul' => [
                'id' => $ekstrakurikuler->id,
                'nama' => $ekstrakurikuler->nama,
                'slug' => $ekstrakurikuler->slug,
                'deskripsi' => $ekstrakurikuler->deskripsi,
                'pembina' => $ekstrakurikuler->pembina,
                'jadwal' => $ekstrakurikuler->jadwal,
                'urutan' => $ekstrakurikuler->urutan,
                'gambarUrl' => $gambar?->getUrl('card'),
                'gambarAlt' => $gambar?->getCustomProperty('alt'),
            ],
            'aksi' => route('admin.ekstrakurikuler.update', $ekstrakurikuler),
        ]);
    }

    public function update(Request $request, Ekstrakurikuler $ekstrakurikuler): RedirectResponse
    {
        $ekstrakurikuler->update($this->validasi($request, $ekstrakurikuler));
        $this->simpanGambar($request, $ekstrakurikuler);

        return to_route('admin.ekstrakurikuler.index')->with('sukses', "{$ekstrakurikuler->nama} diperbarui.");
    }

    public function destroy(Ekstrakurikuler $ekstrakurikuler): RedirectResponse
    {
        $nama = $ekstrakurikuler->nama;
        $ekstrakurikuler->delete();

        return to_route('admin.ekstrakurikuler.index')->with('sukses', "{$nama} dihapus.");
    }

    private function validasi(Request $request, ?Ekstrakurikuler $ekskul): array
    {
        $data = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            // Pembina dan jadwal belum ada di naskah sekolah — tetap opsional
            // supaya tidak menghambat, dan hanya tampil di situs bila terisi.
            'pembina' => ['nullable', 'string', 'max:150'],
            'jadwal' => ['nullable', 'string', 'max:150'],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:999'],
            'slug' => ['nullable', 'string', 'max:100', 'alpha_dash', Rule::unique('ekstrakurikuler', 'slug')->ignore($ekskul)],
        ], [
            'nama.required' => 'Nama ekstrakurikuler wajib diisi.',
            'slug.unique' => 'Slug tersebut sudah dipakai ekstrakurikuler lain.',
        ]);

        $data['slug'] = filled($data['slug'] ?? null) ? Str::slug($data['slug']) : Str::slug($data['nama']);

        return $data;
    }

    private function simpanGambar(Request $request, Ekstrakurikuler $ekskul): void
    {
        $request->validate([
            'gambar' => ['nullable', AturanGambar::statis(5 * 1024)],
            'gambar_alt' => ['nullable', 'required_with:gambar', 'string', 'max:200'],
        ], [
            'gambar.mimes' => 'Gambar harus berformat JPG, PNG, atau WebP.',
            'gambar_alt.required_with' => 'Teks alternatif gambar wajib diisi.',
        ]);

        if (! $request->hasFile('gambar')) {
            return;
        }

        $ekskul->addMediaFromRequest('gambar')
            ->withCustomProperties(['alt' => $request->string('gambar_alt')->value()])
            ->toMediaCollection('gambar');
    }
}
