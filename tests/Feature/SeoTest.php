<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Berita;
use App\Models\KontenHalaman;
use Database\Seeders\KontenSekolahSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(KontenSekolahSeeder::class);
    }

    public function test_halaman_publik_memiliki_gambar_berbagi_dan_schema_sekolah(): void
    {
        $isi = $this->get(route('beranda'))
            ->assertOk()
            ->assertSee('property="og:image"', false)
            ->assertSee(asset('branding/og-default.png'), false)
            ->assertSee('name="twitter:card" content="summary_large_image"', false)
            ->getContent();

        preg_match('/<script type="application\/ld\+json">(.+)<\/script>/', $isi, $cocok);

        $this->assertArrayHasKey(1, $cocok);
        $schema = json_decode($cocok[1], true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame('EducationalOrganization', $schema['@type']);
        $this->assertSame('SMA Ahlul Irfan Bangsalsari', $schema['name']);
        $this->assertSame(route('beranda'), $schema['url']);
    }

    public function test_url_kanonik_tetap_mengikuti_app_url_bukan_host_request(): void
    {
        $this->withHeader('Host', 'domain-sementara.test')
            ->get('/')
            ->assertOk()
            ->assertSee('rel="canonical" href="'.route('beranda').'"', false)
            ->assertSee('property="og:image" content="'.asset('branding/og-default.png').'"', false)
            ->assertDontSee('domain-sementara.test', false);
    }

    public function test_sampul_berita_menggantikan_gambar_berbagi_bawaan(): void
    {
        Storage::fake('public');

        $berita = Berita::create([
            'judul' => 'Kegiatan Pramuka',
            'slug' => 'kegiatan-pramuka',
            'ringkasan' => 'Kegiatan bersama di sekolah.',
            'isi' => '<p>Terbit.</p>',
            'status' => 'terbit',
            'diterbitkan_pada' => now(),
        ]);

        $sampul = $berita
            ->addMedia(UploadedFile::fake()->image('pramuka.jpg', 1800, 1200))
            ->withCustomProperties(['alt' => 'Kegiatan Pramuka'])
            ->toMediaCollection('sampul');

        $this->get(route('berita.show', $berita))
            ->assertOk()
            ->assertSee('property="og:type" content="article"', false)
            ->assertSee('property="og:image" content="'.$sampul->getUrl('hero').'"', false)
            ->assertSee('property="og:image:alt" content="Kegiatan Pramuka"', false);
    }

    public function test_sitemap_hanya_memuat_konten_yang_boleh_dilihat_publik(): void
    {
        $terbit = Berita::create([
            'judul' => 'Berita Terbit',
            'slug' => 'berita-terbit',
            'isi' => '<p>Terbit.</p>',
            'status' => 'terbit',
            'diterbitkan_pada' => now(),
        ]);

        $draft = Berita::create([
            'judul' => 'Berita Draft',
            'slug' => 'berita-draft',
            'isi' => '<p>Draft.</p>',
            'status' => 'draft',
        ]);

        $album = Album::create([
            'judul' => 'Kegiatan Sekolah',
            'slug' => 'kegiatan-sekolah',
            'urutan' => 1,
        ]);

        $respons = $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee(route('beranda'), false)
            ->assertSee(route('kurikulum'), false)
            ->assertSee(route('berita.show', $terbit), false)
            ->assertSee(route('galeri.show', $album), false)
            ->assertDontSee(route('berita.show', $draft), false)
            ->assertDontSee(route('tata-tertib'), false);

        $this->assertStringStartsWith('<?xml version="1.0" encoding="UTF-8"?>', trim($respons->getContent()));

        KontenHalaman::where('kunci', 'tata_tertib')->update([
            'isi' => '<p>Naskah sudah tersedia.</p>',
            'terbit' => true,
        ]);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertSee(route('tata-tertib'), false);
    }

    public function test_robots_mengarahkan_mesin_pencari_ke_sitemap_dan_melindungi_panel(): void
    {
        $this->get(route('robots'))
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=UTF-8')
            ->assertSee('Disallow: /admin')
            ->assertSee('Sitemap: '.route('sitemap'));
    }
}
