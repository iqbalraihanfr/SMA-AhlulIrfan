<?php

namespace App\Enums;

/**
 * Izin granular. Satu izin per area konten — sengaja tidak dipecah menjadi
 * lihat/buat/ubah/hapus karena hanya ada dua peran dan pemecahan itu akan
 * jadi kerumitan tanpa pemakai.
 */
enum Izin: string
{
    case KelolaBerita = 'berita.kelola';
    case KelolaGuru = 'guru.kelola';
    case KelolaEkstrakurikuler = 'ekstrakurikuler.kelola';
    case KelolaGaleri = 'galeri.kelola';
    case KelolaHalaman = 'halaman.kelola';
    case KelolaStruktur = 'struktur.kelola';
    case KelolaPengaturan = 'pengaturan.kelola';

    /** Hanya super admin. Admin sekolah tidak boleh membuat atau menghapus akun. */
    case KelolaPengguna = 'pengguna.kelola';

    public function label(): string
    {
        return match ($this) {
            self::KelolaBerita => 'Kelola Berita',
            self::KelolaGuru => 'Kelola Guru & Tenaga Kependidikan',
            self::KelolaEkstrakurikuler => 'Kelola Ekstrakurikuler',
            self::KelolaGaleri => 'Kelola Galeri',
            self::KelolaHalaman => 'Kelola Halaman (Profil, Kurikulum, dll.)',
            self::KelolaStruktur => 'Kelola Struktur Organisasi',
            self::KelolaPengaturan => 'Kelola Pengaturan Situs',
            self::KelolaPengguna => 'Kelola Akun Pengguna',
        };
    }

    /** Izin yang diberikan ke peran `admin` — semuanya kecuali kelola pengguna. */
    public static function untukAdmin(): array
    {
        return array_map(
            fn (self $i) => $i->value,
            array_filter(self::cases(), fn (self $i) => $i !== self::KelolaPengguna)
        );
    }
}
