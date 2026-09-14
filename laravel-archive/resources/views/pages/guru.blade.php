<x-layout.situs judul="Guru & Tenaga Kependidikan"
    deskripsi="Daftar pendidik dan tenaga kependidikan {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero :judul="'Guru & Tenaga Kependidikan'"
        keterangan="Tenaga pendidik dan kependidikan yang mendampingi peserta didik setiap hari." />

    <div class="section-shell space-y-20 py-14 sm:py-20">

        <section>
            <x-ui.section-heading kicker="Pembelajaran" judul="Pendidik" keterangan="Guru yang mendampingi peserta didik dalam proses belajar dan bertumbuh." />

            @if ($pendidik->isEmpty())
                <x-ui.empty-state class="mt-8" judul="Data pendidik sedang disiapkan" />
            @else
                <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    @foreach ($pendidik as $orang)
                        <x-ui.kartu-guru :guru="$orang" />
                    @endforeach
                </div>
            @endif
        </section>

        <section>
            <x-ui.section-heading kicker="Layanan sekolah" judul="Tenaga Kependidikan" keterangan="Tim yang memastikan layanan sekolah berjalan setiap hari." />

            @if ($tendik->isEmpty())
                <x-ui.empty-state class="mt-8" judul="Data tenaga kependidikan sedang disiapkan" />
            @else
                <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    @foreach ($tendik as $orang)
                        <x-ui.kartu-guru :guru="$orang" />
                    @endforeach
                </div>
            @endif
        </section>
    </div>
</x-layout.situs>
