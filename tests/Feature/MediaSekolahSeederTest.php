<?php

namespace Tests\Feature;

use App\Models\Guru;
use App\Models\PengaturanSitus;
use Database\Seeders\KontenSekolahSeeder;
use Database\Seeders\MediaSekolahSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaSekolahSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_logo_dan_semua_foto_unik_dipasang_ke_orang_yang_tepat(): void
    {
        Storage::fake('public');

        $this->seed([KontenSekolahSeeder::class, MediaSekolahSeeder::class]);

        $logo = PengaturanSitus::ambil()->getFirstMedia('logo');
        $fotoAnik = Guru::where('nama', 'Anik Purwanti')->firstOrFail()->getFirstMedia('foto');
        $fotoFathur = Guru::where('nama', 'Fathur Rohman, S.P')->firstOrFail()->getFirstMedia('foto');
        $fotoSofiatul = Guru::where('nama', 'Sofiatul Lailiyah, S.Pd., Gr')->firstOrFail()->getFirstMedia('foto');

        $this->assertNotNull($logo);
        $this->assertSame('Logo SMA Ahlul Irfan Bangsalsari', $logo->getCustomProperty('alt'));
        $this->assertSame('seeder-sekolah', $logo->getCustomProperty('sumber'));
        $this->assertSame(14, Guru::whereHas('media')->count());
        $this->assertNotNull($fotoAnik);
        $this->assertNotNull($fotoFathur);
        $this->assertNotNull($fotoSofiatul);
        $this->assertSame('Foto Anik Purwanti', $fotoAnik->getCustomProperty('alt'));
        $this->assertTrue($fotoAnik->hasGeneratedConversion('thumbnail'));
        $this->assertTrue($fotoAnik->hasGeneratedConversion('card'));

        $this->get(route('beranda'))
            ->assertOk()
            ->assertSee('Foto Fathur Rohman, S.P');

        // Seeder idempoten dan tidak menggandakan media saat dijalankan ulang.
        $idFotoAnik = $fotoAnik->id;
        $this->seed(MediaSekolahSeeder::class);
        $this->assertSame(14, Guru::whereHas('media')->count());
        $this->assertSame($idFotoAnik, Guru::where('nama', 'Anik Purwanti')->firstOrFail()->getFirstMedia('foto')?->id);

        $fathur = Guru::where('nama', 'Fathur Rohman, S.P')->firstOrFail();
        $fotoAdmin = $fathur->addMedia(database_path('seeders/assets/guru/fathur-rohman.webp'))
            ->preservingOriginal()
            ->usingFileName('pilihan-admin.webp')
            ->withCustomProperties(['alt' => 'Foto pilihan admin'])
            ->toMediaCollection('foto');

        $this->seed(MediaSekolahSeeder::class);

        $fotoSetelahSeeder = $fathur->fresh()?->getFirstMedia('foto');
        $this->assertSame(14, Guru::whereHas('media')->count());
        $this->assertNotNull($fotoSetelahSeeder);
        $this->assertSame($fotoAdmin->id, $fotoSetelahSeeder->id);
        $this->assertSame('Foto pilihan admin', $fotoSetelahSeeder->getCustomProperty('alt'));
    }
}
