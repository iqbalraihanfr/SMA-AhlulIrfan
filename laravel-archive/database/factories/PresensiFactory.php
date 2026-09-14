<?php

namespace Database\Factories;

use App\Enums\StatusPresensi;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Presensi> */
class PresensiFactory extends Factory
{
    protected $model = Presensi::class;

    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'tanggal' => '2026-08-24',
            'status' => StatusPresensi::Draf,
            'dicatat_oleh' => User::factory(),
            'versi' => 1,
            'selesai_pada' => null,
        ];
    }
}
