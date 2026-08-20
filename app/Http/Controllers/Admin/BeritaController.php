<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\StatusBerita;
use App\Http\Controllers\Controller;
use App\Http\Requests\BeritaRequest;
use App\Http\Requests\UnggahGambarBeritaRequest;
use App\Models\Berita;
use App\Services\GambarIsiBerita;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller implements HasMiddleware
{
    public function __construct(private readonly GambarIsiBerita $gambarIsiBerita) {}

    /**
     * Sejak Laravel 11 middleware dideklarasikan lewat HasMiddleware,
     * bukan $this->middleware() di konstruktor.
     */
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaBerita->value)];
    }

    public function index(Request $request): Response
    {
        $daftar = Berita::query()
            ->when($request->string('cari')->trim()->value(), fn ($q, $cari) => $q->where('judul', 'like', "%{$cari}%"))
            ->when($request->enum('status', StatusBerita::class), fn ($q, $status) => $q->where('status', $status))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Berita/Index', [
            'daftar' => $daftar->through(fn (Berita $b) => [
                'id' => $b->id,
                'judul' => $b->judul,
                'slug' => $b->slug,
                'status' => $b->status->value,
                'statusLabel' => $b->status->label(),
                'diterbitkanPada' => $b->diterbitkan_pada?->translatedFormat('j M Y'),
                'urlUbah' => route('admin.berita.edit', $b),
                'urlHapus' => route('admin.berita.destroy', $b),
            ]),
            'filter' => [
                'cari' => $request->string('cari')->value(),
                'status' => $request->string('status')->value(),
            ],
            'pilihanStatus' => $this->pilihanStatus(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Berita/Form', [
            'berita' => null,
            'pilihanStatus' => $this->pilihanStatus(),
            'aksi' => route('admin.berita.store'),
            'unggahGambarUrl' => null,
        ]);
    }

    public function store(BeritaRequest $request): RedirectResponse
    {
        $berita = Berita::create($this->data($request));

        $berita->update([
            'isi' => $this->gambarIsiBerita->normalisasi($berita, $berita->isi),
        ]);

        $this->simpanSampul($request, $berita);
        $berita->refresh();
        $this->gambarIsiBerita->selesaikanPenyimpanan($berita);

        return to_route('admin.berita.edit', $berita)
            ->with('sukses', 'Berita berhasil dibuat. Sekarang Anda dapat menyisipkan gambar ke dalam isi.');
    }

    public function edit(Berita $berita): Response
    {
        $sampul = $berita->getFirstMedia('sampul');

        return Inertia::render('Berita/Form', [
            'berita' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'ringkasan' => $berita->ringkasan,
                'isi' => $berita->isi,
                'status' => $berita->status->value,
                // Format datetime-local, bukan ISO penuh — input HTML menolak
                // nilai yang membawa zona waktu.
                'diterbitkanPada' => $berita->diterbitkan_pada?->format('Y-m-d\TH:i'),
                'sampulUrl' => $sampul?->getUrl('card'),
                'sampulAlt' => $sampul?->getCustomProperty('alt'),
            ],
            'pilihanStatus' => $this->pilihanStatus(),
            'aksi' => route('admin.berita.update', $berita),
            'unggahGambarUrl' => route('admin.berita.gambar.store', $berita),
        ]);
    }

    /** @return array<int, array{value: string, label: string}> */
    private function pilihanStatus(): array
    {
        return array_map(
            fn (StatusBerita $s) => ['value' => $s->value, 'label' => $s->label()],
            StatusBerita::cases()
        );
    }

    public function update(BeritaRequest $request, Berita $berita): RedirectResponse
    {
        $data = $this->data($request);
        $data['isi'] = $this->gambarIsiBerita->normalisasi($berita, $data['isi']);

        $berita->update($data);

        $this->simpanSampul($request, $berita);
        $berita->refresh();
        $this->gambarIsiBerita->selesaikanPenyimpanan($berita);

        return to_route('admin.berita.index')->with('sukses', 'Berita berhasil diperbarui.');
    }

    public function simpanGambarIsi(UnggahGambarBeritaRequest $request, Berita $berita): JsonResponse
    {
        $media = $berita->addMediaFromRequest('gambar')
            ->withCustomProperties([
                'alt' => $request->string('alt')->value(),
                'status_editor' => 'tertunda',
            ])
            ->toMediaCollection('isi');

        $ukuran = @getimagesize($media->getPath('hero'));

        return response()->json([
            'media' => [
                'id' => $media->id,
                'url' => $media->getUrl('hero'),
                'alt' => $media->getCustomProperty('alt'),
                'width' => is_array($ukuran) ? $ukuran[0] : null,
                'height' => is_array($ukuran) ? $ukuran[1] : null,
            ],
        ], 201);
    }

    public function destroy(Berita $berita): RedirectResponse
    {
        $berita->delete();

        return to_route('admin.berita.index')->with('sukses', 'Berita dihapus.');
    }

    private function data(BeritaRequest $request): array
    {
        $data = $request->safe()->except(['sampul', 'sampul_alt']);

        $data['slug'] = filled($data['slug'] ?? null)
            ? Str::slug($data['slug'])
            : Str::slug($data['judul']);

        $status = StatusBerita::from($data['status']);

        // Berita yang diterbitkan tanpa tanggal akan hilang dari situs publik
        // karena scope `terbit` menuntut tanggal terisi. Isi otomatis agar
        // admin tidak menerbitkan sesuatu yang diam-diam tidak muncul.
        if ($status === StatusBerita::Terbit && blank($data['diterbitkan_pada'] ?? null)) {
            $data['diterbitkan_pada'] = now();
        }

        $data['penulis_id'] ??= $request->user()->id;

        return $data;
    }

    private function simpanSampul(BeritaRequest $request, Berita $berita): void
    {
        if (! $request->hasFile('sampul')) {
            return;
        }

        $berita->addMediaFromRequest('sampul')
            ->withCustomProperties(['alt' => $request->string('sampul_alt')->value()])
            ->toMediaCollection('sampul');
    }
}
