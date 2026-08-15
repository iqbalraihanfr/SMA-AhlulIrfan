<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Guru & Tenaga Kependidikan','deskripsi' => 'Daftar pendidik dan tenaga kependidikan '.e($situs->nama_sekolah).'.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Guru & Tenaga Kependidikan','deskripsi' => 'Daftar pendidik dan tenaga kependidikan '.e($situs->nama_sekolah).'.']); ?>

    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Guru &amp; Tenaga Kependidikan','keterangan' => 'Tenaga pendidik dan kependidikan yang mendampingi peserta didik setiap hari.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Guru &amp; Tenaga Kependidikan','keterangan' => 'Tenaga pendidik dan kependidikan yang mendampingi peserta didik setiap hari.']); ?>
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

    <div class="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6">

        <section>
            <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => 'Pendidik']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Pendidik']); ?>
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

            <?php if($pendidik->isEmpty()): ?>
                <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['class' => 'mt-8','judul' => 'Data pendidik sedang disiapkan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-8','judul' => 'Data pendidik sedang disiapkan']); ?>
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
            <?php else: ?>
                <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <?php $__currentLoopData = $pendidik; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $orang): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php if (isset($component)) { $__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.kartu-guru','data' => ['guru' => $orang]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.kartu-guru'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['guru' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($orang)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7)): ?>
<?php $attributes = $__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7; ?>
<?php unset($__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7); ?>
<?php endif; ?>
<?php if (isset($__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7)): ?>
<?php $component = $__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7; ?>
<?php unset($__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7); ?>
<?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            <?php endif; ?>
        </section>

        <section>
            <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['judul' => 'Tenaga Kependidikan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Tenaga Kependidikan']); ?>
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

            <?php if($tendik->isEmpty()): ?>
                <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['class' => 'mt-8','judul' => 'Data tenaga kependidikan sedang disiapkan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-8','judul' => 'Data tenaga kependidikan sedang disiapkan']); ?>
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
            <?php else: ?>
                <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <?php $__currentLoopData = $tendik; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $orang): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php if (isset($component)) { $__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.kartu-guru','data' => ['guru' => $orang]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.kartu-guru'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['guru' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($orang)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7)): ?>
<?php $attributes = $__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7; ?>
<?php unset($__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7); ?>
<?php endif; ?>
<?php if (isset($__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7)): ?>
<?php $component = $__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7; ?>
<?php unset($__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7); ?>
<?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            <?php endif; ?>
        </section>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/guru.blade.php ENDPATH**/ ?>