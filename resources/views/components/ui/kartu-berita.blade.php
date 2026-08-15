@props(['berita'])

@php $sampul = $berita->getFirstMediaUrl('sampul', 'card'); @endphp

<article class="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
    @if ($sampul)
        <img src="{{ $sampul }}" alt="{{ $berita->getFirstMedia('sampul')?->getCustomProperty('alt') ?? $berita->judul }}"
             width="800" height="500" loading="lazy" class="aspect-[8/5] w-full object-cover">
    @endif

    <div class="p-5">
        @if ($berita->diterbitkan_pada)
            <time datetime="{{ $berita->diterbitkan_pada->toDateString() }}"
                  class="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {{ $berita->diterbitkan_pada->translatedFormat('j F Y') }}
            </time>
        @endif

        <h3 class="mt-2 font-heading text-lg leading-snug font-semibold text-ink">
            <a href="{{ route('berita.show', $berita) }}" class="underline-offset-4 hover:underline">
                {{ $berita->judul }}
            </a>
        </h3>

        @if ($berita->ringkasan)
            <p class="mt-2 line-clamp-3 text-sm text-ink-muted">{{ $berita->ringkasan }}</p>
        @endif
    </div>
</article>
