@php
    $hero = $situs->getFirstMediaUrl('hero') ?: asset('branding/og-default.png');

    /**
     * Ringkasan beranda berasal dari naskah CMS, tetapi tag HTML perlu diganti
     * menjadi spasi sebelum dipadatkan. `strip_tags()` saja menyatukan akhir
     * paragraf dengan awal paragraf berikutnya.
     */
    $ringkas = static function (string $html, int $batas): string {
        $teks = preg_replace('/<[^>]+>/', ' ', $html) ?? $html;

        return \Illuminate\Support\Str::limit(
            \Illuminate\Support\Str::squish(html_entity_decode($teks)),
            $batas,
        );
    };
@endphp

<x-layout.situs>
    {{-- Urutan beranda: Hero → Sambutan → Kurikulum → Ekstrakurikuler → Guru → Berita → Galeri → CTA. --}}
    <section class="site-hero" style="--hero-image: url('{{ $hero }}')">
        <div class="section-shell site-hero__inner">
            <div>
                <p class="site-hero__eyebrow">{{ $situs->nama_yayasan ?: 'Situs resmi sekolah' }}</p>
                <h1 class="site-hero__title">{{ $situs->nama_sekolah }}</h1>
                @if ($situs->semboyan)<p class="site-hero__copy">{{ $situs->semboyan }}</p>@endif
                <div class="mt-8 flex flex-wrap gap-3">
                    <a href="{{ route('profil') }}" class="button-primary">Kenali sekolah kami <span aria-hidden="true">&rarr;</span></a>
                    <a href="{{ route('kontak') }}" class="button-secondary">Hubungi sekolah</a>
                </div>
            </div>
        </div>
    </section>

    @if ($sambutan)
        <section class="section">
            <div class="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                <x-ui.section-heading kicker="Dari sekolah" :judul="$sambutan->judul" keterangan="Membangun ruang belajar yang berilmu, berkarakter, dan berakar pada nilai keislaman." />
                <div>
                    <p class="max-w-2xl text-base leading-8 text-ink-muted">
                        {{ $ringkas($sambutan->isi, 380) }}
                    </p>
                    <a href="{{ route('profil') }}#sambutan" class="mt-6 inline-flex text-sm font-bold text-brand hover:underline">Baca sambutan lengkap <span aria-hidden="true">&rarr;</span></a>
                </div>
            </div>
        </section>
    @endif

    @if ($kurikulum)
        <section class="section section--muted">
            <div class="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                <x-ui.section-heading kicker="Akademik" judul="Kurikulum" keterangan="Pembelajaran yang aktif, kreatif, dan terhubung dengan penguatan karakter Islami." />
                <div>
                    <p class="max-w-2xl text-base leading-8 text-ink-muted">
                        {{ $ringkas($kurikulum->isi, 420) }}
                    </p>
                    <a href="{{ route('kurikulum') }}" class="mt-6 inline-flex text-sm font-bold text-brand hover:underline">Lihat kurikulum lengkap <span aria-hidden="true">&rarr;</span></a>
                </div>
            </div>
        </section>
    @endif

    <section class="section">
        <div class="section-shell">
            <x-ui.section-heading kicker="Kesiswaan" judul="Ruang untuk bertumbuh" keterangan="Kegiatan ekstrakurikuler menjadi ruang bagi peserta didik untuk mengembangkan minat, bakat, dan kepemimpinan." />
            @if ($ekstrakurikuler->isEmpty())
                <x-ui.empty-state class="mt-10" judul="Ekstrakurikuler segera hadir" pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan." />
            @else
                <ul class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    @foreach ($ekstrakurikuler as $ekskul)
                        <li class="surface-card group p-5"><span class="font-heading text-lg font-semibold text-ink-deep transition-colors group-hover:text-brand">{{ $ekskul->nama }}</span><span class="mt-3 block text-xs font-bold uppercase tracking-widest text-ink-muted">Kegiatan siswa</span></li>
                    @endforeach
                </ul>
                <a href="{{ route('ekstrakurikuler') }}" class="mt-7 inline-flex text-sm font-bold text-brand hover:underline">Jelajahi semua kegiatan <span aria-hidden="true">&rarr;</span></a>
            @endif
        </div>
    </section>

    <section class="section section--muted">
        <div class="section-shell">
            <div class="flex flex-wrap items-end justify-between gap-4">
                <x-ui.section-heading kicker="Pendidik" judul="Orang-orang di balik pembelajaran" />
                <a href="{{ route('guru') }}" class="text-sm font-bold text-brand hover:underline">Lihat seluruh guru <span aria-hidden="true">&rarr;</span></a>
            </div>
            @if ($pendidik->isEmpty())
                <x-ui.empty-state class="mt-10" judul="Data guru sedang disiapkan" />
            @else
                <div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">@foreach ($pendidik as $guru)<x-ui.kartu-guru :guru="$guru" />@endforeach</div>
            @endif
        </div>
    </section>

    <section class="section">
        <div class="section-shell">
            <div class="flex flex-wrap items-end justify-between gap-4"><x-ui.section-heading kicker="Kabar sekolah" judul="Berita terbaru" /><a href="{{ route('berita.index') }}" class="text-sm font-bold text-brand hover:underline">Semua berita <span aria-hidden="true">&rarr;</span></a></div>
            @if ($beritaTerbaru->isEmpty())
                <x-ui.empty-state class="mt-10" judul="Belum ada berita" pesan="Kegiatan dan pengumuman sekolah akan tampil di sini." />
            @else
                <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">@foreach ($beritaTerbaru as $berita)<x-ui.kartu-berita :berita="$berita" />@endforeach</div>
            @endif
        </div>
    </section>

    <section class="section section--muted">
        <div class="section-shell">
            <div class="flex flex-wrap items-end justify-between gap-4"><x-ui.section-heading kicker="Dokumentasi" judul="Momen di sekolah" keterangan="Lihat kembali kegiatan dan suasana belajar di {{ $situs->nama_sekolah }}." /><a href="{{ route('galeri.index') }}" class="text-sm font-bold text-brand hover:underline">Buka galeri <span aria-hidden="true">&rarr;</span></a></div>
            @if ($galeriTerbaru->isEmpty())
                <x-ui.empty-state class="mt-10" judul="Galeri sedang disiapkan" pesan="Foto kegiatan sekolah akan segera kami unggah." />
            @else
                <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach ($galeriTerbaru as $album)
                        @php
                            $mediaSampul = $album->getFirstMedia('foto');
                            $sampul = $mediaSampul?->getUrl('card');
                            $altSampul = $mediaSampul?->getCustomProperty('alt') ?? $album->judul;
                        @endphp
                        <a href="{{ route('galeri.show', $album) }}" class="surface-card group overflow-hidden">
                            @if ($sampul)<div class="media-frame"><img src="{{ $sampul }}" alt="{{ $altSampul }}" width="800" height="600" loading="lazy" class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"></div>@else<div class="grid aspect-[4/3] place-items-center bg-paper-sunken text-sm text-ink-muted">Belum ada foto</div>@endif
                            <div class="p-4"><h3 class="font-heading font-semibold text-ink-deep group-hover:text-brand">{{ $album->judul }}</h3><p class="mt-1 text-xs text-ink-muted">{{ $album->getMedia('foto')->count() }} foto</p></div>
                        </a>
                    @endforeach
                </div>
            @endif
        </div>
    </section>

    <section class="bg-brand">
        <div class="section-shell py-16 text-center sm:py-20">
            <p class="text-xs font-bold uppercase tracking-widest text-highlight-soft">Langkah berikutnya</p>
            <h2 class="mx-auto mt-3 max-w-2xl font-heading text-3xl font-semibold leading-tight text-on-brand sm:text-4xl">Mari mengenal {{ $situs->nama_sekolah }} lebih dekat.</h2>
            <p class="mx-auto mt-4 max-w-xl leading-relaxed text-on-brand/85">Hubungi sekolah untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.</p>
            <div class="mt-8 flex flex-wrap justify-center gap-3"><a href="{{ route('kontak') }}" class="button-secondary">Lihat informasi kontak</a>@if ($tautanWa = $situs->tautanWhatsapp('Assalamu\'alaikum, saya ingin bertanya tentang '.$situs->nama_sekolah))<a href="{{ $tautanWa }}" target="_blank" rel="noopener" class="button-highlight">Chat WhatsApp</a>@endif</div>
        </div>
    </section>
</x-layout.situs>
