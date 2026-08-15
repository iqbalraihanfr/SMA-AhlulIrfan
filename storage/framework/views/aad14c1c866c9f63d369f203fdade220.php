<?php
    $sosial = array_filter([
        'Instagram' => $situs->instagram,
        'Facebook' => $situs->facebook,
        'YouTube' => $situs->youtube,
    ]);
?>

<footer class="mt-16 border-t border-line bg-paper-sunken">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">

        <div class="space-y-3">
            <p class="font-heading text-lg font-semibold text-ink"><?php echo e($situs->nama_sekolah); ?></p>

            <?php if($situs->nama_yayasan): ?>
                <p class="text-sm text-ink-muted">Di bawah naungan <?php echo e($situs->nama_yayasan); ?></p>
            <?php endif; ?>

            <?php if($situs->semboyan): ?>
                <p class="text-sm italic text-ink-muted">&ldquo;<?php echo e($situs->semboyan); ?>&rdquo;</p>
            <?php endif; ?>
        </div>

        <div class="space-y-2 text-sm">
            <p class="font-semibold text-ink">Kontak</p>

            <?php if($situs->alamat): ?>
                <p class="text-ink-muted"><?php echo e($situs->alamat); ?></p>
            <?php endif; ?>

            <?php if($situs->telepon): ?>
                <p><a class="text-ink-muted underline-offset-2 hover:underline"
                      href="tel:<?php echo e(preg_replace('/\D/', '', $situs->telepon)); ?>"><?php echo e($situs->telepon); ?></a></p>
            <?php endif; ?>

            <?php if($situs->email): ?>
                <p><a class="text-ink-muted underline-offset-2 hover:underline"
                      href="mailto:<?php echo e($situs->email); ?>"><?php echo e($situs->email); ?></a></p>
            <?php endif; ?>

            <?php if($tautanWa = $situs->tautanWhatsapp()): ?>
                <p><a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e($tautanWa); ?>"
                      target="_blank" rel="noopener">WhatsApp</a></p>
            <?php endif; ?>
        </div>

        <div class="space-y-2 text-sm">
            <p class="font-semibold text-ink">Tautan</p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e(route('guru')); ?>">Guru &amp; Tenaga Kependidikan</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e(route('ekstrakurikuler')); ?>">Ekstrakurikuler</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e(route('berita.index')); ?>">Berita</a></p>
            <p><a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e(route('kontak')); ?>">Kontak</a></p>

            <?php if($sosial): ?>
                <div class="flex gap-3 pt-2">
                    <?php $__currentLoopData = $sosial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $nama => $url): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <a class="text-ink-muted underline-offset-2 hover:underline" href="<?php echo e($url); ?>"
                           target="_blank" rel="noopener"><?php echo e($nama); ?></a>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div class="border-t border-line">
        <div class="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-muted sm:px-6">
            &copy; <?php echo e(now()->year); ?> <?php echo e($situs->nama_sekolah); ?>.
        </div>
    </div>
</footer>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/layout/footer.blade.php ENDPATH**/ ?>