<?php

namespace Tests\Feature;

use App\Enums\StatusBerita;
use App\Models\Berita;
use App\Models\User;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_admin_dapat_membuat_berita(): void
    {
        $this->actingAs($this->admin)
            ->post(route('admin.berita.store'), [
                'judul' => 'Peringatan Maulid Nabi',
                'isi' => '<p>Kegiatan berjalan lancar.</p>',
                'status' => StatusBerita::Terbit->value,
            ])
            ->assertRedirect(route('admin.berita.index'));

        $berita = Berita::first();

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
