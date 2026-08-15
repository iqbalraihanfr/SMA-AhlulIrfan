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
use Illuminate\View\View;

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

    public function index(Request $request): View
    {
        $daftar = Berita::query()
            ->when($request->string('cari')->trim()->value(), fn ($q, $cari) => $q->where('judul', 'like', "%{$cari}%"))
            ->when($request->enum('status', StatusBerita::class), fn ($q, $status) => $q->where('status', $status))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString();

        return view('admin.berita.index', ['daftar' => $daftar]);
    }

    public function create(): View
    {
        return view('admin.berita.form', ['berita' => new Berita(['status' => StatusBerita::Draft])]);
    }

    public function store(BeritaRequest $request): RedirectResponse
    {
        $berita = Berita::create($this->data($request));

        $this->simpanSampul($request, $berita);

        return to_route('admin.berita.index')->with('sukses', 'Berita berhasil dibuat.');
    }

    public function edit(Berita $berita): View
    {
        return view('admin.berita.form', ['berita' => $berita]);
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
