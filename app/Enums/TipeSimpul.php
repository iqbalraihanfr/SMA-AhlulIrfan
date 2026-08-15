<?php

namespace App\Enums;

/**
 * Jenis simpul dalam bagan struktur organisasi. Lihat ADR-7 di PRD-SMA.md.
 */
enum TipeSimpul: string
{
    /** Kotak bernama; nama diambil dari relasi ke tabel `guru`. */
    case Orang = 'orang';

    /** Kotak tanpa nama: Wali Kelas, Guru Mapel, Siswa-Siswi. */
    case Kelompok = 'kelompok';

    /** Digambar DI SAMPING induknya, bukan di bawah. Contoh: Komite Sekolah. */
    case Penasihat = 'penasihat';
}
