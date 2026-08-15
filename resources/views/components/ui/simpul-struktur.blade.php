@props(['simpul'])

@php
    $nama = $simpul->namaTampil();
    $baris = $simpul->barisBawahan();
    $samping = $simpul->anakSamping();
@endphp

{{--
  Satu simpul bagan beserta turunannya, dipanggil rekursif.

  Di bawah 640px seluruh bagan berubah jadi daftar bertingkat — bagan kotak
  yang menyusut sampai tidak terbaca lebih buruk daripada daftar yang jujur.
  Lihat Konvensi Komponen di AGENTS-SMA.md.
--}}
<li class="sm:flex sm:flex-col sm:items-center">

    <div class="sm:flex sm:items-center sm:gap-3">
        <div class="rounded-md border border-line bg-paper px-4 py-3 text-center shadow-card sm:min-w-48">
            <p class="font-heading text-sm font-semibold text-ink">{{ $simpul->label }}</p>
            @if ($nama)
                <p class="mt-0.5 text-xs text-ink-muted">{{ $nama }}</p>
            @endif
        </div>

        {{-- Penasihat (Komite Sekolah) digambar DI SAMPING, bukan di bawah. --}}
        @foreach ($samping as $penasihat)
            <div class="mt-2 rounded-md border border-dashed border-line bg-paper-raised px-4 py-3 text-center sm:mt-0 sm:min-w-48">
                <p class="font-heading text-sm font-semibold text-ink">{{ $penasihat->label }}</p>
                @if ($n = $penasihat->namaTampil())
                    <p class="mt-0.5 text-xs text-ink-muted">{{ $n }}</p>
                @endif
            </div>
        @endforeach
    </div>

    @foreach ($baris as $simpulBaris)
        {{-- Tiap `baris` digambar sebagai deretan terpisah. Baris ke-2 di bawah
             Wakil Kepala Sekolah memang menggantung pada keempat Waka sekaligus. --}}
        <ul class="mt-3 space-y-3 border-l border-line pl-4
                   sm:mt-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-6 sm:space-y-0 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-6">
            @foreach ($simpulBaris as $anak)
                <x-ui.simpul-struktur :simpul="$anak" />
            @endforeach
        </ul>
    @endforeach
</li>
