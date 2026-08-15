<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'judul' => 'Belum ada isi',
    'pesan' => null,
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
    'judul' => 'Belum ada isi',
    'pesan' => null,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>


<div <?php echo e($attributes->class('rounded-lg border border-dashed border-line bg-paper-raised px-6 py-12 text-center')); ?>>
    <p class="font-heading text-lg font-semibold text-ink"><?php echo e($judul); ?></p>

    <?php if($pesan): ?>
        <p class="mx-auto mt-2 max-w-md text-sm text-ink-muted"><?php echo e($pesan); ?></p>
    <?php endif; ?>

    <?php echo e($slot); ?>

</div>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/empty-state.blade.php ENDPATH**/ ?>