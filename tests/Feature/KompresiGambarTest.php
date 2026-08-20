<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Berita;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class KompresiGambarTest extends TestCase
{
    use RefreshDatabase;

    public function test_semua_varian_gambar_publik_dihasilkan_sebagai_webp_dengan_dimensi_yang_tepat(): void
    {
        Storage::fake('public');

        $album = Album::create(['judul' => 'Kegiatan', 'slug' => 'kegiatan', 'urutan' => 0]);
        $guru = Guru::create(['nama' => 'Guru Contoh', 'kategori' => 'pendidik']);
        $ekskul = Ekstrakurikuler::create(['nama' => 'Pramuka', 'slug' => 'pramuka', 'urutan' => 0]);
        $berita = Berita::create([
            'judul' => 'Kegiatan Sekolah',
            'slug' => 'kegiatan-sekolah',
            'isi' => '<p>Isi berita.</p>',
            'status' => 'draft',
        ]);

        $mediaAlbum = $album->addMedia(UploadedFile::fake()->image('album.jpg', 1800, 1400))->toMediaCollection('foto');
        $mediaGuru = $guru->addMedia(UploadedFile::fake()->image('guru.jpg', 1200, 1600))->toMediaCollection('foto');
        $mediaEkskul = $ekskul->addMedia(UploadedFile::fake()->image('ekskul.jpg', 1800, 1200))->toMediaCollection('gambar');
        $mediaBerita = $berita->addMedia(UploadedFile::fake()->image('berita.jpg', 2000, 1400))->toMediaCollection('sampul');

        $spesifikasi = [
            [$mediaAlbum, 'thumbnail', 320, 320],
            [$mediaAlbum, 'card', 800, 600],
            [$mediaAlbum, 'hero', 1600, 1200],
            [$mediaGuru, 'thumbnail', 320, 320],
            [$mediaGuru, 'card', 800, 800],
            [$mediaEkskul, 'card', 800, 500],
            [$mediaBerita, 'thumbnail', 320, 200],
            [$mediaBerita, 'card', 800, 500],
            [$mediaBerita, 'hero', 1600, 1000],
        ];

        foreach ($spesifikasi as [$media, $konversi, $lebar, $tinggi]) {
            $path = $media->getPath($konversi);
            $ukuran = getimagesize($path);

            $this->assertNotFalse($ukuran);
            $this->assertSame('image/webp', $ukuran['mime']);
            $this->assertLessThanOrEqual($lebar, $ukuran[0]);
            $this->assertLessThanOrEqual($tinggi, $ukuran[1]);
        }

        $isiWebp = file_get_contents(database_path('seeders/assets/logo-sma.webp'));
        $this->assertNotFalse($isiWebp);
        $sumberWebp = UploadedFile::fake()->createWithContent('sumber.webp', $isiWebp);
        $mediaWebp = $berita->addMedia($sumberWebp)->toMediaCollection('sampul');

        foreach (['thumbnail', 'card', 'hero'] as $konversi) {
            $ukuran = getimagesize($mediaWebp->getPath($konversi));

            $this->assertNotFalse($ukuran);
            $this->assertSame('image/webp', $ukuran['mime']);
        }
    }
}
