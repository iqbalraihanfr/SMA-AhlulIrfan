<x-layout.situs :judul="$berita->judul" :deskripsi="$berita->ringkasan">

    @php $hero = $berita->getFirstMediaUrl('sampul', 'hero'); @endphp

    <article class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p class="text-sm">
            <a href="{{ route('berita.index') }}"
               class="text-brand underline-offset-4 hover:underline">&larr; Semua berita</a>
        </p>

        <h1 class="mt-4 font-heading text-3xl leading-tight font-semibold text-ink sm:text-4xl">
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
                 alt="{{ $berita->getFirstMedia('sampul')?->getCustomProperty('alt') ?? $berita->judul }}"
                 width="1600" height="1000"
                 class="mt-8 w-full rounded-lg object-cover">
        @endif

        <div class="mt-8"><x-ui.prosa :html="$berita->isi" /></div>
    </article>

    @if ($lainnya->isNotEmpty())
        <section class="border-t border-line bg-paper-raised">
            <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
