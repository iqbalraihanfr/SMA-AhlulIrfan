<?php

namespace Database\Factories;

use App\Models\Presensi;
use App\Models\RiwayatPresensi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<RiwayatPresensi> */
class RiwayatPresensiFactory extends Factory
{
    protected $model = RiwayatPresensi::class;

    public function definition(): array
    {
        return [
            'presensi_id' => Presensi::factory(),
            'siswa_id' => null,
            'user_id' => User::factory(),
            'aksi' => 'buat_draf',
            'status_sebelum' => null,
            'status_sesudah' => null,
            'catatan_sebelum' => null,
            'catatan_sesudah' => null,
            'alasan' => null,
        ];
    }
}
