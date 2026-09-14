<?php

namespace Database\Factories;

use App\Models\TahunAjaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<TahunAjaran> */
class TahunAjaranFactory extends Factory
{
    protected $model = TahunAjaran::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->unique()->numerify('20##/20##'),
            'semester' => fake()->randomElement(['ganjil', 'genap']),
            'mulai_pada' => '2026-07-01',
            'selesai_pada' => '2027-06-30',
            'aktif' => false,
        ];
    }
}
