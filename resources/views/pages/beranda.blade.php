<x-layout.situs>

    {{-- Urutan section beranda DIKUNCI (PRD-SMA.md Bagian 7):
         Hero → Sambutan → Kurikulum → Ekstrakurikuler → Guru → Berita → Galeri → CTA --}}

    {{-- Hero --}}
    <section class="border-b border-line bg-paper-sunken">
        <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p class="text-xs font-semibold uppercase tracking-widest text-brand">
                {{ $situs->nama_yayasan ?? 'Yayasan Ahlul Irfan Al-Kholily' }}
            </p>

            <h1 class="mt-3 max-w-3xl font-heading text-4xl leading-tight font-semibold text-ink sm:text-5xl">
                {{ $situs->nama_sekolah }}
            </h1>

            @if ($situs->semboyan)
                <p class="mt-4 max-w-2xl text-lg text-ink-muted">{{ $situs->semboyan }}</p>
            @endif

            <div class="mt-8 flex flex-wrap gap-3">
                <a href="{{ route('profil') }}"
                   class="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
                    Kenali Sekolah Kami
                </a>
                <a href="{{ route('kontak') }}"
                   class="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
                    Hubungi Kami
                </a>
            </div>
        </div>
    </section>

    {{-- Sambutan Kepala Sekolah --}}
    @if ($sambutan)
        <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <x-ui.section-heading kicker="Sambutan" :judul="$sambutan->judul" />
            <div class="mt-6 max-w-3xl">
                <x-ui.prosa :html="$sambutan->isi" class="line-clamp-none" />
            </div>
        </section>
    @endif

    {{-- Highlight Kurikulum --}}
    @if ($kurikulum)
        <section class="border-y border-line bg-paper-raised">
            <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <x-ui.section-heading kicker="Akademik" judul="Kurikulum" />
                <div class="mt-6 max-w-3xl">
                    <x-ui.prosa :html="$kurikulum->isi" />
                </div>
                <a href="{{ route('kurikulum') }}"
                   class="mt-6 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    Selengkapnya tentang kurikulum &rarr;
                </a>
            </div>
        </section>
    @endif

    {{-- Ekstrakurikuler --}}
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <x-ui.section-heading kicker="Kesiswaan" judul="Ekstrakurikuler"
            keterangan="Wadah pengembangan minat, bakat, dan karakter siswa di luar kegiatan akademik." />

        @if ($ekstrakurikuler->isEmpty())
            <x-ui.empty-state class="mt-8" judul="Ekstrakurikuler segera hadir"
                pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan." />
        @else
            <ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                @foreach ($ekstrakurikuler as $ekskul)
                    <li class="rounded-md border border-line bg-paper px-4 py-5 text-center shadow-card">
                        <span class="font-heading text-base font-semibold text-ink">{{ $ekskul->nama }}</span>
                    </li>
                @endforeach
            </ul>
        @endif
    </section>

    {{-- Guru --}}
    <section class="border-y border-line bg-paper-raised">
        <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <x-ui.section-heading kicker="Akademik" judul="Guru &amp; Tenaga Kependidikan" />

            @if ($pendidik->isEmpty())
                <x-ui.empty-state class="mt-8" judul="Data guru sedang disiapkan" />
            @else
                <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    @foreach ($pendidik as $guru)
                        <x-ui.kartu-guru :guru="$guru" />
                    @endforeach
                </div>

                <a href="{{ route('guru') }}"
                   class="mt-8 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    Lihat seluruh guru dan tenaga kependidikan &rarr;
                </a>
            @endif
        </div>
    </section>

    {{-- Berita Terbaru --}}
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <x-ui.section-heading kicker="Kabar" judul="Berita Terbaru" />

        @if ($beritaTerbaru->isEmpty())
            <x-ui.empty-state class="mt-8" judul="Belum ada berita"
                pesan="Kegiatan dan pengumuman sekolah akan tampil di sini." />
        @else
            <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($beritaTerbaru as $berita)
                    <x-ui.kartu-berita :berita="$berita" />
                @endforeach
            </div>
        @endif
    </section>

    {{-- CTA Kontak --}}
    <section class="bg-brand">
        <div class="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
            <h2 class="font-heading text-2xl font-semibold text-on-brand sm:text-3xl">
                Tertarik bergabung dengan kami?
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-on-brand/85">
                Hubungi sekolah untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-3">
                <a href="{{ route('kontak') }}"
                   class="rounded-md bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
                    Halaman Kontak
                </a>

                @if ($tautanWa = $situs->tautanWhatsapp('Assalamu\'alaikum, saya ingin bertanya tentang '.$situs->nama_sekolah))
                    <a href="{{ $tautanWa }}" target="_blank" rel="noopener"
                       class="rounded-md bg-highlight px-5 py-2.5 text-sm font-semibold text-on-highlight transition hover:opacity-90">
                        Chat WhatsApp
                    </a>
                @endif
            </div>
        </div>
    </section>

</x-layout.situs>
