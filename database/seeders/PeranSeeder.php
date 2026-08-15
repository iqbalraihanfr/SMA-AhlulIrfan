<?php

namespace Database\Seeders;

use App\Enums\Izin;
use App\Enums\Peran;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Idempoten: aman dijalankan berulang kali tanpa menggandakan apa pun.
 */
class PeranSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (Izin::cases() as $izin) {
            Permission::findOrCreate($izin->value);
        }

        // super-admin sengaja TIDAK diberi izin eksplisit — ia melewati
        // seluruh pemeriksaan lewat Gate::before di AppServiceProvider.
        // Memberi daftar izin di sini justru menciptakan dua sumber kebenaran.
        Role::findOrCreate(Peran::SuperAdmin->value);

        Role::findOrCreate(Peran::Admin->value)
            ->syncPermissions(Izin::untukAdmin());
    }
}
