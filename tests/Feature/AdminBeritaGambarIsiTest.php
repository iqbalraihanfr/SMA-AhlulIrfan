<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\User;
use App\Services\GambarIsiBerita;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AdminBeritaGambarIsiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Berita $berita;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        $this->seed(PeranSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');

        $this->berita = Berita::create([
            'judul' => 'Kegiatan Sekolah',
            'slug' => 'kegiatan-sekolah',
            'isi' => '<p>Draf awal.</p>',
            'status' => 'draft',
            'penulis_id' => $this->admin->id,
        ]);
    }

    public function test_jadwal_admin_menggunakan_zona_waktu_sekolah(): void
    {
        $this->assertSame('Asia/Jakarta', config('app.timezone'));
    }

    public function test_admin_dapat_mengunggah_gambar_isi_dengan_alt_wajib(): void
    {
        $respons = $this->actingAs($this->admin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), [
                'gambar' => UploadedFile::fake()->image('upacara.jpg', 1800, 1200),
                'alt' => 'Siswa mengikuti upacara di halaman sekolah',
            ])
            ->assertCreated()
            ->assertJsonStructure(['media' => ['id', 'url', 'alt', 'width', 'height']])
            ->assertJsonPath('media.alt', 'Siswa mengikuti upacara di halaman sekolah');

        $media = $this->berita->fresh()->getFirstMedia('isi');

        $this->assertNotNull($media);
        $this->assertSame($media->id, $respons->json('media.id'));
        $this->assertSame('Siswa mengikuti upacara di halaman sekolah', $media->getCustomProperty('alt'));
        $this->assertSame('tertunda', $media->getCustomProperty('status_editor'));
        $this->assertTrue($media->hasGeneratedConversion('hero'));
        $this->assertSame($media->getUrl('hero'), $respons->json('media.url'));

        $ukuran = getimagesize($media->getPath('hero'));
        $this->assertSame($ukuran[0], $respons->json('media.width'));
        $this->assertSame($ukuran[1], $respons->json('media.height'));
    }

    public function test_editor_baru_menjelaskan_batas_unggah_dan_editor_ubah_menerima_endpoint(): void
    {
        $this->actingAs($this->admin)
            ->get(route('admin.berita.create'))
            ->assertInertia(fn (AssertableInertia $halaman) => $halaman
                ->component('Berita/Form')
                ->where('unggahGambarUrl', null)
            );

        $this->actingAs($this->admin)
            ->get(route('admin.berita.edit', $this->berita))
            ->assertInertia(fn (AssertableInertia $halaman) => $halaman
                ->component('Berita/Form')
                ->where('unggahGambarUrl', route('admin.berita.gambar.store', $this->berita))
            );
    }

    public function test_unggah_gambar_isi_ditolak_tanpa_alt_dan_untuk_tamu(): void
    {
        $payload = ['gambar' => UploadedFile::fake()->image('kelas.jpg')];

        $this->actingAs($this->admin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('alt');

        auth()->logout();

        $this->postJson(route('admin.berita.gambar.store', $this->berita), [
            'gambar' => UploadedFile::fake()->image('kelas.jpg'),
            'alt' => 'Suasana pembelajaran di kelas',
        ])->assertUnauthorized();
    }

    public function test_unggah_gambar_isi_menegakkan_izin_tipe_dan_batas_ukuran(): void
    {
        $tanpaIzin = User::factory()->create();

        $this->actingAs($tanpaIzin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), [
                'gambar' => UploadedFile::fake()->image('kelas.jpg'),
                'alt' => 'Suasana kelas',
            ])
            ->assertForbidden();

        $this->actingAs($this->admin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), [
                'gambar' => UploadedFile::fake()->create('dokumen.pdf', 100, 'application/pdf'),
                'alt' => 'Dokumen',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('gambar');

        $gif = base64_decode('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', true);
        $this->assertNotFalse($gif);

        $this->actingAs($this->admin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), [
                'gambar' => UploadedFile::fake()->createWithContent('animasi.gif', $gif),
                'alt' => 'Animasi tidak didukung',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('gambar');

        $this->actingAs($this->admin)
            ->postJson(route('admin.berita.gambar.store', $this->berita), [
                'gambar' => UploadedFile::fake()->image('terlalu-besar.jpg')->size(5 * 1024 + 1),
                'alt' => 'Gambar terlalu besar',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('gambar');
    }

    public function test_simpan_hanya_mempertahankan_gambar_milik_berita_dan_menghapus_yang_tidak_dipakai(): void
    {
        $dipakai = $this->berita
            ->addMedia(UploadedFile::fake()->image('dipakai.jpg', 1200, 800))
            ->withCustomProperties(['alt' => 'Kegiatan yang dipakai'])
            ->toMediaCollection('isi');

        $tidakDipakai = $this->berita
            ->addMedia(UploadedFile::fake()->image('yatim.jpg', 1200, 800))
            ->withCustomProperties(['alt' => 'Kegiatan yang dihapus'])
            ->toMediaCollection('isi');

        $tertundaDiTabLain = $this->berita
            ->addMedia(UploadedFile::fake()->image('tab-lain.jpg', 1200, 800))
            ->withCustomProperties(['alt' => 'Belum disimpan di tab lain', 'status_editor' => 'tertunda'])
            ->toMediaCollection('isi');

        $beritaLain = Berita::create([
            'judul' => 'Berita Lain',
            'slug' => 'berita-lain',
            'isi' => '<p>Isi.</p>',
            'status' => 'draft',
        ]);
        $mediaLain = $beritaLain
            ->addMedia(UploadedFile::fake()->image('asing.jpg', 1200, 800))
            ->withCustomProperties(['alt' => 'Gambar milik berita lain'])
            ->toMediaCollection('isi');

        $isi = '<p>Pembuka.</p>'
            .'<figure><img data-media-id="'.$dipakai->id.'" src="https://jahat.test/pelacak.jpg" alt="Alt palsu">'
            .'<figcaption>Upacara hari Senin</figcaption></figure>'
            .'<figure><img data-media-id="'.$mediaLain->id.'" src="https://jahat.test/asing.jpg" alt="Asing"></figure>'
            .'<img src="https://jahat.test/pelacak-lain.jpg" alt="Pelacak">';

        $this->actingAs($this->admin)
            ->put(route('admin.berita.update', $this->berita), [
                'judul' => $this->berita->judul,
                'isi' => $isi,
                'status' => 'draft',
            ])
            ->assertSessionHasNoErrors();

        $isiTersimpan = $this->berita->fresh()->isi;

        $this->assertStringContainsString('data-media-id="'.$dipakai->id.'"', $isiTersimpan);
        $this->assertStringContainsString('alt="Kegiatan yang dipakai"', $isiTersimpan);
        $this->assertStringContainsString('<figcaption>Upacara hari Senin</figcaption>', $isiTersimpan);
        $this->assertStringNotContainsString('jahat.test', $isiTersimpan);
        $this->assertStringNotContainsString('data-media-id="'.$mediaLain->id.'"', $isiTersimpan);
        $this->assertSame('dipakai', $dipakai->fresh()->getCustomProperty('status_editor'));
        $this->assertModelMissing($tidakDipakai);
        $this->assertModelExists($tertundaDiTabLain);
        $this->assertModelExists($mediaLain);
    }

    public function test_pembersih_hanya_menghapus_upload_tertunda_yang_sudah_kedaluwarsa(): void
    {
        $tertunda = $this->berita
            ->addMedia(UploadedFile::fake()->image('tertunda.jpg'))
            ->withCustomProperties(['alt' => 'Tertunda', 'status_editor' => 'tertunda'])
            ->toMediaCollection('isi');
        $tertunda->forceFill(['created_at' => now()->subDays(2)])->save();

        $dipakai = $this->berita
            ->addMedia(UploadedFile::fake()->image('dipakai-lama.jpg'))
            ->withCustomProperties(['alt' => 'Dipakai', 'status_editor' => 'dipakai'])
            ->toMediaCollection('isi');
        $dipakai->forceFill(['created_at' => now()->subDays(2)])->save();

        $koleksiModelLain = $this->berita
            ->addMedia(UploadedFile::fake()->image('model-lain.jpg'))
            ->withCustomProperties(['alt' => 'Bukan media berita', 'status_editor' => 'tertunda'])
            ->toMediaCollection('isi');
        $koleksiModelLain->forceFill([
            'model_type' => User::class,
            'model_id' => $this->admin->id,
            'created_at' => now()->subDays(2),
        ])->save();

        $jumlah = app(GambarIsiBerita::class)->bersihkanTertunda(now()->subDay());

        $this->assertSame(1, $jumlah);
        $this->assertModelMissing($tertunda);
        $this->assertModelExists($dipakai);
        $this->assertModelExists($koleksiModelLain);
    }

    public function test_pembersih_memulihkan_status_gambar_tertunda_yang_sudah_tersimpan_di_html(): void
    {
        $tertunda = $this->berita
            ->addMedia(UploadedFile::fake()->image('tersimpan.jpg'))
            ->withCustomProperties(['alt' => 'Sudah tersimpan', 'status_editor' => 'tertunda'])
            ->toMediaCollection('isi');
        $tertunda->forceFill(['created_at' => now()->subDays(2)])->save();

        $this->berita->update([
            'isi' => '<figure><img data-media-id="'.$tertunda->id.'" src="/gambar.jpg" alt="Sudah tersimpan"></figure>',
        ]);

        $jumlah = app(GambarIsiBerita::class)->bersihkanTertunda(now()->subDay());

        $this->assertSame(0, $jumlah);
        $this->assertModelExists($tertunda);
        $this->assertSame('dipakai', $tertunda->fresh()->getCustomProperty('status_editor'));
    }
}
