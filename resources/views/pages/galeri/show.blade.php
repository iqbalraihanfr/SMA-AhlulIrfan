<x-layout.situs :judul="$album->judul" :deskripsi="$album->deskripsi">
    <x-ui.page-hero :judul="$album->judul" :keterangan="$album->deskripsi" />

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p class="text-sm">
            <a href="{{ route('galeri.index') }}"
               class="text-brand underline-offset-4 hover:underline">&larr; Semua album</a>
        </p>

        @php $foto = $album->getMedia('foto'); @endphp

        @if ($foto->isEmpty())
            <x-ui.empty-state class="mt-8" judul="Album ini belum berisi foto" />
        @else
            <ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                @foreach ($foto as $gambar)
                    <li>
                        <a href="{{ $gambar->getUrl('hero') }}" target="_blank" rel="noopener"
                           class="block overflow-hidden rounded-md border border-line">
                            <img src="{{ $gambar->getUrl('thumbnail') }}"
                                 alt="{{ $gambar->getCustomProperty('alt') ?? $album->judul }}"
                                 width="320" height="320" loading="lazy"
                                 class="aspect-square w-full object-cover transition hover:opacity-90">
                        </a>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</x-layout.situs>
