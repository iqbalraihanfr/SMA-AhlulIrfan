@props([
    'judul' => 'Belum ada isi',
    'pesan' => null,
])

{{--
  Empty state WAJIB dirancang, bukan halaman kosong atau error.
  Konten sekolah masih berdatangan — lihat Konvensi Komponen di AGENTS-SMA.md.
--}}
<div {{ $attributes->class('rounded-lg border border-dashed border-line bg-paper-raised px-6 py-12 text-center') }}>
    <p class="font-heading text-lg font-semibold text-ink">{{ $judul }}</p>

    @if ($pesan)
        <p class="mx-auto mt-2 max-w-md text-sm text-ink-muted">{{ $pesan }}</p>
    @endif

    {{ $slot }}
</div>
