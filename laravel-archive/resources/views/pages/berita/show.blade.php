@php
    $sampul = $berita->getFirstMedia('sampul');
    $hero = $sampul?->getUrl('hero');
    $altSampul = $sampul?->getCustomProperty('alt') ?? $berita->judul;
@endphp

<x-layout.situs :judul="$berita->judul" :deskripsi="$berita->ringkasan"
    :gambar="$hero" :gambar-alt="$altSampul" tipe="article">

    <article class="section-shell max-w-3xl py-14 sm:py-20">
        <p class="text-sm">
            <a href="{{ route('berita.index') }}"
               class="text-brand underline-offset-4 hover:underline">&larr; Semua berita</a>
        </p>

        <h1 class="mt-4 font-heading text-4xl leading-tight font-semibold tracking-tight text-ink-deep sm:text-5xl">
            {{ $berita->judul }}
        </h1>

        @if ($berita->diterbitkan_pada)
            <time datetime="{{ $berita->diterbitkan_pada->toDateString() }}"
                  class="mt-3 block text-sm text-ink-muted">
                {{ $berita->diterbitkan_pada->translatedFormat('j F Y') }}
            </time>
        @endif

        @if ($hero)
            <img src="{{ $hero }}"
                 alt="{{ $altSampul }}"
                 width="1600" height="1000"
                 class="mt-10 w-full rounded-md object-cover shadow-card">
        @endif

        <div class="mt-8"><x-ui.prosa :html="$berita->isi" /></div>
    </article>

    @if ($lainnya->isNotEmpty())
        <section class="section section--muted">
            <div class="section-shell">
                <x-ui.section-heading judul="Berita lainnya" />
                <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    @foreach ($lainnya as $lain)
                        <x-ui.kartu-berita :berita="$lain" />
                    @endforeach
                </div>
            </div>
        </section>
    @endif
</x-layout.situs>
