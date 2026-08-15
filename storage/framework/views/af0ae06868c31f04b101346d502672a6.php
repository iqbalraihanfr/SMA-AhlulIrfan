<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="robots" content="noindex, nofollow">

    <title>Masuk — <?php echo e(config('app.name')); ?></title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>
<body class="font-sans text-ink antialiased">
    <div class="flex min-h-screen flex-col items-center justify-center bg-paper-sunken px-4 py-10">

        <a href="<?php echo e(route('beranda')); ?>" class="flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-md bg-brand font-heading font-semibold text-on-brand">AI</span>
            <span class="font-heading text-lg font-semibold text-ink"><?php echo e(config('app.name')); ?></span>
        </a>

        <div class="mt-6 w-full overflow-hidden rounded-lg border border-line bg-paper px-6 py-6 shadow-card sm:max-w-md">
            <?php echo e($slot); ?>

        </div>

        <p class="mt-6 text-sm">
            <a href="<?php echo e(route('beranda')); ?>" class="text-ink-muted underline-offset-4 hover:underline">
                &larr; Kembali ke situs
            </a>
        </p>
    </div>
</body>
</html>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/layouts/guest.blade.php ENDPATH**/ ?>