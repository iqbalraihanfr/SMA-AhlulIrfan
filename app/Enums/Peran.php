<?php

namespace App\Enums;

/**
 * Peran akses. Dipakai bersama spatie/laravel-permission.
 *
 * super-admin melewati seluruh pemeriksaan izin lewat Gate::before di
 * AppServiceProvider — jadi dia sengaja TIDAK diberi daftar izin eksplisit.
 */
enum Peran: string
{
    case SuperAdmin = 'super-admin';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Super Admin',
            self::Admin => 'Admin Sekolah',
        };
    }

    public function keterangan(): string
    {
        return match ($this) {
            self::SuperAdmin => 'Akses penuh, termasuk mengelola akun pengguna.',
            self::Admin => 'Mengelola seluruh konten situs, tanpa akses ke akun pengguna.',
        };
    }
}
