<?php

namespace Tests\Feature;

use App\Models\Album;
use Database\Seeders\GaleriYayasanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Tests\TestCase;

class GaleriYayasanSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_album_yayasan_responsif_idempoten_dan_tidak_meminta_gambar_asli(): void
    {
        Storage::fake('public');

        $this->seed(GaleriYayasanSeeder::class);

        $lingkungan = Album::where('slug', 'lingkungan-dan-fasilitas-yayasan')->firstOrFail();
        $pembinaan = Album::where('slug', 'pembinaan-keagamaan-di-lingkungan-yayasan')->firstOrFail();

        $this->assertSame(2, Album::count());
        $this->assertCount(3, $lingkungan->getMedia('foto'));
        $this->assertCount(7, $pembinaan->getMedia('foto'));
        $this->assertSame('gedung-yayasan.webp', $lingkungan->getFirstMedia('foto')?->file_name);
        $this->assertSame('santri-putra-mengaji.webp', $pembinaan->getFirstMedia('foto')?->file_name);

        Media::query()->each(function (Media $media): void {
            $this->assertSame(GaleriYayasanSeeder::SUMBER_ASET, $media->getCustomProperty('sumber'));
            $this->assertSame(GaleriYayasanSeeder::VERSI_ASET, $media->getCustomProperty('versi_aset'));
            $this->assertNotSame('', trim((string) $media->getCustomProperty('alt')));

            foreach (['thumbnail', 'card', 'hero'] as $konversi) {
                $this->assertTrue($media->hasGeneratedConversion($konversi));
                $ukuran = getimagesize($media->getPath($konversi));
                $this->assertNotFalse($ukuran);
                $this->assertSame('image/webp', $ukuran['mime']);
            }
        });

        $sampul = $lingkungan->getFirstMedia('foto');

        $this->get(route('galeri.index'))
            ->assertOk()
            ->assertSee($lingkungan->judul)
            ->assertSee($pembinaan->judul)
            ->assertSee($sampul->getUrl('card'), false)
            ->assertDontSee($sampul->getUrl(), false);

        $this->get(route('galeri.show', $lingkungan))
            ->assertOk()
            ->assertSee($sampul->getUrl('thumbnail'), false)
            ->assertSee($sampul->getUrl('hero'), false)
            ->assertDontSee($sampul->getUrl(), false);

        $sampul->setCustomProperty('alt', 'Alt sampul pilihan admin')->save();
        $mediaAdmin = $lingkungan->addMedia(database_path('seeders/assets/galeri/gedung-yayasan.webp'))
            ->preservingOriginal()
            ->usingFileName('foto-tambahan-admin.webp')
            ->withCustomProperties(['alt' => 'Foto tambahan pilihan admin'])
            ->toMediaCollection('foto');

        $this->seed(GaleriYayasanSeeder::class);

        $lingkungan->refresh();
        $sampulSetelahSeeder = $lingkungan->getMedia('foto')->firstWhere('file_name', 'gedung-yayasan.webp');

        $this->assertCount(4, $lingkungan->getMedia('foto'));
        $this->assertSame($sampul->id, $sampulSetelahSeeder->id);
        $this->assertSame('Alt sampul pilihan admin', $sampulSetelahSeeder->getCustomProperty('alt'));
        $this->assertNotNull($lingkungan->getMedia('foto')->firstWhere('id', $mediaAdmin->id));
    }
}
