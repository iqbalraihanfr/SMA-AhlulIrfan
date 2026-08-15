<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['guru']));

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

foreach (array_filter((['guru']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php $foto = $guru->getFirstMediaUrl('foto', 'card'); ?>

<article class="rounded-lg border border-line bg-paper p-4 text-center shadow-card">
    <?php if($foto): ?>
        <img src="<?php echo e($foto); ?>" alt="Foto <?php echo e($guru->nama); ?>" width="128" height="128" loading="lazy"
             class="mx-auto h-32 w-32 rounded-full object-cover">
    <?php else: ?>
        
        <span aria-hidden="true"
              class="mx-auto grid h-32 w-32 place-items-center rounded-full bg-paper-sunken
                     font-heading text-3xl font-semibold text-brand">
            <?php echo e($guru->inisial()); ?>

        </span>
    <?php endif; ?>

    <h3 class="mt-4 font-heading text-base leading-snug font-semibold text-ink"><?php echo e($guru->nama); ?></h3>

    <?php if($peran = $guru->peran()): ?>
        <p class="mt-1 text-sm text-ink-muted"><?php echo e($peran); ?></p>
    <?php endif; ?>
</article>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/kartu-guru.blade.php ENDPATH**/ ?>