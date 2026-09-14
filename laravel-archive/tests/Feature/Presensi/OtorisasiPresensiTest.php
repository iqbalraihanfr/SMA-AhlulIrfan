<?php

namespace Tests\Feature\Presensi;

use App\Enums\KategoriGuru;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class OtorisasiPresensiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PeranSeeder::class);
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-08-22 18:30:00', 'UTC'));
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    /** Pengisian guru harus mengikuti tanggal kalender Asia/Jakarta, bukan tanggal UTC/server. */
    public function test_guru_wali_kelas_boleh_melihat_dan_menyimpan_presensi_hari_ini(): void
    {
        [$guru, $kelas] = $this->akunGuruDanKelasWali();
        $hariIniWib = CarbonImmutable::parse('2026-08-23', 'Asia/Jakarta');

        $this->assertTrue(Gate::forUser($guru)->allows('view', $kelas));
        $this->assertTrue(Gate::forUser($guru)->allows('save', [$kelas, $hariIniWib]));
    }

    /** Akun guru tidak dapat mengakses kelas yang menjadi tanggung jawab guru lain. */
    public function test_guru_lain_ditolak_untuk_kelas_yang_bukan_walinya(): void
    {
        [$guru, $kelas] = $this->akunGuruDanKelasWali();
        $guruLain = $this->akunGuru();

        $this->assertFalse(Gate::forUser($guruLain)->allows('view', $kelas));
        $this->assertFalse(Gate::forUser($guruLain)->allows('save', [$kelas, CarbonImmutable::parse('2026-08-23', 'Asia/Jakarta')]));
    }

    /** Izin isi saja tidak cukup bila akun tidak tertaut ke pendidik. */
    public function test_pengguna_tanpa_guru_id_ditolak_meski_memiliki_izin_isi_presensi(): void
    {
        $kelas = Kelas::factory()->create();
        $pengguna = User::factory()->create();
        $pengguna->assignRole('guru');

        $this->assertFalse(Gate::forUser($pengguna)->allows('view', $kelas));
        $this->assertFalse(Gate::forUser($pengguna)->allows('save', [$kelas, CarbonImmutable::parse('2026-08-23', 'Asia/Jakarta')]));
    }

    /** Guru boleh membaca riwayat kelasnya, tetapi tidak mengubah tanggal lampau. */
    public function test_guru_hanya_baca_riwayat_dan_tidak_boleh_menyimpan_atau_mengoreksi_tanggal_lampau(): void
    {
        [$guru, $kelas] = $this->akunGuruDanKelasWali();
        $kemarin = CarbonImmutable::parse('2026-08-22', 'Asia/Jakarta');

        $this->assertTrue(Gate::forUser($guru)->allows('view', $kelas));
        $this->assertFalse(Gate::forUser($guru)->allows('save', [$kelas, $kemarin]));
        $this->assertFalse(Gate::forUser($guru)->allows('correct', [$kelas, $kemarin]));
    }

    /** Admin berizin kelola dapat menangani setiap kelas serta mengoreksi tanggal lampau dan mengekspor. */
    public function test_admin_dapat_mengelola_semua_kelas_mengoreksi_lampau_dan_mengekspor(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        $kelas = Kelas::factory()->create();
        $kemarin = CarbonImmutable::parse('2026-08-22', 'Asia/Jakarta');

        $this->assertTrue(Gate::forUser($admin)->allows('view', $kelas));
        $this->assertTrue(Gate::forUser($admin)->allows('save', [$kelas, $kemarin]));
        $this->assertTrue(Gate::forUser($admin)->allows('correct', [$kelas, $kemarin]));
        $this->assertTrue(Gate::forUser($admin)->allows('export', $kelas));
    }

    /** Policy tetap menolak tanggal masa depan bagi admin dan guru. */
    public function test_tanggal_masa_depan_ditolak_untuk_admin_dan_guru(): void
    {
        [$guru, $kelas] = $this->akunGuruDanKelasWali();
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        $besok = CarbonImmutable::parse('2026-08-24', 'Asia/Jakarta');

        $this->assertFalse(Gate::forUser($guru)->allows('save', [$kelas, $besok]));
        $this->assertFalse(Gate::forUser($admin)->allows('save', [$kelas, $besok]));
        $this->assertFalse(Gate::forUser($admin)->allows('correct', [$kelas, $besok]));
    }

    /** Tanpa izin presensi, objek kelas tidak pernah dapat diakses atau diekspor. */
    public function test_pengguna_tanpa_izin_presensi_ditolak(): void
    {
        $pengguna = User::factory()->create();
        $kelas = Kelas::factory()->create();

        $this->assertFalse(Gate::forUser($pengguna)->allows('view', $kelas));
        $this->assertFalse(Gate::forUser($pengguna)->allows('save', [$kelas, CarbonImmutable::parse('2026-08-23', 'Asia/Jakarta')]));
        $this->assertFalse(Gate::forUser($pengguna)->allows('correct', [$kelas, CarbonImmutable::parse('2026-08-22', 'Asia/Jakarta')]));
        $this->assertFalse(Gate::forUser($pengguna)->allows('export', $kelas));
    }

    /** Gate::before mempertahankan akses penuh super-admin tanpa izin eksplisit. */
    public function test_super_admin_lolos_melalui_gate_before(): void
    {
        $superAdmin = User::factory()->create();
        $superAdmin->assignRole('super-admin');
        $kelas = Kelas::factory()->create();

        $this->assertTrue(Gate::forUser($superAdmin)->allows('view', $kelas));
        $this->assertTrue(Gate::forUser($superAdmin)->allows('save', [$kelas, CarbonImmutable::parse('2026-08-24', 'Asia/Jakarta')]));
        $this->assertTrue(Gate::forUser($superAdmin)->allows('correct', [$kelas, CarbonImmutable::parse('2026-08-24', 'Asia/Jakarta')]));
        $this->assertTrue(Gate::forUser($superAdmin)->allows('export', $kelas));
    }

    /** @return array{User, Kelas} */
    private function akunGuruDanKelasWali(): array
    {
        $pendidik = $this->pendidik();
        $guru = $this->akunGuru($pendidik);

        return [$guru, Kelas::factory()->create(['wali_kelas_id' => $pendidik->id])];
    }

    private function akunGuru(?Guru $pendidik = null): User
    {
        $pendidik ??= $this->pendidik();
        $guru = User::factory()->create(['guru_id' => $pendidik->id]);
        $guru->assignRole('guru');

        return $guru;
    }

    private function pendidik(): Guru
    {
        return Guru::create([
            'nama' => 'Pendidik Uji',
            'kategori' => KategoriGuru::Pendidik,
            'urutan' => 0,
            'aktif' => true,
        ]);
    }
}
