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
<li class="struktur-simpul">

    <div class="struktur-simpul__kepala">
        <div class="struktur-kartu surface-card px-4 py-3 text-center">
            <p class="font-heading text-sm font-semibold text-ink-deep">{{ $simpul->label }}</p>
            @if ($nama)
                <p class="mt-0.5 text-xs text-ink-muted">{{ $nama }}</p>
            @endif
        </div>

        {{-- Penasihat (Komite Sekolah) digambar DI SAMPING, bukan di bawah. --}}
        @foreach ($samping as $penasihat)
            <div class="struktur-penasihat rounded-md border border-dashed border-line-strong bg-paper-raised px-4 py-3 text-center">
                <p class="font-heading text-sm font-semibold text-ink-deep">{{ $penasihat->label }}</p>
                @if ($n = $penasihat->namaTampil())
                    <p class="mt-0.5 text-xs text-ink-muted">{{ $n }}</p>
                @endif
            </div>
        @endforeach
    </div>

    @foreach ($baris as $simpulBaris)
        {{-- Tiap `baris` digambar sebagai deretan terpisah. Baris ke-2 di bawah
             Wakil Kepala Sekolah memang menggantung pada keempat Waka sekaligus. --}}
        <ul class="struktur-baris" data-baris="{{ $loop->iteration }}">
            @foreach ($simpulBaris as $anak)
                <x-ui.simpul-struktur :simpul="$anak" />
            @endforeach
        </ul>
    @endforeach
</li>
