<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['simpul']));

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

foreach (array_filter((['simpul']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php
    $nama = $simpul->namaTampil();
    $baris = $simpul->barisBawahan();
    $samping = $simpul->anakSamping();
?>


<li class="sm:flex sm:flex-col sm:items-center">

    <div class="sm:flex sm:items-center sm:gap-3">
        <div class="rounded-md border border-line bg-paper px-4 py-3 text-center shadow-card sm:min-w-48">
            <p class="font-heading text-sm font-semibold text-ink"><?php echo e($simpul->label); ?></p>
            <?php if($nama): ?>
                <p class="mt-0.5 text-xs text-ink-muted"><?php echo e($nama); ?></p>
            <?php endif; ?>
        </div>

        
        <?php $__currentLoopData = $samping; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $penasihat): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="mt-2 rounded-md border border-dashed border-line bg-paper-raised px-4 py-3 text-center sm:mt-0 sm:min-w-48">
                <p class="font-heading text-sm font-semibold text-ink"><?php echo e($penasihat->label); ?></p>
                <?php if($n = $penasihat->namaTampil()): ?>
                    <p class="mt-0.5 text-xs text-ink-muted"><?php echo e($n); ?></p>
                <?php endif; ?>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>

    <?php $__currentLoopData = $baris; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $simpulBaris): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        
        <ul class="mt-3 space-y-3 border-l border-line pl-4
                   sm:mt-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-6 sm:space-y-0 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-6">
            <?php $__currentLoopData = $simpulBaris; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $anak): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php if (isset($component)) { $__componentOriginal74ba3005d81290c23aa172d55b778bc4 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74ba3005d81290c23aa172d55b778bc4 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.simpul-struktur','data' => ['simpul' => $anak]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.simpul-struktur'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['simpul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($anak)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal74ba3005d81290c23aa172d55b778bc4)): ?>
<?php $attributes = $__attributesOriginal74ba3005d81290c23aa172d55b778bc4; ?>
<?php unset($__attributesOriginal74ba3005d81290c23aa172d55b778bc4); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal74ba3005d81290c23aa172d55b778bc4)): ?>
<?php $component = $__componentOriginal74ba3005d81290c23aa172d55b778bc4; ?>
<?php unset($__componentOriginal74ba3005d81290c23aa172d55b778bc4); ?>
<?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</li>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/ui/simpul-struktur.blade.php ENDPATH**/ ?>