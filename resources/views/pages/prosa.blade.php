{{-- Halaman generik berbasis prosa: kurikulum, prestasi, tata tertib, dll. --}}
<x-layout.situs :judul="$halaman->judul" :gambar="$halaman->getFirstMediaUrl('gambar') ?: null">
    <x-ui.page-hero :judul="$halaman->judul" />

    <div class="section-shell py-14 sm:py-20">
        <x-ui.prosa :html="$halaman->isi" />
    </div>
</x-layout.situs>
