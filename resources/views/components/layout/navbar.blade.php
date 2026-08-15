@php
    /**
     * Tautan ke halaman berbasis prosa hanya muncul bila naskahnya sudah ada
     * (konten_halaman.terbit). Halaman setengah isi lebih merusak kepercayaan
     * calon orang tua daripada halaman yang belum ada.
     */
    $adaNaskah = fn (string $kunci) => in_array($kunci, $halamanTerbit, true);

    $menu = array_filter([
        [
            'label' => 'Profil',
            'anak' => array_filter([
                $adaNaskah('sejarah') || $adaNaskah('visi_misi') ? ['Profil Sekolah', route('profil')] : null,
                ['Struktur Organisasi', route('struktur')],
            ]),
        ],
        [
            'label' => 'Akademik',
            'anak' => array_filter([
                $adaNaskah('kurikulum') ? ['Kurikulum', route('kurikulum')] : null,
                ['Guru & Tenaga Kependidikan', route('guru')],
                ['Ekstrakurikuler', route('ekstrakurikuler')],
                ['Galeri', route('galeri.index')],
                $adaNaskah('prestasi') ? ['Prestasi Siswa', route('prestasi')] : null,
                $adaNaskah('organisasi_siswa') ? ['Organisasi Siswa', route('organisasi-siswa')] : null,
                $adaNaskah('tata_tertib') ? ['Tata Tertib', route('tata-tertib')] : null,
                $adaNaskah('e_learning') ? ['E-Learning', route('e-learning')] : null,
            ]),
        ],
        ['label' => 'Berita', 'tautan' => route('berita.index')],
        ['label' => 'Kontak', 'tautan' => route('kontak')],
    ], fn ($item) => ! isset($item['anak']) || count($item['anak']) > 0);
@endphp

<header x-data="{ buka: false }" class="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
         aria-label="Navigasi utama">

        <a href="{{ route('beranda') }}" class="flex items-center gap-3 rounded-md">
            @if ($situs->getFirstMediaUrl('logo'))
                <img src="{{ $situs->getFirstMediaUrl('logo') }}" alt="Logo {{ $situs->nama_sekolah }}"
                     width="40" height="40" class="h-10 w-10 object-contain">
            @else
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand font-heading
                             text-sm font-semibold text-on-brand">AI</span>
            @endif
            <span class="font-heading text-base leading-tight font-semibold text-ink sm:text-lg">
                {{ $situs->nama_sekolah }}
            </span>
        </a>

        {{-- Desktop --}}
        <ul x-data="{
                menuTerbuka: null,
                timeout: null,
                buka(index) {
                    clearTimeout(this.timeout);
                    this.menuTerbuka = index;
                },
                tutup() {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.menuTerbuka = null;
                    }, 120);
                },
                tutupSegera() {
                    clearTimeout(this.timeout);
                    this.menuTerbuka = null;
                }
            }"
            @mouseleave="tutup()"
            @focusout="if (!$el.contains($event.relatedTarget)) tutupSegera()"
            @click.outside="tutupSegera()"
            @keydown.escape.stop="tutupSegera()"
            class="hidden items-center gap-1 lg:flex">
            @foreach ($menu as $index => $item)
                @if (isset($item['tautan']))
                    @php
                        $aktif = request()->fullUrlIs($item['tautan'].'*');
                    @endphp
                    <li @mouseenter="tutupSegera()">
                        <a href="{{ $item['tautan'] }}"
                           @class([
                               'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken hover:text-ink',
                               'text-brand font-semibold' => $aktif,
                               'text-ink-muted' => ! $aktif,
                           ])>{{ $item['label'] }}</a>
                    </li>
                @else
                    @php
                        $apakahAktif = collect($item['anak'])->contains(fn ($anak) => request()->fullUrlIs($anak[1].'*'));
                    @endphp
                    <li @mouseenter="buka({{ $index }})"
                        @focusin="buka({{ $index }})"
                        class="relative">
                        <button type="button"
                                @click="menuTerbuka = (menuTerbuka === {{ $index }} ? null : {{ $index }})"
                                :aria-expanded="menuTerbuka === {{ $index }}"
                                @class([
                                    'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken hover:text-ink cursor-pointer',
                                    'text-brand font-semibold' => $apakahAktif,
                                    'text-ink-muted' => ! $apakahAktif,
                                ])>
                            <span>{{ $item['label'] }}</span>
                            <svg class="h-3.5 w-3.5 transition-transform duration-200 opacity-70"
                                 :class="{ 'rotate-180': menuTerbuka === {{ $index }} }"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div x-show="menuTerbuka === {{ $index }}"
                             x-transition:enter="transition ease-out duration-150"
                             x-transition:enter-start="opacity-0 translate-y-1"
                             x-transition:enter-end="opacity-100 translate-y-0"
                             x-transition:leave="transition ease-in duration-100"
                             x-transition:leave-start="opacity-100 translate-y-0"
                             x-transition:leave-end="opacity-0 translate-y-1"
                             x-cloak
                             class="absolute left-0 top-full z-50 pt-1.5 min-w-56">
                            <ul class="rounded-md border border-line bg-paper/95 p-1 shadow-card backdrop-blur">
                                @foreach ($item['anak'] as [$label, $tautan])
                                    @php
                                        $subAktif = request()->fullUrlIs($tautan.'*');
                                    @endphp
                                    <li>
                                        <a href="{{ $tautan }}"
                                           @class([
                                               'block rounded-sm px-3 py-2 text-sm transition hover:bg-paper-sunken hover:text-ink',
                                               'font-medium text-brand bg-paper-sunken/60' => $subAktif,
                                               'text-ink-muted' => ! $subAktif,
                                           ])>
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

        <button type="button" @click="buka = !buka" :aria-expanded="buka" aria-controls="menu-mobile"
                class="rounded-md p-2 text-ink-muted hover:bg-paper-sunken hover:text-ink transition lg:hidden">
            <span class="sr-only">Buka menu</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
                <path x-show="!buka" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
                <path x-show="buka" x-cloak stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
        </button>
    </nav>

    {{-- Mobile --}}
    <div id="menu-mobile" x-show="buka" x-transition x-cloak class="border-t border-line lg:hidden">
        <ul class="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            @foreach ($menu as $item)
                @if (isset($item['tautan']))
                    @php
                        $aktif = request()->fullUrlIs($item['tautan'].'*');
                    @endphp
                    <li>
                        <a href="{{ $item['tautan'] }}"
                           @class([
                               'block rounded-md px-3 py-2 text-sm font-medium transition',
                               'text-brand bg-paper-sunken/60 font-semibold' => $aktif,
                               'text-ink hover:bg-paper-sunken' => ! $aktif,
                           ])>{{ $item['label'] }}</a>
                    </li>
                @else
                    <li class="pt-2">
                        <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                            {{ $item['label'] }}
                        </p>
                        @foreach ($item['anak'] as [$label, $tautan])
                            @php
                                $subAktif = request()->fullUrlIs($tautan.'*');
                            @endphp
                            <a href="{{ $tautan }}"
                               @class([
                                   'block rounded-md px-3 py-2 text-sm transition',
                                   'text-brand bg-paper-sunken/60 font-medium' => $subAktif,
                                   'text-ink-muted hover:bg-paper-sunken hover:text-ink' => ! $subAktif,
                               ])>{{ $label }}</a>
                        @endforeach
                    </li>
                @endif
            @endforeach
        </ul>
    </div>
</header>
