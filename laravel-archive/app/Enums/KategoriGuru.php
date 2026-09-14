<?php

namespace App\Enums;

enum KategoriGuru: string
{
    case Pendidik = 'pendidik';
    case TenagaKependidikan = 'tenaga_kependidikan';

    public function label(): string
    {
        return match ($this) {
            self::Pendidik => 'Pendidik',
            self::TenagaKependidikan => 'Tenaga Kependidikan',
        };
    }
}
