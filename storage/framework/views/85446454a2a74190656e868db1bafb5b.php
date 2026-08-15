<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['html']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['html']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>


<div <?php echo e($attributes->class([
    'max-w-none space-y-4 text-ink-muted leading-relaxed',
    '[&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:pt-2',
    '[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6',
    '[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6',
    '[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2',
    '[&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink',
    '[&_.arab]:text-center [&_.arab]:text-2xl [&_.arab]:leading-loose [&_.arab]:text-ink',
])); ?>>
    <?php echo clean($html); ?>

</div>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/prosa.blade.php ENDPATH**/ ?>