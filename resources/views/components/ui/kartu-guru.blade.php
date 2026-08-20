@props(['guru'])
@php $foto = $guru->getFirstMediaUrl('foto', 'card'); @endphp

<article class="surface-card overflow-hidden p-4 text-center">
    @if ($foto)
        <img src="{{ $foto }}" alt="Foto {{ $guru->nama }}" width="128" height="128" loading="lazy" class="mx-auto h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32">
    @else
        <span aria-hidden="true" class="mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand-soft font-heading text-3xl font-semibold text-brand sm:h-32 sm:w-32">{{ $guru->inisial() }}</span>
    @endif
    <h3 class="mt-4 font-heading text-base font-semibold leading-snug text-ink-deep">{{ $guru->nama }}</h3>
    @if ($peran = $guru->peran())<p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ $peran }}</p>@endif
</article>
