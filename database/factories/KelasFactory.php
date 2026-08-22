<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\TahunAjaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Kelas> */
class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    public function definition(): array
    {
        return [
            'tahun_ajaran_id' => TahunAjaran::factory(),
            'nama' => fake()->randomElement(['X-A', 'X-B', 'XI-A', 'XI-B', 'XII-A', 'XII-B']),
            'tingkat' => fake()->randomElement([10, 11, 12]),
            'wali_kelas_id' => null,
            'aktif' => true,
        ];
    }
}
