<?php
    /**
     * Tautan ke halaman berbasis prosa hanya muncul bila naskahnya sudah ada
     * (konten_halaman.terbit). Halaman setengah isi lebih merusak kepercayaan
     * calon orang tua daripada halaman yang belum ada.
     */
    $adaNaskah = fn (string $kunci) => in_array($kunci, $halamanTerbit, true);

    $menu = array_filter([
        [
            'label' => 'Profil',
            'anak' => array_filter([
                $adaNaskah('sejarah') || $adaNaskah('visi_misi') ? ['Profil Sekolah', route('profil')] : null,
                ['Struktur Organisasi', route('struktur')],
            ]),
        ],
        [
            'label' => 'Akademik',
            'anak' => array_filter([
                $adaNaskah('kurikulum') ? ['Kurikulum', route('kurikulum')] : null,
                ['Guru & Tenaga Kependidikan', route('guru')],
                $adaNaskah('e_learning') ? ['E-Learning', route('e-learning')] : null,
            ]),
        ],
        [
            'label' => 'Kesiswaan',
            'anak' => array_filter([
                ['Ekstrakurikuler', route('ekstrakurikuler')],
                $adaNaskah('prestasi') ? ['Prestasi Siswa', route('prestasi')] : null,
                $adaNaskah('organisasi_siswa') ? ['Organisasi Siswa', route('organisasi-siswa')] : null,
                $adaNaskah('tata_tertib') ? ['Tata Tertib', route('tata-tertib')] : null,
            ]),
        ],
        ['label' => 'Berita', 'tautan' => route('berita.index')],
        ['label' => 'Galeri', 'tautan' => route('galeri.index')],
        ['label' => 'Kontak', 'tautan' => route('kontak')],
    ], fn ($item) => ! isset($item['anak']) || count($item['anak']) > 0);
?>

<header x-data="{ buka: false }" class="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
         aria-label="Navigasi utama">

        <a href="<?php echo e(route('beranda')); ?>" class="flex items-center gap-3 rounded-md">
            <?php if($situs->getFirstMediaUrl('logo')): ?>
                <img src="<?php echo e($situs->getFirstMediaUrl('logo')); ?>" alt="Logo <?php echo e($situs->nama_sekolah); ?>"
                     width="40" height="40" class="h-10 w-10 object-contain">
            <?php else: ?>
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand font-heading
                             text-sm font-semibold text-on-brand">AI</span>
            <?php endif; ?>
            <span class="font-heading text-base leading-tight font-semibold text-ink sm:text-lg">
                <?php echo e($situs->nama_sekolah); ?>

            </span>
        </a>

        
        <ul class="hidden items-center gap-1 lg:flex">
            <?php $__currentLoopData = $menu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php if(isset($item['tautan'])): ?>
                    <li>
                        <a href="<?php echo e($item['tautan']); ?>"
                           class="<?php echo \Illuminate\Support\Arr::toCssClasses([
                               'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken',
                               'text-brand' => request()->fullUrlIs($item['tautan'].'*'),
                               'text-ink-muted' => ! request()->fullUrlIs($item['tautan'].'*'),
                           ]); ?>"><?php echo e($item['label']); ?></a>
                    </li>
                <?php else: ?>
                    <li x-data="{ terbuka: false }" @mouseleave="terbuka = false" class="relative">
                        <button type="button" @click="terbuka = !terbuka" :aria-expanded="terbuka"
                                class="rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-paper-sunken">
                            <?php echo e($item['label']); ?>

                        </button>
                        <ul x-show="terbuka" x-transition x-cloak
                            class="absolute left-0 z-50 mt-1 min-w-56 rounded-md border border-line bg-paper p-1 shadow-card">
                            <?php $__currentLoopData = $item['anak']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as [$label, $tautan]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <li>
                                    <a href="<?php echo e($tautan); ?>"
                                       class="block rounded-sm px-3 py-2 text-sm text-ink-muted transition hover:bg-paper-sunken hover:text-ink">
                                        <?php echo e($label); ?>

                                    </a>
                                </li>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </ul>
                    </li>
                <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>

        <button type="button" @click="buka = !buka" :aria-expanded="buka" aria-controls="menu-mobile"
                class="rounded-md p-2 text-ink-muted lg:hidden">
            <span class="sr-only">Buka menu</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
                <path x-show="!buka" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
                <path x-show="buka" x-cloak stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
        </button>
    </nav>

    
    <div id="menu-mobile" x-show="buka" x-transition x-cloak class="border-t border-line lg:hidden">
        <ul class="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            <?php $__currentLoopData = $menu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php if(isset($item['tautan'])): ?>
                    <li>
                        <a href="<?php echo e($item['tautan']); ?>"
                           class="block rounded-md px-3 py-2 text-sm font-medium text-ink"><?php echo e($item['label']); ?></a>
                    </li>
                <?php else: ?>
                    <li class="pt-2">
                        <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                            <?php echo e($item['label']); ?>

                        </p>
                        <?php $__currentLoopData = $item['anak']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as [$label, $tautan]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <a href="<?php echo e($tautan); ?>"
                               class="block rounded-md px-3 py-2 text-sm text-ink-muted"><?php echo e($label); ?></a>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </li>
                <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </ul>
    </div>
</header>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/layout/navbar.blade.php ENDPATH**/ ?>