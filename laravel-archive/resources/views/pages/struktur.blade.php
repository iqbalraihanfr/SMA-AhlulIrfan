<x-layout.situs judul="Struktur Organisasi"
    deskripsi="Struktur organisasi {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero judul="Struktur Organisasi" />

    <div class="section-shell py-14 sm:py-20">
        <div class="struktur-viewport" role="region" tabindex="0"
             aria-label="Bagan struktur organisasi; geser secara mendatar bila bagan melebihi lebar layar">
            <figure class="struktur-bagan" data-bagan-organisasi>
                <figcaption class="sr-only">
                    Bagan struktur organisasi {{ $situs->nama_sekolah }}
                </figcaption>

                <ul class="struktur-bagan__akar">
                    <x-ui.simpul-struktur :simpul="$akar" />
                </ul>
            </figure>
        </div>

        <p class="mt-10 border-t border-line pt-6 text-sm text-ink-muted">
            Data nama diambil dari daftar
            <a href="{{ route('guru') }}" class="text-brand underline underline-offset-2">guru dan tenaga
            kependidikan</a>, sehingga bagan ini ikut diperbarui setiap ada perubahan personel.
        </p>
    </div>
</x-layout.situs>
