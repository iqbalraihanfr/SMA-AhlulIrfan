<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Profil Sekolah']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Profil Sekolah']); ?>
    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Profil Sekolah','keterangan' => 'Sejarah, visi dan misi, serta sambutan Kepala Sekolah.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Profil Sekolah','keterangan' => 'Sejarah, visi dan misi, serta sambutan Kepala Sekolah.']); ?>
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

    <div class="mx-auto max-w-3xl space-y-16 px-4 py-12 sm:px-6">

        <?php if($sejarah): ?>
            <section id="sejarah">
                <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => $sejarah->judul]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sejarah->judul)]); ?>
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
                <div class="mt-6"><?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $sejarah->isi]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sejarah->isi)]); ?>
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
            </section>
        <?php endif; ?>

        <?php if($visiMisi): ?>
            <section id="visi-misi">
                <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => $visiMisi->judul]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($visiMisi->judul)]); ?>
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
                <div class="mt-6"><?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $visiMisi->isi]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($visiMisi->isi)]); ?>
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
            </section>
        <?php endif; ?>

        <?php if($sambutan): ?>
            <section id="sambutan">
                <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => $sambutan->judul]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sambutan->judul)]); ?>
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
                <div class="mt-6"><?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $sambutan->isi]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sambutan->isi)]); ?>
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
            </section>
        <?php endif; ?>

        <?php if(! $sejarah && ! $visiMisi && ! $sambutan): ?>
            <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['judul' => 'Profil sedang disiapkan','pesan' => 'Naskah profil sekolah belum tersedia. Silakan kembali lagi nanti.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Profil sedang disiapkan','pesan' => 'Naskah profil sekolah belum tersedia. Silakan kembali lagi nanti.']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3607a477fdef7402bc742abad5df9c51)): ?>
<?php $attributes = $__attributesOriginal3607a477fdef7402bc742abad5df9c51; ?>
<?php unset($__attributesOriginal3607a477fdef7402bc742abad5df9c51); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3607a477fdef7402bc742abad5df9c51)): ?>
<?php $component = $__componentOriginal3607a477fdef7402bc742abad5df9c51; ?>
<?php unset($__componentOriginal3607a477fdef7402bc742abad5df9c51); ?>
<?php endif; ?>
        <?php endif; ?>

        <p class="border-t border-line pt-8">
            <a href="<?php echo e(route('struktur')); ?>"
               class="text-sm font-semibold text-brand underline-offset-4 hover:underline">
                Lihat struktur organisasi sekolah &rarr;
            </a>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/profil.blade.php ENDPATH**/ ?>