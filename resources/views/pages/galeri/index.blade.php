<x-layout.situs judul="Galeri" deskripsi="Dokumentasi kegiatan {{ $situs->nama_sekolah }}.">
    <x-ui.page-hero judul="Galeri" keterangan="Dokumentasi kegiatan dan suasana sekolah." />

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        @if ($album->isEmpty())
            <x-ui.empty-state judul="Galeri sedang disiapkan"
                pesan="Foto kegiatan sekolah akan segera kami unggah." />
        @else
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($album as $satu)
                    @php $sampul = $satu->getFirstMediaUrl('foto', 'card'); @endphp

                    <a href="{{ route('galeri.show', $satu) }}"
                       class="group overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                        @if ($sampul)
                            <img src="{{ $sampul }}" alt="{{ $satu->judul }}" width="800" height="600"
                                 loading="lazy" class="aspect-[4/3] w-full object-cover transition group-hover:opacity-90">
                        @else
                            <div class="grid aspect-[4/3] w-full place-items-center bg-paper-sunken text-sm text-ink-faint">
                                Belum ada foto
                            </div>
                        @endif

                        <div class="p-5">
                            <h2 class="font-heading text-lg font-semibold text-ink">{{ $satu->judul }}</h2>
                            <p class="mt-1 text-sm text-ink-muted">{{ $satu->getMedia('foto')->count() }} foto</p>
                        </div>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</x-layout.situs>
