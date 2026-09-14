@props(['messages'])

@if ($messages)
    <ul {{ $attributes->class('space-y-1 text-sm text-danger') }}>
        @foreach ((array) $messages as $message)
            <li>{{ $message }}</li>
        @endforeach
    </ul>
@endif
