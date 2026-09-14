<?php

namespace Database\Factories;

use App\Models\AnggotaKelas;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<AnggotaKelas> */
class AnggotaKelasFactory extends Factory
{
    protected $model = AnggotaKelas::class;

    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'siswa_id' => Siswa::factory(),
            'mulai_pada' => '2026-07-01',
            'selesai_pada' => null,
        ];
    }
}
