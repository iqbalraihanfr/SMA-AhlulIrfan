<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\KontenHalaman;
use App\Models\User;
use Database\Seeders\KontenSekolahSeeder;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitusPublikTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([PeranSeeder::class, KontenSekolahSeeder::class]);
    }

    /** Halaman yang naskahnya sudah ada harus tampil. */
    public function test_halaman_dengan_naskah_dapat_dibuka(): void
    {
        foreach (['beranda', 'profil', 'struktur', 'kurikulum', 'guru', 'ekstrakurikuler', 'berita.index', 'galeri.index', 'kontak'] as $rute) {
            $this->get(route($rute))->assertOk();
        }
    }

    /** Beranda mempertahankan jalur galeri meski album belum berisi foto. */
    public function test_beranda_memiliki_teaser_galeri(): void
    {
        $this->get(route('beranda'))
            ->assertOk()
            ->assertSee('Momen di sekolah')
            ->assertSee(route('galeri.index'), false);
    }

    /** Sambutan aman harus lengkap sampai identitas jabatan penandatangan. */
    public function test_sambutan_kepala_sekolah_tampil_lengkap(): void
    {
        $this->get(route('profil'))
            ->assertOk()
            ->assertSee('Sambutan Kepala Sekolah')
            ->assertSee('Bangsalsari, Juli 2026')
            ->assertSee('Kepala SMA Ahlul Irfan Bangsalsari')
            ->assertSee('FATHUR ROHMAN, S.P');
    }

    /** URL beranda adalah prefix semua URL, tetapi hanya aktif di route beranda. */
    public function test_navbar_hanya_menandai_beranda_pada_route_beranda(): void
    {
        $polaBerandaAktif = '/<a\s+href="'.preg_quote(route('beranda'), '/').'"[^>]+aria-current="page"/s';

        $htmlBeranda = $this->get(route('beranda'))->assertOk()->getContent();
        $htmlKontak = $this->get(route('kontak'))->assertOk()->getContent();

        $this->assertMatchesRegularExpression($polaBerandaAktif, $htmlBeranda);
        $this->assertDoesNotMatchRegularExpression($polaBerandaAktif, $htmlKontak);
    }

    /**
     * Halaman yang naskahnya belum datang dari sekolah memberi 404,
     * bukan halaman kosong yang terlihat seolah situsnya rusak.
     */
    public function test_halaman_tanpa_naskah_memberi_404(): void
    {
        foreach (['prestasi', 'tata-tertib', 'organisasi-siswa', 'e-learning'] as $rute) {
            $this->get(route($rute))->assertNotFound();
        }
    }

    /** Halaman tanpa naskah juga tidak boleh muncul sebagai tautan di navbar. */
    public function test_navbar_menyembunyikan_halaman_tanpa_naskah(): void
    {
        $this->get(route('beranda'))
            ->assertOk()
            ->assertDontSee(route('prestasi'))
            ->assertDontSee(route('tata-tertib'))
            ->assertDontSee(route('organisasi-siswa'));
    }

    /** Begitu naskahnya ada, halaman langsung terbit tanpa ubah kode. */
    public function test_halaman_terbit_setelah_naskah_diisi(): void
    {
        KontenHalaman::where('kunci', 'tata_tertib')
            ->update(['isi' => '<p>Contoh tata tertib.</p>', 'terbit' => true]);

        $this->get(route('tata-tertib'))->assertOk()->assertSee('Contoh tata tertib');
    }

    /** Draft tidak boleh bocor lewat URL langsung, bukan hanya tersembunyi dari daftar. */
    public function test_berita_draft_tidak_bocor(): void
    {
        $draft = Berita::create([
            'judul' => 'Rahasia', 'slug' => 'rahasia',
            'isi' => '<p>Belum siap.</p>', 'status' => 'draft',
        ]);

        $this->get(route('berita.show', $draft))->assertNotFound();
        $this->get(route('berita.index'))->assertOk()->assertDontSee('Rahasia');
    }

    /** Berita berjadwal masa depan juga belum boleh tampil. */
    public function test_berita_terjadwal_masa_depan_belum_tampil(): void
    {
        $nanti = Berita::create([
            'judul' => 'Besok', 'slug' => 'besok', 'isi' => '<p>Nanti.</p>',
            'status' => 'terbit', 'diterbitkan_pada' => now()->addWeek(),
        ]);

        $this->get(route('berita.show', $nanti))->assertNotFound();
    }

    /** Registrasi publik dimatikan — situs sekolah tidak menerima pendaftaran. */
    public function test_registrasi_publik_tidak_ada(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', [])->assertNotFound();
    }

    /** Guru dipisah dua kelompok sesuai naskah: 13 pendidik, 3 tenaga kependidikan. */
    public function test_halaman_guru_memisahkan_dua_kelompok(): void
    {
        $this->get(route('guru'))
            ->assertOk()
            ->assertSee('Pendidik')
            ->assertSee('Tenaga Kependidikan')
            ->assertSee('Fathur Rohman, S.P')
            ->assertSee('Rofiyatun');
    }

    /**
     * ATURAN PRIVASI: NUPTK tidak boleh muncul di HTML mana pun.
     * Naskah sumber memuat NUPTK 13 orang, jadi ini bukan uji teoretis.
     */
    public function test_tidak_ada_nuptk_di_halaman_publik(): void
    {
        foreach (['beranda', 'guru', 'struktur'] as $rute) {
            $isi = $this->get(route($rute))->assertOk()->getContent();

            $this->assertDoesNotMatchRegularExpression('/\b\d{16}\b/', $isi,
                "Angka 16 digit (kemungkinan NUPTK) muncul di rute [{$rute}].");
            $this->assertStringNotContainsStringIgnoringCase('nuptk', $isi);
        }
    }

    public function test_super_admin_melewati_seluruh_pemeriksaan_izin(): void
    {
        $super = User::factory()->create();
        $super->assignRole('super-admin');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->assertTrue($super->can('pengguna.kelola'));
        $this->assertTrue($super->can('berita.kelola'));

        // Admin sekolah mengelola konten, tapi tidak boleh menyentuh akun.
        $this->assertTrue($admin->can('berita.kelola'));
        $this->assertFalse($admin->can('pengguna.kelola'));
    }
}
