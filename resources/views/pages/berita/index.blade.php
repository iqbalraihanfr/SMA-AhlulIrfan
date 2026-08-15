<x-layout.situs judul="Berita" deskripsi="Kabar dan kegiatan terbaru {{ $situs->nama_sekolah }}.">
    <x-ui.page-hero judul="Berita" keterangan="Kabar, kegiatan, dan pengumuman dari sekolah." />

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        @if ($daftar->isEmpty())
            <x-ui.empty-state judul="Belum ada berita"
                pesan="Kegiatan dan pengumuman sekolah akan tampil di halaman ini." />
        @else
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($daftar as $berita)
                    <x-ui.kartu-berita :berita="$berita" />
                @endforeach
            </div>

            <div class="mt-10">{{ $daftar->links() }}</div>
        @endif
    </div>
</x-layout.situs>
