{{--
  Halaman ini TIDAK PERNAH disembunyikan meski datanya belum lengkap — situs
  sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya.
  Bagian yang kosong ditandai jelas, bukan disamarkan.
--}}
<x-layout.situs judul="Kontak" deskripsi="Alamat dan kontak {{ $situs->nama_sekolah }}.">

    <x-ui.page-hero judul="Kontak"
        keterangan="Hubungi kami untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya." />

    <div class="section-shell grid gap-10 py-14 sm:py-20 lg:grid-cols-2">

        <div class="surface-card space-y-6 p-6 sm:p-8">
            <dl class="space-y-5">
                <div>
                    <dt class="text-sm font-semibold text-ink">Alamat</dt>
                    <dd class="mt-1 text-ink-muted">
                        {{ $situs->alamat ?: 'Alamat lengkap sedang dilengkapi.' }}
                    </dd>
                </div>

                <div>
                    <dt class="text-sm font-semibold text-ink">Telepon</dt>
                    <dd class="mt-1 text-ink-muted">
                        @if ($situs->telepon)
                            <a href="tel:{{ preg_replace('/\D/', '', $situs->telepon) }}"
                               class="underline underline-offset-2">{{ $situs->telepon }}</a>
                        @else
                            Belum tersedia.
                        @endif
                    </dd>
                </div>

                <div>
                    <dt class="text-sm font-semibold text-ink">Email</dt>
                    <dd class="mt-1 text-ink-muted">
                        @if ($situs->email)
                            <a href="mailto:{{ $situs->email }}" class="underline underline-offset-2">{{ $situs->email }}</a>
                        @else
                            Belum tersedia.
                        @endif
                    </dd>
                </div>

                @if ($situs->npsn)
                    <div>
                        <dt class="text-sm font-semibold text-ink">NPSN</dt>
                        <dd class="mt-1 text-ink-muted">{{ $situs->npsn }}</dd>
                    </div>
                @endif

                @if ($situs->akreditasi)
                    <div>
                        <dt class="text-sm font-semibold text-ink">Akreditasi</dt>
                        <dd class="mt-1 text-ink-muted">{{ $situs->akreditasi }}</dd>
                    </div>
                @endif
            </dl>

            @if ($tautanWa = $situs->tautanWhatsapp('Assalamu\'alaikum, saya ingin bertanya tentang '.$situs->nama_sekolah))
                <a href="{{ $tautanWa }}" target="_blank" rel="noopener"
                   class="button-highlight">
                    Chat WhatsApp
                </a>
            @endif
        </div>

        <div class="surface-card overflow-hidden p-2">
            @if ($situs->peta_lat && $situs->peta_lng)
                <iframe
                    title="Peta lokasi {{ $situs->nama_sekolah }}"
                    class="aspect-[4/3] w-full rounded-lg border border-line"
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.openstreetmap.org/export/embed.html?bbox={{ $situs->peta_lng - 0.01 }},{{ $situs->peta_lat - 0.01 }},{{ $situs->peta_lng + 0.01 }},{{ $situs->peta_lat + 0.01 }}&layer=mapnik&marker={{ $situs->peta_lat }},{{ $situs->peta_lng }}"></iframe>
            @else
                <x-ui.empty-state judul="Peta lokasi belum tersedia"
                    pesan="Titik koordinat sekolah sedang kami lengkapi." />
            @endif
        </div>
    </div>
</x-layout.situs>
