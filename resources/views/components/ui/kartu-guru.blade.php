@props(['guru'])

@php $foto = $guru->getFirstMediaUrl('foto', 'card'); @endphp

<article class="rounded-lg border border-line bg-paper p-4 text-center shadow-card">
    @if ($foto)
        <img src="{{ $foto }}" alt="Foto {{ $guru->nama }}" width="128" height="128" loading="lazy"
             class="mx-auto h-32 w-32 rounded-full object-cover">
    @else
        {{-- Tanpa foto: tampilkan inisial, BUKAN gambar rusak. --}}
        <span aria-hidden="true"
              class="mx-auto grid h-32 w-32 place-items-center rounded-full bg-paper-sunken
                     font-heading text-3xl font-semibold text-brand">
            {{ $guru->inisial() }}
        </span>
    @endif

    <h3 class="mt-4 font-heading text-base leading-snug font-semibold text-ink">{{ $guru->nama }}</h3>

    @if ($peran = $guru->peran())
        <p class="mt-1 text-sm text-ink-muted">{{ $peran }}</p>
    @endif
</article>
