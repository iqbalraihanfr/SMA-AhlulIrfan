<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['judul', 'keterangan' => null]));

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

foreach (array_filter((['judul', 'keterangan' => null]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<section class="border-b border-line bg-paper-sunken">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 class="font-heading text-3xl leading-tight font-semibold text-ink sm:text-4xl"><?php echo e($judul); ?></h1>

        <?php if($keterangan): ?>
            <p class="mt-3 max-w-2xl text-ink-muted"><?php echo e($keterangan); ?></p>
        <?php endif; ?>
    </div>
</section>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/page-hero.blade.php ENDPATH**/ ?>