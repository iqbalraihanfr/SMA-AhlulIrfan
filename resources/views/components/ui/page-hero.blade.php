@props(['judul', 'keterangan' => null])

<section class="border-b border-line bg-paper-sunken">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 class="font-heading text-3xl leading-tight font-semibold text-ink sm:text-4xl">{{ $judul }}</h1>

        @if ($keterangan)
            <p class="mt-3 max-w-2xl text-ink-muted">{{ $keterangan }}</p>
        @endif
    </div>
</section>
