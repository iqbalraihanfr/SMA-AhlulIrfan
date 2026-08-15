@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->class(
    'rounded-md border-line bg-paper text-ink shadow-card placeholder:text-ink-faint
     focus:border-brand focus:ring-brand disabled:opacity-50'
) }}>
