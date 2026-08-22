<?php

namespace App\Enums;

enum StatusKehadiran: string
{
    case BelumDiisi = 'belum_diisi';
    case Hadir = 'hadir';
    case Sakit = 'sakit';
    case Izin = 'izin';
    case Alpa = 'alpa';
    case Terlambat = 'terlambat';

    public function label(): string
    {
        return match ($this) {
            self::BelumDiisi => 'Belum diisi',
            self::Hadir => 'Hadir',
            self::Sakit => 'Sakit',
            self::Izin => 'Izin',
            self::Alpa => 'Alpa',
            self::Terlambat => 'Terlambat',
        };
    }
}
