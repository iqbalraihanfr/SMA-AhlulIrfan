<?php if (isset($component)) { $__componentOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal822699aa0c4e49c8f260b8d3e9bb6bb3 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.situs','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.situs'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>

    

    
    <section class="border-b border-line bg-paper-sunken">
        <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p class="text-xs font-semibold uppercase tracking-widest text-brand">
                <?php echo e($situs->nama_yayasan ?? 'Yayasan Ahlul Irfan Al-Kholily'); ?>

            </p>

            <h1 class="mt-3 max-w-3xl font-heading text-4xl leading-tight font-semibold text-ink sm:text-5xl">
                <?php echo e($situs->nama_sekolah); ?>

            </h1>

            <?php if($situs->semboyan): ?>
                <p class="mt-4 max-w-2xl text-lg text-ink-muted"><?php echo e($situs->semboyan); ?></p>
            <?php endif; ?>

            <div class="mt-8 flex flex-wrap gap-3">
                <a href="<?php echo e(route('profil')); ?>"
                   class="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
                    Kenali Sekolah Kami
                </a>
                <a href="<?php echo e(route('kontak')); ?>"
                   class="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
                    Hubungi Kami
                </a>
            </div>
        </div>
    </section>

    
    <?php if($sambutan): ?>
        <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['kicker' => 'Sambutan','judul' => $sambutan->judul]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['kicker' => 'Sambutan','judul' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sambutan->judul)]); ?>
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
            <div class="mt-6 max-w-3xl">
                <?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $sambutan->isi,'class' => 'line-clamp-none']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($sambutan->isi),'class' => 'line-clamp-none']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $attributes = $__attributesOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $component = $__componentOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__componentOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?>
            </div>
        </section>
    <?php endif; ?>

    
    <?php if($kurikulum): ?>
        <section class="border-y border-line bg-paper-raised">
            <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['kicker' => 'Akademik','judul' => 'Kurikulum']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['kicker' => 'Akademik','judul' => 'Kurikulum']); ?>
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
                <div class="mt-6 max-w-3xl">
                    <?php if (isset($component)) { $__componentOriginal4b2c3060ef6b094a76d43166940a266c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b2c3060ef6b094a76d43166940a266c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.prosa','data' => ['html' => $kurikulum->isi]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.prosa'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['html' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($kurikulum->isi)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $attributes = $__attributesOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__attributesOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4b2c3060ef6b094a76d43166940a266c)): ?>
<?php $component = $__componentOriginal4b2c3060ef6b094a76d43166940a266c; ?>
<?php unset($__componentOriginal4b2c3060ef6b094a76d43166940a266c); ?>
<?php endif; ?>
                </div>
                <a href="<?php echo e(route('kurikulum')); ?>"
                   class="mt-6 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    Selengkapnya tentang kurikulum &rarr;
                </a>
            </div>
        </section>
    <?php endif; ?>

    
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['kicker' => 'Kesiswaan','judul' => 'Ekstrakurikuler','keterangan' => 'Wadah pengembangan minat, bakat, dan karakter siswa di luar kegiatan akademik.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['kicker' => 'Kesiswaan','judul' => 'Ekstrakurikuler','keterangan' => 'Wadah pengembangan minat, bakat, dan karakter siswa di luar kegiatan akademik.']); ?>
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

        <?php if($ekstrakurikuler->isEmpty()): ?>
            <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['class' => 'mt-8','judul' => 'Ekstrakurikuler segera hadir','pesan' => 'Daftar kegiatan ekstrakurikuler sedang kami siapkan.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-8','judul' => 'Ekstrakurikuler segera hadir','pesan' => 'Daftar kegiatan ekstrakurikuler sedang kami siapkan.']); ?>
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
            <ul class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                <?php $__currentLoopData = $ekstrakurikuler; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ekskul): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li class="rounded-md border border-line bg-paper px-4 py-5 text-center shadow-card">
                        <span class="font-heading text-base font-semibold text-ink"><?php echo e($ekskul->nama); ?></span>
                    </li>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </ul>
        <?php endif; ?>
    </section>

    
    <section class="border-y border-line bg-paper-raised">
        <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['kicker' => 'Akademik','judul' => 'Guru &amp; Tenaga Kependidikan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['kicker' => 'Akademik','judul' => 'Guru &amp; Tenaga Kependidikan']); ?>
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
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['class' => 'mt-8','judul' => 'Data guru sedang disiapkan']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-8','judul' => 'Data guru sedang disiapkan']); ?>
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
                    <?php $__currentLoopData = $pendidik; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $guru): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php if (isset($component)) { $__componentOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginald892b1ff5eeeaa14dc828fd8c0bd24c7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.kartu-guru','data' => ['guru' => $guru]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.kartu-guru'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['guru' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($guru)]); ?>
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

                <a href="<?php echo e(route('guru')); ?>"
                   class="mt-8 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    Lihat seluruh guru dan tenaga kependidikan &rarr;
                </a>
            <?php endif; ?>
        </div>
    </section>

    
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <?php if (isset($component)) { $__componentOriginalfdf68e90b8911e1acb34fb0a05efc30f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalfdf68e90b8911e1acb34fb0a05efc30f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.section-heading','data' => ['kicker' => 'Kabar','judul' => 'Berita Terbaru']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.section-heading'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['kicker' => 'Kabar','judul' => 'Berita Terbaru']); ?>
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

        <?php if($beritaTerbaru->isEmpty()): ?>
            <?php if (isset($component)) { $__componentOriginal3607a477fdef7402bc742abad5df9c51 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3607a477fdef7402bc742abad5df9c51 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.ui.empty-state','data' => ['class' => 'mt-8','judul' => 'Belum ada berita','pesan' => 'Kegiatan dan pengumuman sekolah akan tampil di sini.']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('ui.empty-state'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-8','judul' => 'Belum ada berita','pesan' => 'Kegiatan dan pengumuman sekolah akan tampil di sini.']); ?>
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
            <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <?php $__currentLoopData = $beritaTerbaru; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $berita): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
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
        <?php endif; ?>
    </section>

    
    <section class="bg-brand">
        <div class="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
            <h2 class="font-heading text-2xl font-semibold text-on-brand sm:text-3xl">
                Tertarik bergabung dengan kami?
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-on-brand/85">
                Hubungi sekolah untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.
            </p>

            <div class="mt-8 flex flex-wrap justify-center gap-3">
                <a href="<?php echo e(route('kontak')); ?>"
                   class="rounded-md bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
                    Halaman Kontak
                </a>

                <?php if($tautanWa = $situs->tautanWhatsapp('Assalamu\'alaikum, saya ingin bertanya tentang '.$situs->nama_sekolah)): ?>
                    <a href="<?php echo e($tautanWa); ?>" target="_blank" rel="noopener"
                       class="rounded-md bg-highlight px-5 py-2.5 text-sm font-semibold text-on-highlight transition hover:opacity-90">
                        Chat WhatsApp
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </section>

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
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/pages/beranda.blade.php ENDPATH**/ ?>