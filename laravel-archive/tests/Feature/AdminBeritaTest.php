<?php

namespace Tests\Feature;

use App\Enums\StatusBerita;
use App\Models\Berita;
use App\Models\User;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AdminBeritaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PeranSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    public function test_tamu_tidak_bisa_membuka_admin_berita(): void
    {
        $this->get(route('admin.berita.index'))->assertRedirect(route('login'));
    }

    /** Pengguna terautentikasi tanpa peran tetap ditolak, bukan sekadar diarahkan. */
    public function test_pengguna_tanpa_izin_ditolak(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.berita.index'))
            ->assertForbidden();
    }

    /**
     * Panel admin memakai Inertia. Tanpa asersi komponen, test hanya
     * membuktikan halaman tidak error — bukan bahwa halaman yang benar dirender
     * dengan props yang dibutuhkan React.
     */
    public function test_halaman_admin_merender_komponen_inertia_yang_benar(): void
    {
        $berita = Berita::create([
            'judul' => 'Contoh', 'slug' => 'contoh', 'isi' => '<p>a</p>', 'status' => 'draft',
        ]);

        $this->actingAs($this->admin)
            ->get(route('admin.berita.index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Berita/Index')
                ->has('daftar.data', 1)
                ->has('pilihanStatus', 2)
                ->where('daftar.data.0.judul', 'Contoh')
            );

        $this->actingAs($this->admin)
            ->get(route('admin.berita.create'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Berita/Form')
                ->where('berita', null)
                ->where('aksi', route('admin.berita.store'))
            );

        $this->actingAs($this->admin)
            ->get(route('admin.berita.edit', $berita))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Berita/Form')
                ->where('berita.judul', 'Contoh')
                ->where('aksi', route('admin.berita.update', $berita))
            );
    }

    /** Izin dikirim ke React agar menu bisa disembunyikan sesuai peran. */
    public function test_props_bersama_membawa_izin_pengguna(): void
    {
        $this->actingAs($this->admin)
            ->get(route('dashboard'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Dasbor')
                ->where('auth.user.nama', $this->admin->name)
                // Nama izin mengandung titik ("berita.kelola"), sementara
                // Inertia memakai titik sebagai pemisah jalur props. Jadi
                // diperiksa lewat closure atas keseluruhan array.
                ->where('auth.izin', fn ($izin) => $izin['berita.kelola'] === true
                    && $izin['pengguna.kelola'] === false)
            );
    }

    public function test_admin_dapat_membuat_berita(): void
    {
        $respons = $this->actingAs($this->admin)
            ->post(route('admin.berita.store'), [
                'judul' => 'Peringatan Maulid Nabi',
                'isi' => '<p>Kegiatan berjalan lancar.</p>',
                'status' => StatusBerita::Terbit->value,
            ]);

        $berita = Berita::first();

        $respons->assertRedirect(route('admin.berita.edit', $berita));
        $this->assertSame('peringatan-maulid-nabi', $berita->slug);
        $this->assertSame($this->admin->id, $berita->penulis_id);
    }

    /**
     * Berita berstatus terbit tanpa tanggal akan hilang dari situs publik
     * karena scope `terbit` menuntut tanggal. Tanggal harus diisi otomatis
     * supaya admin tidak menerbitkan sesuatu yang diam-diam tidak muncul.
     */
    public function test_terbit_tanpa_tanggal_diisi_otomatis_dan_benar_benar_tampil(): void
    {
        $this->actingAs($this->admin)->post(route('admin.berita.store'), [
            'judul' => 'Pengumuman Libur',
            'isi' => '<p>Libur semester.</p>',
            'status' => StatusBerita::Terbit->value,
        ]);

        $berita = Berita::first();

        $this->assertNotNull($berita->diterbitkan_pada);
        $this->get(route('berita.show', $berita))->assertOk()->assertSee('Pengumuman Libur');
    }

    public function test_draft_tidak_tampil_di_situs_publik(): void
    {
        $this->actingAs($this->admin)->post(route('admin.berita.store'), [
            'judul' => 'Masih Draf',
            'isi' => '<p>Belum selesai.</p>',
            'status' => StatusBerita::Draft->value,
        ]);

        $this->get(route('berita.show', Berita::first()))->assertNotFound();
    }

    public function test_slug_ganda_ditolak(): void
    {
        Berita::create(['judul' => 'Sama', 'slug' => 'sama', 'isi' => '<p>a</p>', 'status' => 'draft']);

        $this->actingAs($this->admin)
            ->post(route('admin.berita.store'), [
                'judul' => 'Judul Lain', 'slug' => 'sama',
                'isi' => '<p>b</p>', 'status' => 'draft',
            ])
            ->assertSessionHasErrors('slug');
    }

    /** Alt text wajib begitu ada gambar — syarat aksesibilitas, bukan pelengkap. */
    public function test_unggah_sampul_tanpa_alt_ditolak(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin)
            ->post(route('admin.berita.store'), [
                'judul' => 'Dengan Gambar',
                'isi' => '<p>a</p>',
                'status' => 'draft',
                'sampul' => UploadedFile::fake()->image('kegiatan.jpg', 1200, 800),
            ])
            ->assertSessionHasErrors('sampul_alt');
    }

    /**
     * Unggah sampul benar-benar dijalankan sampai konversi jadi — bukan hanya
     * validasinya. Larastan sempat menandai urutan pemanggilan `nonQueued()`
     * pada konversi medialibrary; tanpa test ini, salah urutan baru ketahuan
     * saat admin sekolah mengunggah foto pertama di produksi.
     */
    public function test_unggah_sampul_menghasilkan_varian_gambar(): void
    {
        $this->actingAs($this->admin)
            ->post(route('admin.berita.store'), [
                'judul' => 'Kegiatan Pramuka',
                'isi' => '<p>Berjalan lancar.</p>',
                'status' => StatusBerita::Terbit->value,
                'sampul' => UploadedFile::fake()->image('pramuka.jpg', 1800, 1200),
                'sampul_alt' => 'Siswa mengikuti kegiatan Pramuka di lapangan sekolah',
            ])
            ->assertSessionHasNoErrors();

        $media = Berita::first()->getFirstMedia('sampul');

        $this->assertNotNull($media);
        $this->assertSame('Siswa mengikuti kegiatan Pramuka di lapangan sekolah', $media->getCustomProperty('alt'));

        foreach (['thumbnail', 'card', 'hero'] as $varian) {
            $this->assertTrue(
                $media->hasGeneratedConversion($varian),
                "Varian [{$varian}] tidak dibuat — periksa registerMediaConversions()."
            );
        }
    }

    /** Alt text harus benar-benar sampai ke HTML publik, bukan sekadar tersimpan. */
    public function test_alt_sampul_muncul_di_halaman_publik(): void
    {
        $this->actingAs($this->admin)->post(route('admin.berita.store'), [
            'judul' => 'Foto Kegiatan',
            'isi' => '<p>a</p>',
            'status' => StatusBerita::Terbit->value,
            'sampul' => UploadedFile::fake()->image('a.jpg', 1200, 800),
            'sampul_alt' => 'Deskripsi gambar untuk pembaca layar',
        ]);

        $this->get(route('berita.show', Berita::first()))
            ->assertOk()
            ->assertSee('Deskripsi gambar untuk pembaca layar', false);
    }

    /** HTML berbahaya dari editor harus dibuang saat dirender, bukan saat disimpan. */
    public function test_html_berbahaya_disanitasi_saat_dirender(): void
    {
        $this->actingAs($this->admin)->post(route('admin.berita.store'), [
            'judul' => 'Uji Sanitasi',
            'isi' => '<p>Aman.</p><script>alert("xss")</script>',
            'status' => StatusBerita::Terbit->value,
        ]);

        $this->get(route('berita.show', Berita::first()))
            ->assertOk()
            ->assertSee('Aman.')
            ->assertDontSee('<script>', false)
            ->assertDontSee('alert("xss")', false);
    }

    public function test_admin_dapat_menghapus_berita(): void
    {
        $berita = Berita::create(['judul' => 'Hapus', 'slug' => 'hapus', 'isi' => '<p>a</p>', 'status' => 'draft']);

        $this->actingAs($this->admin)
            ->delete(route('admin.berita.destroy', $berita))
            ->assertRedirect(route('admin.berita.index'));

        $this->assertModelMissing($berita);
    }
}
