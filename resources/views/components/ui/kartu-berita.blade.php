@props(['berita', 'unggulan' => false])
@php $sampul = $berita->getFirstMediaUrl('sampul', 'card'); @endphp

<article @class(['surface-card group overflow-hidden', 'sm:col-span-2 sm:grid sm:grid-cols-2' => $unggulan])>
    @if ($sampul)
        <a href="{{ route('berita.show', $berita) }}" class="media-frame block h-full">
            <img src="{{ $sampul }}" alt="{{ $berita->getFirstMedia('sampul')?->getCustomProperty('alt') ?? $berita->judul }}" width="800" height="500" loading="lazy" class="aspect-[8/5] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]">
        </a>
    @endif
    <div class="flex flex-col p-5 sm:p-6">
        @if ($berita->diterbitkan_pada)<time datetime="{{ $berita->diterbitkan_pada->toDateString() }}" class="text-xs font-bold uppercase tracking-widest text-highlight">{{ $berita->diterbitkan_pada->translatedFormat('j F Y') }}</time>@endif
        <h3 class="mt-3 font-heading text-xl font-semibold leading-tight text-ink-deep"><a href="{{ route('berita.show', $berita) }}" class="underline-offset-4 decoration-highlight/60 group-hover:underline">{{ $berita->judul }}</a></h3>
        @if ($berita->ringkasan)<p class="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{{ $berita->ringkasan }}</p>@endif
        <a href="{{ route('berita.show', $berita) }}" class="mt-auto pt-5 text-sm font-bold text-brand hover:underline">Baca berita <span aria-hidden="true">&rarr;</span></a>
    </div>
</article>
