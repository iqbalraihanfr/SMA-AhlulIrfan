<x-app-layout>
    <x-slot name="header">
        <h1 class="font-heading text-xl font-semibold text-ink">Dasbor</h1>
        <p class="mt-1 text-sm text-ink-muted">Ringkasan isi situs dan kesiapan peluncuran.</p>
    </x-slot>

    <div class="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">

        <section>
            <h2 class="sr-only">Ringkasan isi</h2>
            <dl class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                @foreach ([
                    'Berita terbit' => $jumlah['beritaTerbit'],
                    'Guru & tendik' => $jumlah['guru'],
                    'Ekstrakurikuler' => $jumlah['ekstrakurikuler'],
                    'Album galeri' => $jumlah['album'],
                ] as $label => $nilai)
                    <div class="rounded-lg border border-line bg-paper p-4 shadow-card">
                        <dt class="text-sm text-ink-muted">{{ $label }}</dt>
                        <dd class="mt-1 font-heading text-2xl font-semibold text-ink">{{ $nilai }}</dd>
                    </div>
                @endforeach
            </dl>
        </section>

        <section class="rounded-lg border border-line bg-paper p-6 shadow-card">
            <h2 class="font-heading text-lg font-semibold text-ink">Kesiapan peluncuran</h2>
            <p class="mt-1 text-sm text-ink-muted">
                Daftar ini sengaja selalu tampil supaya kekurangan naskah tidak terlupakan sampai hari peluncuran.
            </p>

            <ul class="mt-5 divide-y divide-line">
                @foreach ($kesiapan as $item)
                    <li class="flex items-start gap-3 py-3">
                        <span aria-hidden="true"
                              @class([
                                  'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold',
                                  'bg-brand text-on-brand' => $item['siap'],
                                  'bg-paper-sunken text-ink-faint' => ! $item['siap'],
                              ])>{{ $item['siap'] ? '✓' : '·' }}</span>

                        <span>
                            <span class="text-sm font-medium text-ink">{{ $item['label'] }}</span>
                            <span class="sr-only">{{ $item['siap'] ? ' — sudah siap' : ' — belum siap' }}</span>

                            @unless ($item['siap'])
                                <span class="block text-sm text-ink-muted">{{ $item['catatan'] }}</span>
                            @endunless
                        </span>
                    </li>
                @endforeach
            </ul>
        </section>
    </div>
</x-app-layout>
