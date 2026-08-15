@props(['html'])

{{--
  Merender HTML dari editor. WAJIB lewat mews/purifier — inilah satu-satunya
  tempat HTML tak tepercaya boleh masuk halaman.
--}}
<div {{ $attributes->class([
    'max-w-none space-y-4 text-ink-muted leading-relaxed',
    '[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:pt-2',
    '[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6',
    '[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6',
    '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2',
    '[&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink',
    '[&_.arab]:text-center [&_.arab]:text-2xl [&_.arab]:leading-loose [&_.arab]:text-ink',
]) }}>
    {!! clean($html) !!}
</div>
