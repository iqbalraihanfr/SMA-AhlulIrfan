@php
    $sosial = array_filter([
        'Instagram' => $situs->instagram,
        'Facebook' => $situs->facebook,
        'YouTube' => $situs->youtube,
    ]);
@endphp

<footer class="mt-16 border-t border-line bg-paper-sunken">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">

        <div class="space-y-3">
            <p class="font-heading text-lg font-semibold text-ink">{{ $situs->nama_sekolah }}</p>

            @if ($situs->nama_yayasan)
                <p class="text-sm text-ink-muted">Di bawah naungan {{ $situs->nama_yayasan }}</p>
            @endif

            @if ($situs->semboyan)
                <p class="text-sm italic text-ink-muted">&ldquo;{{ $situs->semboyan }}&rdquo;</p>
            @endif
        </div>

        <div class="space-y-2 text-sm">
            <p class="font-semibold text-ink">Kontak</p>

            @if ($situs->alamat)
                <p class="text-ink-muted">{{ $situs->alamat }}</p>
            @endif

            @if ($situs->telepon)
                <p><a class="text-ink-muted underline-offset-2 hover:underline"
                      href="tel:{{ preg_replace('/\D/', '', $situs->telepon) }}">{{ $situs->telepon }}</a></p>
            @endif

            @if ($situs->email)
                <p><a class="text-ink-muted underline-offset-2 hover:underline"
                      href="mailto:{{ $situs->email }}">{{ $situs->email }}</a></p>
            @endif

            @if ($tautanWa = $situs->tautanWhatsapp())
                <p><a class="text-ink-muted underline-offset-2 hover:underline" href="{{ $tautanWa }}"
                      target="_blank" rel="noopener">WhatsApp</a></p>
            @endif
        </div>

        <div class="space-y-2 text-sm">
            <p class="font-semibold text-ink">Tautan</p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="{{ route('guru') }}">Guru &amp; Tenaga Kependidikan</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="{{ route('ekstrakurikuler') }}">Ekstrakurikuler</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="{{ route('berita.index') }}">Berita</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="{{ route('kontak') }}">Kontak</a></p>

            @if ($sosial)
                <div class="flex gap-3 pt-2">
                    @foreach ($sosial as $nama => $url)
                        <a class="text-ink-muted underline-offset-2 hover:underline" href="{{ $url }}"
                           target="_blank" rel="noopener">{{ $nama }}</a>
                    @endforeach
                </div>
            @endif
        </div>
    </div>

    <div class="border-t border-line">
        <div class="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-muted sm:px-6">
            &copy; {{ now()->year }} {{ $situs->nama_sekolah }}.
        </div>
    </div>
</footer>
