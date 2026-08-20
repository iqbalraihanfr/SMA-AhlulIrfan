@props([
    'judul',
    'kicker' => null,
    'keterangan' => null,
    'tengah' => false,
])

<div {{ $attributes->class(['section-heading', 'mx-auto text-center' => $tengah]) }}>
    @if ($kicker)<p class="section-heading__kicker">{{ $kicker }}</p>@endif
    <h2 class="section-heading__title">{{ $judul }}</h2>
    @if ($keterangan)<p class="section-heading__copy {{ $tengah ? 'mx-auto' : '' }}">{{ $keterangan }}</p>@endif
</div>
