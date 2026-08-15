<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="robots" content="noindex, nofollow">

    <title>{{ config('app.name') }} — Panel Admin</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-paper-sunken font-sans text-ink antialiased">

    @include('layouts.navigation')

    @isset($header)
        <header class="border-b border-line bg-paper">
            <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6">{{ $header }}</div>
        </header>
    @endisset

    <main>{{ $slot }}</main>
</body>
</html>
