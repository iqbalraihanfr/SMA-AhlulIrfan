<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="robots" content="noindex, nofollow">

    <title>Masuk — {{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans text-ink antialiased">
    <div class="flex min-h-screen flex-col items-center justify-center bg-paper-sunken px-4 py-10">

        <a href="{{ route('beranda') }}" class="flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-md bg-brand font-heading font-semibold text-on-brand">AI</span>
            <span class="font-heading text-lg font-semibold text-ink">{{ config('app.name') }}</span>
        </a>

        <div class="mt-6 w-full overflow-hidden rounded-lg border border-line bg-paper px-6 py-6 shadow-card sm:max-w-md">
            {{ $slot }}
        </div>

        <p class="mt-6 text-sm">
            <a href="{{ route('beranda') }}" class="text-ink-muted underline-offset-4 hover:underline">
                &larr; Kembali ke situs
            </a>
        </p>
    </div>
</body>
</html>
