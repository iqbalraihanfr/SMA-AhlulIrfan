<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Berita','deskripsi' => 'Kabar dan kegiatan terbaru '.e($situs->nama_sekolah).'.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Berita','deskripsi' => 'Kabar dan kegiatan terbaru '.e($situs->nama_sekolah).'.']); ?>
    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Berita','keterangan' => 'Kabar, kegiatan, dan pengumuman dari sekolah.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Berita','keterangan' => 'Kabar, kegiatan, dan pengumuman dari sekolah.']); ?>
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
        <?php if($daftar->isEmpty()): ?>
            <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['judul' => 'Belum ada berita','pesan' => 'Kegiatan dan pengumuman sekolah akan tampil di halaman ini.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Belum ada berita','pesan' => 'Kegiatan dan pengumuman sekolah akan tampil di halaman ini.']); ?>
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
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <?php $__currentLoopData = $daftar; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $berita): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if (isset($component)) { $__componentOriginal6477f1ab30d5388ac2a4ee7649d1aef7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal6477f1ab30d5388ac2a4ee7649d1aef7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.kartu-berita','data' => ['berita' => $berita]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.kartu-berita'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['berita' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($berita)]); ?>
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

            <div class="mt-10"><?php echo e($daftar->links()); ?></div>
        <?php endif; ?>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/berita/index.blade.php ENDPATH**/ ?>