<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Ekstrakurikuler','deskripsi' => 'Kegiatan ekstrakurikuler di '.e($situs->nama_sekolah).'.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Ekstrakurikuler','deskripsi' => 'Kegiatan ekstrakurikuler di '.e($situs->nama_sekolah).'.']); ?>

    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Ekstrakurikuler','keterangan' => 'Wadah pengembangan minat, bakat, serta karakter siswa di luar kegiatan akademik.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Ekstrakurikuler','keterangan' => 'Wadah pengembangan minat, bakat, serta karakter siswa di luar kegiatan akademik.']); ?>
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
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['judul' => 'Ekstrakurikuler segera hadir','pesan' => 'Daftar kegiatan ekstrakurikuler sedang kami siapkan.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Ekstrakurikuler segera hadir','pesan' => 'Daftar kegiatan ekstrakurikuler sedang kami siapkan.']); ?>
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
            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <?php $__currentLoopData = $daftar; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ekskul): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php $gambar = $ekskul->getFirstMediaUrl('gambar', 'card'); ?>

                    <article class="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                        <?php if($gambar): ?>
                            <img src="<?php echo e($gambar); ?>" alt="Kegiatan <?php echo e($ekskul->nama); ?>"
                                 width="800" height="500" loading="lazy"
                                 class="aspect-[8/5] w-full object-cover">
                        <?php endif; ?>

                        <div class="p-5">
                            <h2 class="font-heading text-lg font-semibold text-ink"><?php echo e($ekskul->nama); ?></h2>

                            <?php if($ekskul->deskripsi): ?>
                                <p class="mt-2 text-sm text-ink-muted"><?php echo e($ekskul->deskripsi); ?></p>
                            <?php endif; ?>

                            
                            <?php if($ekskul->pembina || $ekskul->jadwal): ?>
                                <dl class="mt-4 space-y-1 text-sm">
                                    <?php if($ekskul->pembina): ?>
                                        <div class="flex gap-2">
                                            <dt class="text-ink-faint">Pembina</dt>
                                            <dd class="text-ink-muted"><?php echo e($ekskul->pembina); ?></dd>
                                        </div>
                                    <?php endif; ?>
                                    <?php if($ekskul->jadwal): ?>
                                        <div class="flex gap-2">
                                            <dt class="text-ink-faint">Jadwal</dt>
                                            <dd class="text-ink-muted"><?php echo e($ekskul->jadwal); ?></dd>
                                        </div>
                                    <?php endif; ?>
                                </dl>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/ekstrakurikuler.blade.php ENDPATH**/ ?>