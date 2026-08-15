<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => $berita->judul,'deskripsi' => $berita->ringkasan]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($berita->judul),'deskripsi' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($berita->ringkasan)]); ?>

    <?php $hero = $berita->getFirstMediaUrl('sampul', 'hero'); ?>

    <article class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p class="text-sm">
            <a href="<?php echo e(route('berita.index')); ?>"
               class="text-brand underline-offset-4 hover:underline">&larr; Semua berita</a>
        </p>

        <h1 class="mt-4 font-heading text-3xl leading-tight font-semibold text-ink sm:text-4xl">
            <?php echo e($berita->judul); ?>

        </h1>

        <?php if($berita->diterbitkan_pada): ?>
            <time datetime="<?php echo e($berita->diterbitkan_pada->toDateString()); ?>"
                  class="mt-3 block text-sm text-ink-muted">
                <?php echo e($berita->diterbitkan_pada->translatedFormat('j F Y')); ?>

            </time>
        <?php endif; ?>

        <?php if($hero): ?>
            <img src="<?php echo e($hero); ?>"
                 alt="<?php echo e($berita->getFirstMedia('sampul')?->getCustomProperty('alt') ?? $berita->judul); ?>"
                 width="1600" height="1000"
                 class="mt-8 w-full rounded-lg object-cover">
        <?php endif; ?>

        <div class="mt-8"><?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $berita->isi]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($berita->isi)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $attributes = $__attributesOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $component = $__componentOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__componentOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?></div>
    </article>

    <?php if($lainnya->isNotEmpty()): ?>
        <section class="border-t border-line bg-paper-raised">
            <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => 'Berita lainnya']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Berita lainnya']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f)): ?>
<?php $attributes = $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f; ?>
<?php unset($__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f)): ?>
<?php $component = $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f; ?>
<?php unset($__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f); ?>
<?php endif; ?>
                <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <?php $__currentLoopData = $lainnya; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $lain): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php if (isset($component)) { $__componentOriginal6477f1ab30d5388ac2a4ee7649d1aef7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal6477f1ab30d5388ac2a4ee7649d1aef7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.kartu-berita','data' => ['berita' => $lain]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.kartu-berita'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['berita' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($lain)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal6477f1ab30d5388ac2a4ee7649d1aef7)): ?>
<?php $attributes = $__attributesOriginal6477f1ab30d5388ac2a4ee7649d1aef7; ?>
<?php unset($__attributesOriginal6477f1ab30d5388ac2a4ee7649d1aef7); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal6477f1ab30d5388ac2a4ee7649d1aef7)): ?>
<?php $component = $__componentOriginal6477f1ab30d5388ac2a4ee7649d1aef7; ?>
<?php unset($__componentOriginal6477f1ab30d5388ac2a4ee7649d1aef7); ?>
<?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            </div>
        </section>
    <?php endif; ?>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/berita/show.blade.php ENDPATH**/ ?>