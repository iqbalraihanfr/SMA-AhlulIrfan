<x-layout.situs judul="Profil Sekolah">
    <x-ui.page-hero judul="Profil Sekolah"
        keterangan="Sejarah, visi dan misi, serta sambutan Kepala Sekolah." />

    <div class="mx-auto max-w-3xl space-y-16 px-4 py-12 sm:px-6">

        @if ($sejarah)
            <section id="sejarah">
                <x-ui.section-heading :judul="$sejarah->judul" />
                <div class="mt-6"><x-ui.prosa :html="$sejarah->isi" /></div>
            </section>
        @endif

        @if ($visiMisi)
            <section id="visi-misi">
                <x-ui.section-heading :judul="$visiMisi->judul" />
                <div class="mt-6"><x-ui.prosa :html="$visiMisi->isi" /></div>
            </section>
        @endif

        @if ($sambutan)
            <section id="sambutan">
                <x-ui.section-heading :judul="$sambutan->judul" />
                <div class="mt-6"><x-ui.prosa :html="$sambutan->isi" /></div>
            </section>
        @endif

        @if (! $sejarah && ! $visiMisi && ! $sambutan)
            <x-ui.empty-state judul="Profil sedang disiapkan"
                pesan="Naskah profil sekolah belum tersedia. Silakan kembali lagi nanti." />
        @endif

        <p class="border-t border-line pt-8">
            <a href="{{ route('struktur') }}"
               class="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                Lihat struktur organisasi sekolah &rarr;
            </a>
        </p>
    </div>
</x-layout.situs>
