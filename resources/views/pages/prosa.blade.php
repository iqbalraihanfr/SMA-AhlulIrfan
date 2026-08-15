{{-- Halaman generik berbasis prosa: kurikulum, prestasi, tata tertib, dll. --}}
<x-layout.situs :judul="$halaman->judul">
    <x-ui.page-hero :judul="$halaman->judul" />

    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <x-ui.prosa :html="$halaman->isi" />
    </div>
</x-layout.situs>
