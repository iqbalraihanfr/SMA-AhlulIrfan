<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\StatusBerita;
use App\Http\Controllers\Controller;
use App\Http\Requests\BeritaRequest;
use App\Models\Berita;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller implements HasMiddleware
{
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
        ]);
    }

    public function store(BeritaRequest $request): RedirectResponse
    {
        $berita = Berita::create($this->data($request));

        $this->simpanSampul($request, $berita);

        return to_route('admin.berita.index')->with('sukses', 'Berita berhasil dibuat.');
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
        $berita->update($this->data($request));

        $this->simpanSampul($request, $berita);

        return to_route('admin.berita.index')->with('sukses', 'Berita berhasil diperbarui.');
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
