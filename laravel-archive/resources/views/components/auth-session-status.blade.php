@props(['status'])

@if ($status)
    <div {{ $attributes->class('text-sm font-medium text-success') }}>{{ $status }}</div>
@endif
