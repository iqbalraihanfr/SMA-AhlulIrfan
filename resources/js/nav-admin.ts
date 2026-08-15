import {
    BookOpenText,
    CheckSquare2,
    GraduationCap,
    ImageIcon,
    LayoutDashboard,
    Network,
    Settings,
    Trophy,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';
import type { Izin } from './types';

export type ItemNav = {
    label: string;
    href: string;
    icon: LucideIcon;
    /** Izin yang harus dimiliki agar menu tampil. null = selalu tampil. */
    izin: Izin | null;
};

/**
 * Susunan menu mengikuti panel admin situs pesantren (admin-nav.ts di sana),
 * disesuaikan dengan tipe konten SMA.
 *
 * Menyembunyikan menu hanyalah kenyamanan tampilan. Penegakan sesungguhnya
 * ada di middleware `can:` pada tiap controller — menyembunyikan tautan
 * bukan keamanan.
 */
export const NAV_ADMIN: readonly ItemNav[] = [
    { label: 'Dasbor', href: 'dashboard', icon: LayoutDashboard, izin: null },
    { label: 'Berita', href: 'admin.berita.index', icon: BookOpenText, izin: 'berita.kelola' },
    { label: 'Halaman', href: 'admin.halaman.index', icon: CheckSquare2, izin: 'halaman.kelola' },
    { label: 'Guru & Tendik', href: 'admin.guru.index', icon: GraduationCap, izin: 'guru.kelola' },
    { label: 'Struktur Organisasi', href: 'admin.struktur.index', icon: Network, izin: 'struktur.kelola' },
    { label: 'Ekstrakurikuler', href: 'admin.ekstrakurikuler.index', icon: Trophy, izin: 'ekstrakurikuler.kelola' },
    { label: 'Galeri', href: 'admin.galeri.index', icon: ImageIcon, izin: 'galeri.kelola' },
    { label: 'Pengaturan Situs', href: 'admin.pengaturan.edit', icon: Settings, izin: 'pengaturan.kelola' },
    { label: 'Akun Pengguna', href: 'admin.pengguna.index', icon: UsersRound, izin: 'pengguna.kelola' },
];

export function navTampil(izin: Partial<Record<Izin, boolean>>): ItemNav[] {
    return NAV_ADMIN.filter((item) => item.izin === null || izin[item.izin]);
}
