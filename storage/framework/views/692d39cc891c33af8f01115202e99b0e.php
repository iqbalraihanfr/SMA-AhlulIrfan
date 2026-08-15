<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <meta name="robots" content="noindex, nofollow">

    <title><?php echo e(config('app.name')); ?> — Panel Admin</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>
<body class="min-h-screen bg-paper-sunken font-sans text-ink antialiased">

    <?php echo $__env->make('layouts.navigation', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <?php if(isset($header)): ?>
        <header class="border-b border-line bg-paper">
            <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6"><?php echo e($header); ?></div>
        </header>
    <?php endif; ?>

    <main><?php echo e($slot); ?></main>
</body>
</html>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/layouts/app.blade.php ENDPATH**/ ?>