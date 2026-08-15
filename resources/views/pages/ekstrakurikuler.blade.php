<x-layout.situs judul="Ekstrakurikuler"
    deskripsi="Kegiatan ekstrakurikuler di {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero judul="Ekstrakurikuler"
        keterangan="Wadah pengembangan minat, bakat, serta karakter siswa di luar kegiatan akademik." />

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        @if ($daftar->isEmpty())
            <x-ui.empty-state judul="Ekstrakurikuler segera hadir"
                pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan." />
        @else
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($daftar as $ekskul)
                    @php $gambar = $ekskul->getFirstMediaUrl('gambar', 'card'); @endphp

                    <article class="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                        @if ($gambar)
                            <img src="{{ $gambar }}" alt="Kegiatan {{ $ekskul->nama }}"
                                 width="800" height="500" loading="lazy"
                                 class="aspect-[8/5] w-full object-cover">
                        @endif

                        <div class="p-5">
                            <h2 class="font-heading text-lg font-semibold text-ink">{{ $ekskul->nama }}</h2>

                            @if ($ekskul->deskripsi)
                                <p class="mt-2 text-sm text-ink-muted">{{ $ekskul->deskripsi }}</p>
                            @endif

                            {{-- Pembina dan jadwal belum ada di naskah sekolah.
                                 Tampil hanya bila terisi, tidak menyisakan baris kosong. --}}
                            @if ($ekskul->pembina || $ekskul->jadwal)
                                <dl class="mt-4 space-y-1 text-sm">
                                    @if ($ekskul->pembina)
                                        <div class="flex gap-2">
                                            <dt class="text-ink-faint">Pembina</dt>
                                            <dd class="text-ink-muted">{{ $ekskul->pembina }}</dd>
                                        </div>
                                    @endif
                                    @if ($ekskul->jadwal)
                                        <div class="flex gap-2">
                                            <dt class="text-ink-faint">Jadwal</dt>
                                            <dd class="text-ink-muted">{{ $ekskul->jadwal }}</dd>
                                        </div>
                                    @endif
                                </dl>
                            @endif
                        </div>
                    </article>
                @endforeach
            </div>
        @endif
    </div>
</x-layout.situs>
