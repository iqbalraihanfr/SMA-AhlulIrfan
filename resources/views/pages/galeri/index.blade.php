<x-layout.situs judul="Galeri" deskripsi="Dokumentasi kegiatan {{ $situs->nama_sekolah }}.">
    <x-ui.page-hero judul="Galeri" keterangan="Dokumentasi kegiatan dan suasana sekolah." />

    <div class="section-shell py-14 sm:py-20">
        @if ($album->isEmpty())
            <x-ui.empty-state judul="Galeri sedang disiapkan"
                pesan="Foto kegiatan sekolah akan segera kami unggah." />
        @else
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($album as $satu)
                    @php
                        $mediaSampul = $satu->getFirstMedia('foto');
                        $sampul = $mediaSampul?->getUrl('card');
                        $altSampul = $mediaSampul?->getCustomProperty('alt') ?? $satu->judul;
                    @endphp

                    <a href="{{ route('galeri.show', $satu) }}"
                       class="surface-card group overflow-hidden">
                        @if ($sampul)
                            <img src="{{ $sampul }}" alt="{{ $altSampul }}" width="800" height="600"
                                 loading="lazy" class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]">
                        @else
                            <div class="grid aspect-[4/3] w-full place-items-center bg-paper-sunken text-sm text-ink-muted">
                                Belum ada foto
                            </div>
                        @endif

                        <div class="p-5">
                            <h2 class="font-heading text-xl font-semibold text-ink-deep group-hover:text-brand">{{ $satu->judul }}</h2>
                            <p class="mt-1 text-sm text-ink-muted">{{ $satu->getMedia('foto')->count() }} foto</p>
                        </div>
                    </a>
                @endforeach
            </div>
        @endif
    </div>
</x-layout.situs>
