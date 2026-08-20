<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            PeranSeeder::class,
            KontenSekolahSeeder::class,
            MediaSekolahSeeder::class,
        ]);

        // Akun admin TIDAK dibuat otomatis — tidak ada kata sandi bawaan yang
        // bisa bocor. Buat akun pertama dengan:
        //   php artisan pengguna:buat
    }
}
