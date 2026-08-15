<?php
    // Tiap menu membawa izinnya sendiri, sehingga admin sekolah tidak melihat
    // menu yang tidak boleh ia buka. Menu lain menyusul saat CRUD-nya dibangun.
    $menu = [
        ['Dasbor', route('dashboard'), null],
        ['Berita', route('admin.berita.index'), \App\Enums\Izin::KelolaBerita->value],
    ];
?>

<nav x-data="{ buka: false }" class="border-b border-line bg-paper">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        <div class="flex items-center gap-6">
            <a href="<?php echo e(route('dashboard')); ?>" class="font-heading text-base font-semibold text-ink">
                Panel Admin
            </a>

            <ul class="hidden items-center gap-1 sm:flex">
                <?php $__currentLoopData = $menu; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as [$label, $tautan, $izin]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <?php if(! $izin || auth()->user()?->can($izin)): ?>
                        <li>
                            <a href="<?php echo e($tautan); ?>"
                               class="<?php echo \Illuminate\Support\Arr::toCssClasses([
                                   'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken',
                                   'text-brand' => str_starts_with(request()->url(), $tautan),
                                   'text-ink-muted' => ! str_starts_with(request()->url(), $tautan),
                               ]); ?>"><?php echo e($label); ?></a>
                        </li>
                    <?php endif; ?>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </ul>
        </div>

        <div class="flex items-center gap-2">
            <a href="<?php echo e(route('beranda')); ?>" target="_blank" rel="noopener"
               class="hidden rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-sunken sm:block">
                Lihat situs
            </a>

            <a href="<?php echo e(route('profile.edit')); ?>"
               class="rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-sunken">
                <?php echo e(auth()->user()?->name); ?>

            </a>

            <form method="POST" action="<?php echo e(route('logout')); ?>">
                <?php echo csrf_field(); ?>
                <button type="submit"
                        class="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-paper-sunken">
                    Keluar
                </button>
            </form>
        </div>
    </div>
</nav>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/layouts/navigation.blade.php ENDPATH**/ ?>