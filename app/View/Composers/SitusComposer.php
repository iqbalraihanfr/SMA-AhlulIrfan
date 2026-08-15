<?php

namespace App\View\Composers;

use App\Models\KontenHalaman;
use App\Models\PengaturanSitus;
use Illuminate\View\View;

/**
 * Menyediakan `$situs` dan `$halamanTerbit` ke seluruh view tata letak dan
 * halaman, sehingga tiap controller tidak perlu mengirimkannya sendiri.
 *
 * `$halamanTerbit` inilah yang membuat navbar menyembunyikan tautan ke halaman
 * yang naskahnya belum datang dari sekolah.
 */
class SitusComposer
{
    private static ?PengaturanSitus $situs = null;

    /** @var array<int, string>|null */
    private static ?array $halamanTerbit = null;

    public function compose(View $view): void
    {
        // Dimemoisasi per request: satu halaman merender banyak view, dan
        // tanpa ini tiap komponen akan memicu query yang sama berulang kali.
        self::$situs ??= PengaturanSitus::ambil();
        self::$halamanTerbit ??= KontenHalaman::kunciTerbit();

        $view->with([
            'situs' => self::$situs,
            'halamanTerbit' => self::$halamanTerbit,
        ]);
    }

    /** Dipanggil test agar memo tidak bocor antar-kasus uji. */
    public static function lupakan(): void
    {
        self::$situs = null;
        self::$halamanTerbit = null;
    }
}
