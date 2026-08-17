@props([
    'judul' => null,
    'deskripsi' => null,
    'gambar' => null,
    'gambarAlt' => null,
    'tipe' => 'website',
])

@php
    $judulHalaman = $judul ? $judul.' — '.$situs->nama_sekolah : $situs->nama_sekolah;
    $deskripsiSekolah = $situs->semboyan ?: $situs->nama_sekolah;
    $deskripsiHalaman = $deskripsi ?: $deskripsiSekolah;
    $gambarBawaan = $situs->getFirstMediaUrl('hero') ?: asset('branding/og-default.png');
    $gambarSosial = $gambar ?: $gambarBawaan;
    $altGambarSosial = $gambarAlt ?: 'Ilustrasi pendidikan '.$situs->nama_sekolah;

    $schemaSekolah = [
        '@context' => 'https://schema.org',
        '@type' => 'EducationalOrganization',
        'name' => $situs->nama_sekolah,
        'url' => route('beranda'),
        'description' => $deskripsiSekolah,
        'image' => $gambarBawaan,
    ];

    if ($logo = $situs->getFirstMediaUrl('logo')) {
        $schemaSekolah['logo'] = $logo;
    }

    if ($situs->nama_yayasan) {
        $schemaSekolah['parentOrganization'] = [
            '@type' => 'Organization',
            'name' => $situs->nama_yayasan,
        ];
    }

    if ($situs->alamat) {
        $schemaSekolah['address'] = $situs->alamat;
    }

    if ($situs->telepon) {
        $schemaSekolah['telephone'] = $situs->telepon;
    }

    if ($situs->email) {
        $schemaSekolah['email'] = $situs->email;
    }

    if ($situs->peta_lat !== null && $situs->peta_lng !== null) {
        $schemaSekolah['geo'] = [
            '@type' => 'GeoCoordinates',
            'latitude' => $situs->peta_lat,
            'longitude' => $situs->peta_lng,
        ];
    }

    $tautanSosial = array_values(array_filter([
        $situs->instagram,
        $situs->facebook,
        $situs->youtube,
    ]));

    if ($tautanSosial !== []) {
        $schemaSekolah['sameAs'] = $tautanSosial;
    }

    $schemaJson = \Illuminate\Support\Js::encode($schemaSekolah, JSON_UNESCAPED_SLASHES);
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

    <meta property="og:locale" content="id_ID">
    <meta property="og:type" content="{{ $tipe }}">
    <meta property="og:site_name" content="{{ $situs->nama_sekolah }}">
    <meta property="og:title" content="{{ $judulHalaman }}">
    <meta property="og:description" content="{{ $deskripsiHalaman }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ $gambarSosial }}">
    <meta property="og:image:alt" content="{{ $altGambarSosial }}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $judulHalaman }}">
    <meta name="twitter:description" content="{{ $deskripsiHalaman }}">
    <meta name="twitter:image" content="{{ $gambarSosial }}">

    <script type="application/ld+json">{!! $schemaJson !!}</script>

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
