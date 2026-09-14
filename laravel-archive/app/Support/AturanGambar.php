<?php

namespace App\Support;

use Illuminate\Validation\Rules\File;

final class AturanGambar
{
    /** Gambar statis yang dapat dibaca dan dikonversi WebP oleh GD hosting. */
    public static function statis(int $maksimalKilobita): File
    {
        return File::types(['jpg', 'jpeg', 'png', 'webp'])->max($maksimalKilobita);
    }
}
