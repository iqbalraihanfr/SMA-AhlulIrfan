
<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => ['judul' => 'Kontak','deskripsi' => 'Alamat dan kontak '.e($situs->nama_sekolah).'.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Kontak','deskripsi' => 'Alamat dan kontak '.e($situs->nama_sekolah).'.']); ?>

    <?php if (isset($component)) { $__componentOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalc2ac24e8b26a95c4ab17f6ffff7eecc8 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.page-hero','data' => ['judul' => 'Kontak','keterangan' => 'Hubungi kami untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.page-hero'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Kontak','keterangan' => 'Hubungi kami untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.']); ?>
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

    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">

        <div class="space-y-6">
            <dl class="space-y-5">
                <div>
                    <dt class="text-sm font-semibold text-ink">Alamat</dt>
                    <dd class="mt-1 text-ink-muted">
                        <?php echo e($situs->alamat ?: 'Alamat lengkap sedang dilengkapi.'); ?>

                    </dd>
                </div>

                <div>
                    <dt class="text-sm font-semibold text-ink">Telepon</dt>
                    <dd class="mt-1 text-ink-muted">
                        <?php if($situs->telepon): ?>
                            <a href="tel:<?php echo e(preg_replace('/\D/', '', $situs->telepon)); ?>"
                               class="underline underline-offset-2"><?php echo e($situs->telepon); ?></a>
                        <?php else: ?>
                            Belum tersedia.
                        <?php endif; ?>
                    </dd>
                </div>

                <div>
                    <dt class="text-sm font-semibold text-ink">Email</dt>
                    <dd class="mt-1 text-ink-muted">
                        <?php if($situs->email): ?>
                            <a href="mailto:<?php echo e($situs->email); ?>" class="underline underline-offset-2"><?php echo e($situs->email); ?></a>
                        <?php else: ?>
                            Belum tersedia.
                        <?php endif; ?>
                    </dd>
                </div>

                <?php if($situs->npsn): ?>
                    <div>
                        <dt class="text-sm font-semibold text-ink">NPSN</dt>
                        <dd class="mt-1 text-ink-muted"><?php echo e($situs->npsn); ?></dd>
                    </div>
                <?php endif; ?>

                <?php if($situs->akreditasi): ?>
                    <div>
                        <dt class="text-sm font-semibold text-ink">Akreditasi</dt>
                        <dd class="mt-1 text-ink-muted"><?php echo e($situs->akreditasi); ?></dd>
                    </div>
                <?php endif; ?>
            </dl>

            <?php if($tautanWa = $situs->tautanWhatsapp('Assalamu\'alaikum, saya ingin bertanya tentang '.$situs->nama_sekolah)): ?>
                <a href="<?php echo e($tautanWa); ?>" target="_blank" rel="noopener"
                   class="inline-block rounded-md bg-highlight px-5 py-2.5 text-sm font-semibold text-on-highlight transition hover:opacity-90">
                    Chat WhatsApp
                </a>
            <?php endif; ?>
        </div>

        <div>
            <?php if($situs->peta_lat && $situs->peta_lng): ?>
                <iframe
                    title="Peta lokasi <?php echo e($situs->nama_sekolah); ?>"
                    class="aspect-[4/3] w-full rounded-lg border border-line"
                    loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=<?php echo e($situs->peta_lng - 0.01); ?>,<?php echo e($situs->peta_lat - 0.01); ?>,<?php echo e($situs->peta_lng + 0.01); ?>,<?php echo e($situs->peta_lat + 0.01); ?>&layer=mapnik&marker=<?php echo e($situs->peta_lat); ?>,<?php echo e($situs->peta_lng); ?>"></iframe>
            <?php else: ?>
                <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['judul' => 'Peta lokasi belum tersedia','pesan' => 'Titik koordinat sekolah sedang kami lengkapi.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['judul' => 'Peta lokasi belum tersedia','pesan' => 'Titik koordinat sekolah sedang kami lengkapi.']); ?>
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
        </div>
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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/kontak.blade.php ENDPATH**/ ?>