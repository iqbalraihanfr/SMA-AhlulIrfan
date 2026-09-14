{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach ($url as $satu)
    <url>
        <loc>{{ $satu['loc'] }}</loc>
@if ($satu['lastmod'])
        <lastmod>{{ $satu['lastmod'] }}</lastmod>
@endif
    </url>
@endforeach
</urlset>
