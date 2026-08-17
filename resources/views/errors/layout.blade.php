<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">

    <title>@yield('judul') — {{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    @vite(['resources/css/app.css'])
</head>
<body class="min-h-screen bg-paper-sunken font-sans text-ink antialiased">
    <main class="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-12 sm:px-6">
        <div class="w-full overflow-hidden rounded-lg border border-line bg-paper shadow-card">
            <div class="grid md:grid-cols-5">
                <div class="flex min-h-56 items-end bg-brand p-8 sm:p-10 md:col-span-2 md:min-h-96">
                    <p class="font-heading text-8xl leading-none font-semibold text-on-brand sm:text-9xl"
                       aria-label="Kode kesalahan @yield('kode')">
                        @yield('kode')
                    </p>
                </div>

                <div class="flex flex-col justify-center p-8 sm:p-10 md:col-span-3 md:p-14">
                    <p class="text-xs font-semibold uppercase tracking-widest text-brand">{{ config('app.name') }}</p>
                    <h1 class="mt-4 font-heading text-3xl leading-tight font-semibold text-ink-deep sm:text-4xl">
                        @yield('judul')
                    </h1>
                    <p class="mt-4 max-w-md leading-relaxed text-ink-muted">
                        @yield('pesan')
                    </p>

                    <div class="mt-8 flex flex-wrap gap-3">
                        @yield('aksi')
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
