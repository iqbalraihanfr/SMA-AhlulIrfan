<x-layout.situs judul="Ekstrakurikuler"
    deskripsi="Kegiatan ekstrakurikuler di {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero judul="Ekstrakurikuler"
        keterangan="Wadah pengembangan minat, bakat, serta karakter siswa di luar kegiatan akademik." />

    <div class="section-shell py-14 sm:py-20">
        @if ($daftar->isEmpty())
            <x-ui.empty-state judul="Ekstrakurikuler segera hadir"
                pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan." />
        @else
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($daftar as $ekskul)
                    @php $gambar = $ekskul->getFirstMediaUrl('gambar', 'card'); @endphp

                    <article class="surface-card group overflow-hidden">
                        @if ($gambar)
                            <img src="{{ $gambar }}" alt="Kegiatan {{ $ekskul->nama }}"
                                 width="800" height="500" loading="lazy"
                                 class="media-frame aspect-[8/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]">
                        @endif

                        <div class="p-6">
                            <h2 class="font-heading text-xl font-semibold text-ink-deep group-hover:text-brand">{{ $ekskul->nama }}</h2>

                            @if ($ekskul->deskripsi)
                                <p class="mt-3 text-sm leading-relaxed text-ink-muted">{{ $ekskul->deskripsi }}</p>
                            @endif

                            {{-- Pembina dan jadwal belum ada di naskah sekolah.
                                 Tampil hanya bila terisi, tidak menyisakan baris kosong. --}}
                            @if ($ekskul->pembina || $ekskul->jadwal)
                                <dl class="mt-4 space-y-1 text-sm">
                                    @if ($ekskul->pembina)
                                        <div class="flex gap-2">
                                            <dt class="font-medium text-ink-muted">Pembina</dt>
                                            <dd class="text-ink-muted">{{ $ekskul->pembina }}</dd>
                                        </div>
                                    @endif
                                    @if ($ekskul->jadwal)
                                        <div class="flex gap-2">
                                            <dt class="font-medium text-ink-muted">Jadwal</dt>
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
