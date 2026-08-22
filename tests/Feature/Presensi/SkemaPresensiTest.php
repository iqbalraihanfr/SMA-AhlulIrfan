<?php

namespace Tests\Feature\Presensi;

use App\Enums\StatusKehadiran;
use App\Enums\StatusPresensi;
use App\Models\AnggotaKelas;
use App\Models\KehadiranSiswa;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkemaPresensiTest extends TestCase
{
    use RefreshDatabase;

    public function test_satu_kelas_hanya_punya_satu_presensi_per_tanggal(): void
    {
        $kelas = Kelas::factory()->create();
        Presensi::factory()->create(['kelas_id' => $kelas->id, 'tanggal' => '2026-08-24']);

        $this->expectException(QueryException::class);

        Presensi::factory()->create(['kelas_id' => $kelas->id, 'tanggal' => '2026-08-24']);
    }

    public function test_kode_siswa_harus_unik(): void
    {
        Siswa::factory()->create(['kode_siswa' => 'UJI-2026-001']);

        $this->expectException(QueryException::class);

        Siswa::factory()->create(['kode_siswa' => 'UJI-2026-001']);
    }

    public function test_satu_siswa_hanya_memiliki_satu_kehadiran_per_presensi(): void
    {
        $presensi = Presensi::factory()->create();
        $siswa = Siswa::factory()->create();
        KehadiranSiswa::factory()->create(['presensi_id' => $presensi->id, 'siswa_id' => $siswa->id]);

        $this->expectException(QueryException::class);

        KehadiranSiswa::factory()->create(['presensi_id' => $presensi->id, 'siswa_id' => $siswa->id]);
    }

    public function test_cast_enum_relasi_dan_scope_keanggotaan_aktif_berfungsi(): void
    {
        $kelas = Kelas::factory()->create();
        $siswaAktif = Siswa::factory()->create();
        $siswaTidakAktif = Siswa::factory()->create();
        $anggotaAktif = AnggotaKelas::factory()->create([
            'kelas_id' => $kelas->id,
            'siswa_id' => $siswaAktif->id,
            'mulai_pada' => '2026-08-01',
            'selesai_pada' => null,
        ]);
        AnggotaKelas::factory()->create([
            'kelas_id' => $kelas->id,
            'siswa_id' => $siswaTidakAktif->id,
            'mulai_pada' => '2026-08-01',
            'selesai_pada' => '2026-08-20',
        ]);
        $presensi = Presensi::factory()->create([
            'kelas_id' => $kelas->id,
            'tanggal' => '2026-08-24',
            'status' => StatusPresensi::Draf,
        ]);
        $kehadiran = KehadiranSiswa::factory()->create([
            'presensi_id' => $presensi->id,
            'siswa_id' => $siswaAktif->id,
            'status' => StatusKehadiran::Terlambat,
        ]);

        $this->assertSame(StatusPresensi::Draf, $presensi->status);
        $this->assertSame(StatusKehadiran::Terlambat, $kehadiran->status);
        $this->assertTrue($anggotaAktif->kelas->is($kelas));
        $this->assertTrue($anggotaAktif->siswa->is($siswaAktif));
        $this->assertTrue($presensi->kelas->is($kelas));
        $this->assertTrue($kehadiran->presensi->is($presensi));
        $this->assertTrue($kehadiran->siswa->is($siswaAktif));
        $this->assertSame(
            [$anggotaAktif->id],
            AnggotaKelas::aktifPada(CarbonImmutable::parse('2026-08-24'))->pluck('id')->all(),
        );
    }

    public function test_kelas_berpresensi_tidak_bisa_dihapus(): void
    {
        $kelas = Kelas::factory()->create();
        Presensi::factory()->create(['kelas_id' => $kelas->id]);

        $this->expectException(QueryException::class);

        $kelas->delete();
    }
}
