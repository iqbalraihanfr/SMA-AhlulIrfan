<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * `pengguna:buat` adalah SATU-SATUNYA jalan membuat akun pengelola —
 * registrasi publik dihapus. Kalau perintah ini rusak diam-diam, situs
 * kehilangan pintu masuknya.
 */
class BuatPenggunaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PeranSeeder::class);

        // Mode non-interaktif membaca kata sandi dari lingkungan, bukan dari
        // argumen baris perintah — argumen akan bocor ke riwayat shell.
        putenv('ADMIN_PASSWORD=kata-sandi-uji-12');
    }

    protected function tearDown(): void
    {
        putenv('ADMIN_PASSWORD');

        parent::tearDown();
    }

    public function test_membuat_super_admin(): void
    {
        $this->artisan('pengguna:buat', [
            '--nama' => 'Iqbal Raihan',
            '--email' => 'super@sekolah.test',
            '--peran' => 'super-admin',
        ])->assertSuccessful();

        $user = User::whereEmail('super@sekolah.test')->first();

        $this->assertTrue($user->hasRole('super-admin'));
        $this->assertTrue($user->isSuperAdmin());

        // Kata sandi harus di-hash, tidak pernah tersimpan apa adanya.
        $this->assertNotSame('kata-sandi-uji-12', $user->password);
        $this->assertTrue(Hash::check('kata-sandi-uji-12', $user->password));
    }

    public function test_admin_sekolah_tidak_bisa_mengelola_pengguna(): void
    {
        $this->artisan('pengguna:buat', [
            '--nama' => 'Rofiyatun',
            '--email' => 'tu@sekolah.test',
            '--peran' => 'admin',
        ])->assertSuccessful();

        $user = User::whereEmail('tu@sekolah.test')->first();

        $this->assertTrue($user->can('berita.kelola'));
        $this->assertFalse($user->can('pengguna.kelola'));
    }

    public function test_menolak_email_ganda(): void
    {
        User::factory()->create(['email' => 'dipakai@sekolah.test']);

        $this->artisan('pengguna:buat', [
            '--nama' => 'X',
            '--email' => 'dipakai@sekolah.test',
            '--peran' => 'admin',
        ])->assertFailed();
    }

    public function test_menolak_peran_yang_tidak_dikenal(): void
    {
        $this->artisan('pengguna:buat', [
            '--nama' => 'X',
            '--email' => 'x@sekolah.test',
            '--peran' => 'dewa',
        ])->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'x@sekolah.test']);
    }

    public function test_menolak_kata_sandi_pendek(): void
    {
        putenv('ADMIN_PASSWORD=pendek');

        $this->artisan('pengguna:buat', [
            '--nama' => 'X',
            '--email' => 'pendek@sekolah.test',
            '--peran' => 'admin',
        ])->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'pendek@sekolah.test']);

        putenv('ADMIN_PASSWORD=kata-sandi-uji-12');
    }

    public function test_menolak_bila_opsi_tidak_lengkap(): void
    {
        $this->artisan('pengguna:buat', ['--nama' => 'X'])->assertFailed();
    }
}
