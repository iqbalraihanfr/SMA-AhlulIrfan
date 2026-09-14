@php
    $sosial = array_filter(['Instagram' => $situs->instagram, 'Facebook' => $situs->facebook, 'YouTube' => $situs->youtube]);
@endphp

<footer class="mt-0 border-t border-line bg-paper-raised">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
            <p class="font-heading text-xl font-semibold text-ink-deep">{{ $situs->nama_sekolah }}</p>
            @if ($situs->nama_yayasan)<p class="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">Di bawah naungan {{ $situs->nama_yayasan }}.</p>@endif
            @if ($situs->semboyan)<p class="mt-5 max-w-sm border-s-2 border-highlight ps-4 font-heading text-lg italic leading-snug text-ink">&ldquo;{{ $situs->semboyan }}&rdquo;</p>@endif
        </div>
        <div class="space-y-3 text-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-highlight">Kontak</p>
            @if ($situs->alamat)<p class="leading-relaxed text-ink-muted">{{ $situs->alamat }}</p>@endif
            @if ($situs->telepon)<a class="block text-ink-muted hover:text-brand hover:underline" href="tel:{{ preg_replace('/\D/', '', $situs->telepon) }}">{{ $situs->telepon }}</a>@endif
            @if ($situs->email)<a class="block break-words text-ink-muted hover:text-brand hover:underline" href="mailto:{{ $situs->email }}">{{ $situs->email }}</a>@endif
            @if ($tautanWa = $situs->tautanWhatsapp())<a class="block text-ink-muted hover:text-brand hover:underline" href="{{ $tautanWa }}" target="_blank" rel="noopener">WhatsApp</a>@endif
        </div>
        <div class="space-y-3 text-sm">
            <p class="text-xs font-bold uppercase tracking-widest text-highlight">Jelajahi</p>
            <a class="block text-ink-muted hover:text-brand hover:underline" href="{{ route('profil') }}">Profil Sekolah</a>
            <a class="block text-ink-muted hover:text-brand hover:underline" href="{{ route('guru') }}">Guru &amp; Tendik</a>
            <a class="block text-ink-muted hover:text-brand hover:underline" href="{{ route('galeri.index') }}">Galeri Kegiatan</a>
            <a class="block text-ink-muted hover:text-brand hover:underline" href="{{ route('berita.index') }}">Berita Sekolah</a>
            @if ($sosial)<div class="flex flex-wrap gap-3 pt-2">@foreach ($sosial as $nama => $url)<a class="text-ink-muted hover:text-brand hover:underline" href="{{ $url }}" target="_blank" rel="noopener">{{ $nama }}</a>@endforeach</div>@endif
        </div>
    </div>
    <div class="border-t border-line"><div class="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-4 text-xs text-ink-muted sm:px-6"><span>&copy; {{ now()->year }} {{ $situs->nama_sekolah }}</span><span>Situs resmi sekolah</span></div></div>
</footer>
