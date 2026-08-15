<?php

namespace App\Enums;

enum StatusBerita: string
{
    case Draft = 'draft';
    case Terbit = 'terbit';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draf',
            self::Terbit => 'Terbit',
        };
    }
}
