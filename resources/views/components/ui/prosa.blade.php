@props(['html'])

{{-- HTML editor selalu disanitasi sebelum dirender ke situs publik. --}}
<div {{ $attributes->class('prose-school') }}>
    {!! clean($html) !!}
</div>
