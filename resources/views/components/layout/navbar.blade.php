@php
    $adaNaskah = fn (string $kunci) => in_array($kunci, $halamanTerbit, true);
    $menu = array_filter([
        ['label' => 'Beranda', 'tautan' => route('beranda')],
        ['label' => 'Profil', 'anak' => array_filter([
            $adaNaskah('sejarah') || $adaNaskah('visi_misi') ? ['Profil Sekolah', route('profil')] : null,
            ['Struktur Organisasi', route('struktur')],
        ])],
        ['label' => 'Akademik', 'anak' => array_filter([
            $adaNaskah('kurikulum') ? ['Kurikulum', route('kurikulum')] : null,
            ['Guru & Tenaga Kependidikan', route('guru')],
            ['Ekstrakurikuler', route('ekstrakurikuler')],
            ['Galeri', route('galeri.index')],
            $adaNaskah('prestasi') ? ['Prestasi Siswa', route('prestasi')] : null,
            $adaNaskah('organisasi_siswa') ? ['Organisasi Siswa', route('organisasi-siswa')] : null,
            $adaNaskah('tata_tertib') ? ['Tata Tertib', route('tata-tertib')] : null,
            $adaNaskah('e_learning') ? ['E-Learning', route('e-learning')] : null,
        ])],
        ['label' => 'Berita', 'tautan' => route('berita.index')],
        ['label' => 'Kontak', 'tautan' => route('kontak')],
    ], fn ($item) => ! isset($item['anak']) || count($item['anak']) > 0);
    $kontakRingkas = array_filter([$situs->telepon, $situs->email]);

    // URL beranda merupakan prefix seluruh halaman. Ia harus dibandingkan
    // sebagai route yang persis agar tidak terlihat aktif di setiap halaman.
    $tautanAktif = fn (string $tautan): bool => $tautan === route('beranda')
        ? request()->routeIs('beranda')
        : request()->fullUrlIs($tautan.'*');
@endphp

<header x-data="{ buka: false }" @keydown.escape.window="buka = false" class="site-nav sticky top-0 z-40">
    @if ($kontakRingkas)
        <div class="site-utility hidden sm:block">
            <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs sm:px-6">
                <span>{{ $situs->nama_yayasan ?: 'Situs resmi sekolah' }}</span>
                <div class="flex items-center gap-4">
                    @if ($situs->telepon)<a href="tel:{{ preg_replace('/\D/', '', $situs->telepon) }}" class="hover:underline">{{ $situs->telepon }}</a>@endif
                    @if ($situs->email)<a href="mailto:{{ $situs->email }}" class="hover:underline">{{ $situs->email }}</a>@endif
                </div>
            </div>
        </div>
    @endif

    <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Navigasi utama">
        <a href="{{ route('beranda') }}" class="site-nav__brand flex min-w-0 items-center gap-3 rounded-md">
            @if ($logo = $situs->getFirstMediaUrl('logo'))
                <img src="{{ $logo }}" alt="Logo {{ $situs->nama_sekolah }}" width="44" height="44" class="h-11 w-11 shrink-0 object-contain">
            @else
                <span aria-hidden="true" class="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand font-heading text-sm font-semibold text-on-brand">AI</span>
            @endif
            <span class="truncate font-heading text-base font-semibold leading-tight text-ink sm:text-lg">{{ $situs->nama_sekolah }}</span>
        </a>

        <ul class="hidden items-center gap-1 lg:flex"
            x-data="{ menuTerbuka: null }"
            @click.outside="menuTerbuka = null"
            @focusout="if (!$el.contains($event.relatedTarget)) menuTerbuka = null"
            @keydown.escape.stop="menuTerbuka = null">
            @foreach ($menu as $index => $item)
                @if (isset($item['tautan']))
                    @php $aktif = $tautanAktif($item['tautan']); @endphp
                    <li>
                        <a href="{{ $item['tautan'] }}"
                           data-aktif="{{ $aktif ? 'true' : 'false' }}"
                           @if ($aktif) aria-current="page" @endif
                           class="site-nav__link rounded-md px-3 py-3 text-sm font-semibold">
                            {{ $item['label'] }}
                        </a>
                    </li>
                @else
                    @php $apakahAktif = collect($item['anak'])->contains(fn ($anak) => $tautanAktif($anak[1])); @endphp
                    <li class="relative"
                        @mouseenter="menuTerbuka = {{ $index }}"
                        @mouseleave="menuTerbuka = null"
                        @focusin="menuTerbuka = {{ $index }}">
                        <button type="button"
                                aria-haspopup="true"
                                @click="menuTerbuka = menuTerbuka === {{ $index }} ? null : {{ $index }}"
                                :aria-expanded="menuTerbuka === {{ $index }}"
                                class="site-nav__link inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-3 text-sm font-semibold"
                                data-aktif="{{ $apakahAktif ? 'true' : 'false' }}">
                            {{ $item['label'] }}
                            <svg class="h-4 w-4 opacity-60 transition-transform duration-150" :class="{ 'rotate-180': menuTerbuka === {{ $index }} }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" /></svg>
                        </button>
                        <div x-show="menuTerbuka === {{ $index }}" x-transition x-cloak class="absolute left-0 top-full z-50 w-64 pt-2">
                            <ul class="rounded-md border border-line bg-paper p-2 shadow-card">
                                @foreach ($item['anak'] as [$label, $tautan])
                                    @php $subAktif = $tautanAktif($tautan); @endphp
                                    <li>
                                        <a href="{{ $tautan }}"
                                           data-aktif="{{ $subAktif ? 'true' : 'false' }}"
                                           @if ($subAktif) aria-current="page" @endif
                                           class="block rounded-sm px-3 py-2.5 text-sm {{ $subAktif ? 'bg-brand-soft font-semibold text-brand' : 'text-ink-muted hover:bg-paper-sunken hover:text-ink' }}">
                                            {{ $label }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </li>
                @endif
            @endforeach
        </ul>

        <button type="button" @click="buka = !buka" :aria-expanded="buka" aria-controls="menu-mobile" class="rounded-md p-2 text-ink-muted transition hover:bg-paper-sunken hover:text-ink lg:hidden">
            <span class="sr-only" x-text="buka ? 'Tutup menu' : 'Buka menu'">Buka menu</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path x-show="!buka" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" /><path x-show="buka" x-cloak stroke-linecap="round" d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
    </nav>

    <div id="menu-mobile" x-show="buka" x-transition x-cloak class="border-t border-line bg-paper lg:hidden">
        <ul class="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            @foreach ($menu as $item)
                @if (isset($item['tautan']))
                    @php $aktif = $tautanAktif($item['tautan']); @endphp
                    <li>
                        <a href="{{ $item['tautan'] }}"
                           @click="buka = false"
                           @if ($aktif) aria-current="page" @endif
                           class="block rounded-md px-3 py-3 text-sm font-semibold {{ $aktif ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-paper-sunken' }}">
                            {{ $item['label'] }}
                        </a>
                    </li>
                @else
                    <li class="pt-2">
                        <p class="px-3 pb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">{{ $item['label'] }}</p>
                        <ul>
                            @foreach ($item['anak'] as [$label, $tautan])
                                @php $subAktif = $tautanAktif($tautan); @endphp
                                <li>
                                    <a href="{{ $tautan }}"
                                       @click="buka = false"
                                       @if ($subAktif) aria-current="page" @endif
                                       class="block rounded-md px-3 py-3 text-sm {{ $subAktif ? 'bg-brand-soft font-semibold text-brand' : 'text-ink-muted hover:bg-paper-sunken hover:text-ink' }}">
                                        {{ $label }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </li>
                @endif
            @endforeach
        </ul>
    </div>
</header>
