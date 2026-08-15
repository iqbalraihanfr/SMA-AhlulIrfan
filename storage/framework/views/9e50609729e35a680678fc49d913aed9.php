<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Struktur Organisasi','deskripsi' => 'Struktur organisasi '.e($situs->nama_sekolah).'.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Struktur Organisasi','deskripsi' => 'Struktur organisasi '.e($situs->nama_sekolah).'.']); ?>

    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Struktur Organisasi']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Struktur Organisasi']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8)): ?>
<?php $attributes = $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8; ?>
<?php unset($__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8)): ?>
<?php $component = $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8; ?>
<?php unset($__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8); ?>
<?php endif; ?>

    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div class="overflow-x-auto">
            <ul class="space-y-3 sm:flex sm:justify-center sm:space-y-0">
                <?php if (isset($component)) { $__componentOriginal74ba3005d81290c23aa172d55b778bc4 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74ba3005d81290c23aa172d55b778bc4 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.simpul-struktur','data' => ['simpul' => $akar]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.simpul-struktur'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['simpul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($akar)]); ?>
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
            </ul>
        </div>

        <p class="mt-10 border-t border-line pt-6 text-sm text-ink-muted">
            Data nama diambil dari daftar
            <a href="<?php echo e(route('guru')); ?>" class="text-brand underline underline-offset-2">guru dan tenaga
            kependidikan</a>, sehingga bagan ini ikut diperbarui setiap ada perubahan personel.
        </p>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3)): ?>
<?php $attributes = $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3; ?>
<?php unset($__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3)): ?>
<?php $component = $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3; ?>
<?php unset($__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3); ?>
<?php endif; ?>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/struktur.blade.php ENDPATH**/ ?>