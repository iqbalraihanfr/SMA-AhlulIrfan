<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'judul',
    'kicker' => null,
    'keterangan' => null,
    'tengah' => false,
]));

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

foreach (array_filter(([
    'judul',
    'kicker' => null,
    'keterangan' => null,
    'tengah' => false,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div <?php echo e($attributes->class(['max-w-2xl', 'mx-auto text-center' => $tengah])); ?>>
    <?php if($kicker): ?>
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-brand"><?php echo e($kicker); ?></p>
    <?php endif; ?>

    <h2 class="font-heading text-2xl leading-tight font-semibold text-ink sm:text-3xl"><?php echo e($judul); ?></h2>

    <?php if($keterangan): ?>
        <p class="mt-3 text-ink-muted"><?php echo e($keterangan); ?></p>
    <?php endif; ?>
</div>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/section-heading.blade.php ENDPATH**/ ?>