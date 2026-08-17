<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Berita;
use App\Models\KontenHalaman;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * Peta ini sengaja eksplisit. Jumlah rute publik sedikit dan sudah
     * diketahui, jadi crawler atau paket sitemap hanya menambah dependensi.
     * Nilai kirinya mengikuti kunci konten_halaman agar halaman yang belum
     * terbit tidak ikut dikenalkan kepada mesin pencari.
     *
     * @var array<string, string>
     */
    private const RUTE_HALAMAN = [
        'kurikulum' => 'kurikulum',
        'e_learning' => 'e-learning',
        'prestasi' => 'prestasi',
        'tata_tertib' => 'tata-tertib',
        'organisasi_siswa' => 'organisasi-siswa',
    ];

    /** @var list<string> */
    private const RUTE_STATIS = [
        'beranda',
        'profil',
        'struktur',
        'guru',
        'ekstrakurikuler',
        'berita.index',
        'galeri.index',
        'kontak',
    ];

    public function sitemap(): Response
    {
        /** @var list<array{loc: string, lastmod: string|null}> $url */
        $url = [];

        foreach (self::RUTE_STATIS as $namaRute) {
            $url[] = ['loc' => route($namaRute), 'lastmod' => null];
        }

        $halaman = KontenHalaman::query()
            ->where('terbit', true)
            ->whereIn('kunci', array_keys(self::RUTE_HALAMAN))
            ->orderBy('kunci')
            ->get();

        foreach ($halaman as $satu) {
            $url[] = [
                'loc' => route(self::RUTE_HALAMAN[$satu->kunci]),
                'lastmod' => $satu->updated_at?->toAtomString(),
            ];
        }

        foreach (Berita::terbit()->get() as $berita) {
            $url[] = [
                'loc' => route('berita.show', $berita),
                'lastmod' => $berita->updated_at?->toAtomString(),
            ];
        }

        foreach (Album::urut()->get() as $album) {
            $url[] = [
                'loc' => route('galeri.show', $album),
                'lastmod' => $album->updated_at?->toAtomString(),
            ];
        }

        return response()
            ->view('seo.sitemap', ['url' => $url])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $isi = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /profile',
            'Disallow: /login',
            'Disallow: /lupa-password',
            'Disallow: /reset-password',
            '',
            'Sitemap: '.route('sitemap'),
            '',
        ]);

        return response($isi)->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
