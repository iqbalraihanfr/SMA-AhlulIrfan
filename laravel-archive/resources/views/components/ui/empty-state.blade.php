@props(['judul' => 'Belum ada isi', 'pesan' => null])

<div {{ $attributes->class('empty-state') }}>
    <p class="empty-state__title">{{ $judul }}</p>
    @if ($pesan)<p class="empty-state__copy">{{ $pesan }}</p>@endif
    {{ $slot }}
</div>
