<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'judul' => null,
    'deskripsi' => null,
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
    'judul' => null,
    'deskripsi' => null,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php
    $judulHalaman = $judul ? $judul.' — '.$situs->nama_sekolah : $situs->nama_sekolah;
    $deskripsiHalaman = $deskripsi ?: ($situs->semboyan ?: $situs->nama_sekolah);
?>

<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title><?php echo e($judulHalaman); ?></title>
    <meta name="description" content="<?php echo e($deskripsiHalaman); ?>">

    
    <link rel="canonical" href="<?php echo e(url()->current()); ?>">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="<?php echo e($situs->nama_sekolah); ?>">
    <meta property="og:title" content="<?php echo e($judulHalaman); ?>">
    <meta property="og:description" content="<?php echo e($deskripsiHalaman); ?>">
    <meta property="og:url" content="<?php echo e(url()->current()); ?>">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
</head>
<body class="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">

    <a href="#konten"
       class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
              focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand">
        Lompat ke konten utama
    </a>

    <?php if (isset($component)) { $__componentOriginal7a1851460580b016997ecb03412ebcac = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal7a1851460580b016997ecb03412ebcac = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.navbar','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.navbar'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal7a1851460580b016997ecb03412ebcac)): ?>
<?php $attributes = $__attributesOriginal7a1851460580b016997ecb03412ebcac; ?>
<?php unset($__attributesOriginal7a1851460580b016997ecb03412ebcac); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal7a1851460580b016997ecb03412ebcac)): ?>
<?php $component = $__componentOriginal7a1851460580b016997ecb03412ebcac; ?>
<?php unset($__componentOriginal7a1851460580b016997ecb03412ebcac); ?>
<?php endif; ?>

    <main id="konten" class="flex-1">
        <?php echo e($slot); ?>

    </main>

    <?php if (isset($component)) { $__componentOriginal4766510e0268a7a5917e77b146281554 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4766510e0268a7a5917e77b146281554 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.layout.footer','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('layout.footer'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4766510e0268a7a5917e77b146281554)): ?>
<?php $attributes = $__attributesOriginal4766510e0268a7a5917e77b146281554; ?>
<?php unset($__attributesOriginal4766510e0268a7a5917e77b146281554); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4766510e0268a7a5917e77b146281554)): ?>
<?php $component = $__componentOriginal4766510e0268a7a5917e77b146281554; ?>
<?php unset($__componentOriginal4766510e0268a7a5917e77b146281554); ?>
<?php endif; ?>
</body>
</html>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/layout/situs.blade.php ENDPATH**/ ?>