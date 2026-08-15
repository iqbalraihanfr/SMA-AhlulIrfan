{{--
  Root view khusus panel admin (Inertia + React).
  Situs publik TIDAK memakai berkas ini — lihat components/layout/situs.blade.php.
--}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="robots" content="noindex, nofollow">

    <title inertia>{{ config('app.name') }} — Panel Admin</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/admin.tsx'])
    @inertiaHead
</head>
<body class="min-h-screen bg-paper-sunken font-sans text-ink antialiased">
    @inertia
</body>
</html>
