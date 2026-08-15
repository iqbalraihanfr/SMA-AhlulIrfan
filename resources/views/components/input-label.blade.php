@props(['value' => null])

<label {{ $attributes->class('block text-sm font-medium text-ink') }}>
    {{ $value ?? $slot }}
</label>
