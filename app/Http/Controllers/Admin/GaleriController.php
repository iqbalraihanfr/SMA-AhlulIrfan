<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Http\Controllers\Controller;
use App\Models\Album;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GaleriController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaGaleri->value)];
    }

    public function index(): Response
    {
        return Inertia::render('Galeri/Index', [
            'daftar' => Album::urut()->with('media')->get()->map(fn (Album $a) => [
                'id' => $a->id,
                'judul' => $a->judul,
                'jumlahFoto' => $a->getMedia('foto')->count(),
                'sampulUrl' => $a->getFirstMediaUrl('foto', 'thumbnail') ?: null,
                'urlUbah' => route('admin.galeri.edit', $a),
                'urlHapus' => route('admin.galeri.destroy', $a),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Galeri/Form', ['album' => null, 'aksi' => route('admin.galeri.store')]);
    }

    public function store(Request $request): RedirectResponse
    {
        $album = Album::create($this->validasi($request, null));

        return to_route('admin.galeri.edit', $album)
            ->with('sukses', "Album {$album->judul} dibuat. Sekarang unggah fotonya.");
    }

    public function edit(Album $galeri): Response
    {
        return Inertia::render('Galeri/Form', [
            'album' => [
                'id' => $galeri->id,
                'judul' => $galeri->judul,
                'slug' => $galeri->slug,
                'deskripsi' => $galeri->deskripsi,
                'urutan' => $galeri->urutan,
                'foto' => $galeri->getMedia('foto')->map(fn (Media $m) => [
                    'id' => $m->id,
                    'url' => $m->getUrl('thumbnail'),
                    'alt' => $m->getCustomProperty('alt'),
                    'urlHapus' => route('admin.galeri.foto.destroy', [$galeri, $m]),
                ])->values(),
            ],
            'aksi' => route('admin.galeri.update', $galeri),
            'aksiUnggah' => route('admin.galeri.foto.store', $galeri),
        ]);
    }

    public function update(Request $request, Album $galeri): RedirectResponse
    {
        $galeri->update($this->validasi($request, $galeri));

        return to_route('admin.galeri.index')->with('sukses', "Album {$galeri->judul} diperbarui.");
    }

    public function destroy(Album $galeri): RedirectResponse
    {
        $judul = $galeri->judul;
        $galeri->delete();

        return to_route('admin.galeri.index')->with('sukses', "Album {$judul} dihapus beserta fotonya.");
    }

    /** Unggah beberapa foto sekaligus; alt text wajib per berkas. */
    public function simpanFoto(Request $request, Album $galeri): RedirectResponse
    {
        $request->validate([
            'foto' => ['required', 'array', 'min:1'],
            'foto.*' => [File::image()->max(8 * 1024)],
            'alt' => ['required', 'array'],
            'alt.*' => ['required', 'string', 'max:200'],
        ], [
            'foto.required' => 'Pilih minimal satu foto.',
            'foto.*.max' => 'Ukuran tiap foto maksimal 8 MB.',
            'alt.*.required' => 'Setiap foto wajib diberi teks alternatif.',
        ]);

        foreach ($request->file('foto') as $i => $berkas) {
            $galeri->addMedia($berkas)
                ->withCustomProperties(['alt' => $request->input("alt.{$i}")])
                ->toMediaCollection('foto');
        }

        $jumlah = count($request->file('foto'));

        return back()->with('sukses', "{$jumlah} foto diunggah.");
    }

    public function hapusFoto(Album $galeri, Media $media): RedirectResponse
    {
        // Media polimorfik: tanpa pemeriksaan ini, URL yang dikarang bisa
        // menghapus foto milik album atau model lain.
        abort_unless($media->model_type === Album::class && $media->model_id === $galeri->id, 404);

        $media->delete();

        return back()->with('sukses', 'Foto dihapus.');
    }

    private function validasi(Request $request, ?Album $album): array
    {
        $data = $request->validate([
            'judul' => ['required', 'string', 'max:150'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'urutan' => ['nullable', 'integer', 'min:0', 'max:999'],
            'slug' => ['nullable', 'string', 'max:150', 'alpha_dash', Rule::unique('album', 'slug')->ignore($album)],
        ], [
            'judul.required' => 'Judul album wajib diisi.',
            'slug.unique' => 'Slug tersebut sudah dipakai album lain.',
        ]);

        $data['slug'] = filled($data['slug'] ?? null) ? Str::slug($data['slug']) : Str::slug($data['judul']);

        return $data;
    }
}
