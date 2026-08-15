@props([
    'judul',
    'kicker' => null,
    'keterangan' => null,
    'tengah' => false,
])

<div {{ $attributes->class(['max-w-2xl', 'mx-auto text-center' => $tengah]) }}>
    @if ($kicker)
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">{{ $kicker }}</p>
    @endif

    <h2 class="font-heading text-2xl leading-tight font-semibold text-ink sm:text-3xl">{{ $judul }}</h2>

    @if ($keterangan)
        <p class="mt-3 text-ink-muted">{{ $keterangan }}</p>
    @endif
</div>
