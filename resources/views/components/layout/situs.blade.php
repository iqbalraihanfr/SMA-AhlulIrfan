@props([
    'judul' => null,
    'deskripsi' => null,
])

@php
    $judulHalaman = $judul ? $judul.' — '.$situs->nama_sekolah : $situs->nama_sekolah;
    $deskripsiHalaman = $deskripsi ?: ($situs->semboyan ?: $situs->nama_sekolah);
@endphp

<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ $judulHalaman }}</title>
    <meta name="description" content="{{ $deskripsiHalaman }}">

    {{-- URL kanonik selalu diturunkan dari APP_URL. Nama domain tidak pernah
         ditulis keras — situs lahir di alamat sementara lalu pindah ke .sch.id. --}}
    <link rel="canonical" href="{{ url()->current() }}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $situs->nama_sekolah }}">
    <meta property="og:title" content="{{ $judulHalaman }}">
    <meta property="og:description" content="{{ $deskripsiHalaman }}">
    <meta property="og:url" content="{{ url()->current() }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link rel="stylesheet"
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700|newsreader:400,500,600&display=swap">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">

    <a href="#konten"
       class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
              focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand">
        Lompat ke konten utama
    </a>

    <x-layout.navbar />

    <main id="konten" class="flex-1">
        {{ $slot }}
    </main>

    <x-layout.footer />
</body>
</html>
