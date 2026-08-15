<x-app-layout>
    <x-slot name="header">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="font-heading text-xl font-semibold text-ink">Berita</h1>
                <p class="mt-1 text-sm text-ink-muted">Kabar, kegiatan, dan pengumuman sekolah.</p>
            </div>

            <a href="{{ route('admin.berita.create') }}"
               class="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
                Tulis Berita
            </a>
        </div>
    </x-slot>

    <div class="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">

        <x-admin.notifikasi />

        <form method="GET" class="flex flex-wrap gap-3">
            <input type="search" name="cari" value="{{ request('cari') }}" placeholder="Cari judul berita"
                   class="w-full max-w-xs rounded-md border-line bg-paper text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:ring-brand">

            <select name="status"
                    class="rounded-md border-line bg-paper text-sm text-ink focus:border-brand focus:ring-brand">
                <option value="">Semua status</option>
                @foreach (\App\Enums\StatusBerita::cases() as $status)
                    <option value="{{ $status->value }}" @selected(request('status') === $status->value)>
                        {{ $status->label() }}
                    </option>
                @endforeach
            </select>

            <button type="submit"
                    class="rounded-md border border-line bg-paper px-4 py-2 text-sm font-medium text-ink hover:bg-paper-sunken">
                Terapkan
            </button>
        </form>

        @if ($daftar->isEmpty())
            <x-ui.empty-state judul="Belum ada berita"
                pesan="Mulai dengan menulis satu berita agar halaman Berita di situs tidak kosong saat peluncuran." />
        @else
            <div class="overflow-x-auto rounded-lg border border-line bg-paper shadow-card">
                <table class="w-full text-left text-sm">
                    <thead class="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                        <tr>
                            <th scope="col" class="px-4 py-3">Judul</th>
                            <th scope="col" class="px-4 py-3">Status</th>
                            <th scope="col" class="px-4 py-3">Terbit</th>
                            <th scope="col" class="px-4 py-3"><span class="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-line">
                        @foreach ($daftar as $berita)
                            <tr>
                                <td class="px-4 py-3">
                                    <a href="{{ route('admin.berita.edit', $berita) }}"
                                       class="font-medium text-ink underline-offset-4 hover:underline">
                                        {{ $berita->judul }}
                                    </a>
                                </td>
                                <td class="px-4 py-3">
                                    <span @class([
                                        'rounded-full px-2 py-0.5 text-xs font-medium',
                                        'bg-brand text-on-brand' => $berita->status === \App\Enums\StatusBerita::Terbit,
                                        'bg-paper-sunken text-ink-muted' => $berita->status === \App\Enums\StatusBerita::Draft,
                                    ])>{{ $berita->status->label() }}</span>
                                </td>
                                <td class="px-4 py-3 text-ink-muted">
                                    {{ $berita->diterbitkan_pada?->translatedFormat('j M Y') ?? '—' }}
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <form method="POST" action="{{ route('admin.berita.destroy', $berita) }}"
                                          onsubmit="return confirm('Hapus berita &quot;{{ $berita->judul }}&quot;? Tindakan ini tidak bisa dibatalkan.')">
                                        @csrf @method('DELETE')
                                        <button type="submit" class="text-sm text-danger underline-offset-4 hover:underline">
                                            Hapus
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            {{ $daftar->links() }}
        @endif
    </div>
</x-app-layout>
