<?php

namespace Database\Factories;

use App\Enums\StatusKehadiran;
use App\Models\KehadiranSiswa;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<KehadiranSiswa> */
class KehadiranSiswaFactory extends Factory
{
    protected $model = KehadiranSiswa::class;

    public function definition(): array
    {
        return [
            'presensi_id' => Presensi::factory(),
            'siswa_id' => Siswa::factory(),
            'status' => StatusKehadiran::BelumDiisi,
            'catatan' => null,
            'diubah_oleh' => User::factory(),
        ];
    }
}
