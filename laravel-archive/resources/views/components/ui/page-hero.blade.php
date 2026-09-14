@props(['judul', 'keterangan' => null, 'gambar' => null, 'kicker' => 'Situs resmi sekolah'])

<section @class(['border-b border-line bg-paper-raised', 'site-hero' => $gambar]) @if($gambar) style="--hero-image: url('{{ $gambar }}')" @endif>
    <div class="section-shell py-14 sm:py-20">
        <p class="section-heading__kicker {{ $gambar ? 'text-highlight-soft' : '' }}">{{ $kicker }}</p>
        <h1 class="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-ink-deep sm:text-5xl {{ $gambar ? 'text-on-brand' : '' }}">{{ $judul }}</h1>
        @if ($keterangan)<p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted {{ $gambar ? 'text-on-brand/85' : '' }}">{{ $keterangan }}</p>@endif
    </div>
</section>
