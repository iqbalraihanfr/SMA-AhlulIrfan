<x-layout.situs judul="Struktur Organisasi"
    deskripsi="Struktur organisasi {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero judul="Struktur Organisasi" />

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div class="overflow-x-auto">
            <ul class="space-y-3 sm:flex sm:justify-center sm:space-y-0">
                <x-ui.simpul-struktur :simpul="$akar" />
            </ul>
        </div>

        <p class="mt-10 border-t border-line pt-6 text-sm text-ink-muted">
            Data nama diambil dari daftar
            <a href="{{ route('guru') }}" class="text-brand underline underline-offset-2">guru dan tenaga
            kependidikan</a>, sehingga bagan ini ikut diperbarui setiap ada perubahan personel.
        </p>
    </div>
</x-layout.situs>
