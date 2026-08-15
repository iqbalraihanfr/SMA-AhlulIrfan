<?php

namespace Tests\Feature;

use App\Models\Album;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use App\Models\KontenHalaman;
use App\Models\StrukturOrganisasi;
use App\Models\User;
use Database\Seeders\KontenSekolahSeeder;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    private User $super;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([PeranSeeder::class, KontenSekolahSeeder::class]);

        $this->super = User::factory()->create();
        $this->super->assignRole('super-admin');

        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
    }

    /** Tiap halaman admin harus merender komponen React yang benar. */
    public function test_semua_halaman_admin_merender_komponen_yang_benar(): void
    {
        $halaman = [
            'dashboard' => 'Dasbor',
            'admin.berita.index' => 'Berita/Index',
            'admin.halaman.index' => 'Halaman/Index',
            'admin.guru.index' => 'Guru/Index',
            'admin.struktur.index' => 'Struktur/Index',
            'admin.ekstrakurikuler.index' => 'Ekstrakurikuler/Index',
            'admin.galeri.index' => 'Galeri/Index',
            'admin.pengaturan.edit' => 'Pengaturan/Form',
            'admin.pengguna.index' => 'Pengguna/Index',
        ];

        foreach ($halaman as $rute => $komponen) {
            $this->actingAs($this->super)
                ->get(route($rute))
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $p) => $p->component($komponen));
        }
    }

    /** Admin sekolah boleh mengelola konten, tapi tidak boleh menyentuh akun. */
    public function test_admin_sekolah_ditolak_di_halaman_pengguna(): void
    {
        $this->actingAs($this->admin)->get(route('admin.pengguna.index'))->assertForbidden();
        $this->actingAs($this->admin)->get(route('admin.guru.index'))->assertOk();
        $this->actingAs($this->admin)->get(route('admin.pengaturan.edit'))->assertOk();
    }

    public function test_pengaturan_situs_dapat_disimpan_dan_langsung_tampil_di_kontak(): void
    {
        $this->actingAs($this->super)
            ->put(route('admin.pengaturan.update'), [
                'nama_sekolah' => 'SMA Ahlul Irfan Bangsalsari',
                'alamat' => 'Jl. Contoh No. 1, Desa Langkap',
                'telepon' => '0331-123456',
                'whatsapp' => '081234567890',
                'email' => 'info@sekolah.test',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.pengaturan.edit'));

        $this->get(route('kontak'))
            ->assertOk()
            ->assertSee('Jl. Contoh No. 1')
            ->assertSee('0331-123456')
            // Nomor 08… harus diubah jadi format wa.me 62…
            ->assertSee('wa.me/6281234567890', false);
    }

    /**
     * Halaman kosong tidak boleh diterbitkan — itu tepat yang dicegah aturan
     * penyembunyian navigasi.
     */
    public function test_halaman_kosong_tidak_bisa_diterbitkan(): void
    {
        $prestasi = KontenHalaman::where('kunci', 'prestasi')->first();

        $this->actingAs($this->super)
            ->put(route('admin.halaman.update', $prestasi), [
                'judul' => 'Prestasi Siswa',
                'isi' => '',
                'terbit' => true,
            ])
            ->assertSessionHasErrors('isi');

        $this->get(route('prestasi'))->assertNotFound();
    }

    public function test_halaman_terbit_setelah_naskah_diisi(): void
    {
        $prestasi = KontenHalaman::where('kunci', 'prestasi')->first();

        $this->actingAs($this->super)
            ->put(route('admin.halaman.update', $prestasi), [
                'judul' => 'Prestasi Siswa',
                'isi' => '<p>Juara 1 lomba tahfiz tingkat kabupaten.</p>',
                'terbit' => true,
            ])
            ->assertSessionHasNoErrors();

        $this->get(route('prestasi'))->assertOk()->assertSee('Juara 1 lomba tahfiz');
    }

    public function test_guru_baru_langsung_tampil_di_situs(): void
    {
        $this->actingAs($this->super)
            ->post(route('admin.guru.store'), [
                'nama' => 'Budi Santoso, S.Pd.',
                'kategori' => 'pendidik',
                'jenis_kelamin' => 'L',
                'mata_pelajaran' => 'Kimia',
                'urutan' => 99,
                'aktif' => true,
            ])
            ->assertSessionHasNoErrors();

        $this->get(route('guru'))->assertOk()->assertSee('Budi Santoso, S.Pd.');
    }

    /** Guru nonaktif disembunyikan dari situs, bukan dihapus. */
    public function test_guru_nonaktif_disembunyikan_dari_situs(): void
    {
        $guru = Guru::where('nama', 'Nuruz Zakiya, M.Pd.')->first();

        $this->actingAs($this->super)->put(route('admin.guru.update', $guru), [
            'nama' => $guru->nama,
            'kategori' => $guru->kategori->value,
            'urutan' => $guru->urutan,
            'aktif' => false,
        ])->assertSessionHasNoErrors();

        $this->get(route('guru'))->assertOk()->assertDontSee('Nuruz Zakiya');
        $this->assertModelExists($guru);
    }

    /** Simpul akar tidak boleh dihapus — tanpa akar, halaman bagan 404. */
    public function test_simpul_akar_tidak_bisa_dihapus(): void
    {
        $akar = StrukturOrganisasi::whereNull('atasan_id')->first();

        $this->actingAs($this->super)
            ->delete(route('admin.struktur.destroy', $akar))
            ->assertStatus(422);

        $this->get(route('struktur'))->assertOk();
    }

    public function test_simpul_tidak_bisa_jadi_atasan_dirinya_sendiri(): void
    {
        $simpul = StrukturOrganisasi::where('label', 'Waka Kurikulum')->first();

        $this->actingAs($this->super)
            ->put(route('admin.struktur.update', $simpul), [
                'label' => $simpul->label,
                'tipe' => 'orang',
                'atasan_id' => $simpul->id,
                'baris' => 1,
                'urutan' => 0,
            ])
            ->assertSessionHasErrors('atasan_id');
    }

    public function test_unggah_foto_galeri_wajib_disertai_alt(): void
    {
        $album = Album::create(['judul' => 'Kegiatan', 'slug' => 'kegiatan']);

        $this->actingAs($this->super)
            ->post(route('admin.galeri.foto.store', $album), [
                'foto' => [UploadedFile::fake()->image('a.jpg', 800, 600)],
                'alt' => [''],
            ])
            ->assertSessionHasErrors('alt.0');
    }

    public function test_pembina_ekstrakurikuler_tampil_hanya_bila_terisi(): void
    {
        $ekskul = Ekstrakurikuler::where('slug', 'pramuka')->first();

        $this->get(route('ekstrakurikuler'))->assertOk()->assertDontSee('Pembina');

        $this->actingAs($this->super)->put(route('admin.ekstrakurikuler.update', $ekskul), [
            'nama' => $ekskul->nama,
            'pembina' => 'Ahmad Saini, S.Pd., Gr',
            'urutan' => $ekskul->urutan,
        ])->assertSessionHasNoErrors();

        $this->get(route('ekstrakurikuler'))->assertOk()->assertSee('Ahmad Saini');
    }

    /**
     * Super admin terakhir tidak boleh menurunkan atau menghapus dirinya —
     * hasilnya tidak ada lagi yang bisa mengelola akun, dan hanya bisa
     * dipulihkan lewat SSH.
     */
    public function test_super_admin_terakhir_tidak_bisa_diturunkan(): void
    {
        $lain = User::factory()->create();
        $lain->assignRole('super-admin');

        // Masih ada dua super admin — penurunan diizinkan.
        $this->actingAs($this->super)->put(route('admin.pengguna.update', $lain), [
            'name' => $lain->name,
            'email' => $lain->email,
            'peran' => 'admin',
        ])->assertSessionHasNoErrors();

        // Sekarang tinggal satu — harus ditolak.
        $this->actingAs($this->super)->put(route('admin.pengguna.update', $this->super), [
            'name' => $this->super->name,
            'email' => $this->super->email,
            'peran' => 'admin',
        ])->assertStatus(422);
    }

    public function test_tidak_bisa_menghapus_akun_sendiri(): void
    {
        $this->actingAs($this->super)
            ->delete(route('admin.pengguna.destroy', $this->super))
            ->assertForbidden();
    }

    /** Super admin mereset kata sandi — inilah jalur pemulihan tanpa SMTP. */
    public function test_super_admin_dapat_mereset_kata_sandi_staf(): void
    {
        $this->actingAs($this->super)->put(route('admin.pengguna.update', $this->admin), [
            'name' => $this->admin->name,
            'email' => $this->admin->email,
            'peran' => 'admin',
            'password' => 'kata-sandi-baru-12',
            'password_confirmation' => 'kata-sandi-baru-12',
        ])->assertSessionHasNoErrors();

        // Keluar dari sesi super admin dulu; rute login memakai middleware
        // `guest`, jadi tanpa ini permintaan login hanya dialihkan.
        $this->flushSession();
        $this->app['auth']->forgetGuards();

        $this->post(route('login'), [
            'email' => $this->admin->email,
            'password' => 'kata-sandi-baru-12',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($this->admin->fresh());
    }
}
