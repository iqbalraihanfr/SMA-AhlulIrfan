import {
    BookOpenText,
    CheckSquare2,
    CalendarCheck,
    ClipboardList,
    GraduationCap,
    ImageIcon,
    LayoutDashboard,
    Network,
    School,
    Settings,
    Trophy,
    UsersRound,
    type LucideIcon,
} from 'lucide-react';

export type Izin = 
    | 'dasbor.lihat'
    | 'berita.kelola'
    | 'halaman.kelola'
    | 'guru.kelola'
    | 'struktur.kelola'
    | 'ekstrakurikuler.kelola'
    | 'galeri.kelola'
    | 'pengaturan.kelola'
    | 'pengguna.kelola'
    | 'presensi.isi'
    | 'presensi.kelola'
    | 'presensi.rekap';

export type ItemNav = {
    label: string;
    href: string;
    icon: LucideIcon;
    izin: Izin | null;
};

export const NAV_ADMIN: readonly ItemNav[] = [
    { label: 'Dasbor', href: '/admin', icon: LayoutDashboard, izin: 'dasbor.lihat' },
    { label: 'Data Akademik', href: '/admin/akademik', icon: School, izin: 'presensi.kelola' },
    { label: 'Presensi Harian', href: '/admin/presensi', icon: CalendarCheck, izin: 'presensi.isi' },
    { label: 'Rekap Presensi', href: '/admin/rekap', icon: ClipboardList, izin: 'presensi.rekap' },
    { label: 'Berita', href: '/admin/berita', icon: BookOpenText, izin: 'berita.kelola' },
    { label: 'Halaman', href: '/admin/halaman', icon: CheckSquare2, izin: 'halaman.kelola' },
    { label: 'Guru & Tendik', href: '/admin/guru', icon: GraduationCap, izin: 'guru.kelola' },
    { label: 'Struktur Organisasi', href: '/admin/struktur', icon: Network, izin: 'struktur.kelola' },
    { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler', icon: Trophy, izin: 'ekstrakurikuler.kelola' },
    { label: 'Galeri', href: '/admin/galeri', icon: ImageIcon, izin: 'galeri.kelola' },
    { label: 'Pengaturan Situs', href: '/admin/pengaturan', icon: Settings, izin: 'pengaturan.kelola' },
    { label: 'Akun Pengguna', href: '/admin/pengguna', icon: UsersRound, izin: 'pengguna.kelola' },
];

/**
 * Menghasilkan objek boolean flags izin berdasarkan peran pengguna ('super-admin', 'admin', 'guru').
 * - super-admin: melihat semua menu
 * - admin: melihat semua menu kecuali akun pengguna
 * - guru: hanya melihat presensi dan rekap
 */
export function hitungIzin(peran: string | null | undefined): Record<Izin, boolean> {
    const isSuperAdmin = peran === 'super-admin';
    const isAdmin = peran === 'admin';
    const isGuru = peran === 'guru';

    return {
        'dasbor.lihat': isSuperAdmin || isAdmin,
        'presensi.kelola': isSuperAdmin || isAdmin,
        'presensi.isi': isSuperAdmin || isAdmin || isGuru,
        'presensi.rekap': isSuperAdmin || isAdmin || isGuru,
        'berita.kelola': isSuperAdmin || isAdmin,
        'halaman.kelola': isSuperAdmin || isAdmin,
        'guru.kelola': isSuperAdmin || isAdmin,
        'struktur.kelola': isSuperAdmin || isAdmin,
        'ekstrakurikuler.kelola': isSuperAdmin || isAdmin,
        'galeri.kelola': isSuperAdmin || isAdmin,
        'pengaturan.kelola': isSuperAdmin || isAdmin,
        'pengguna.kelola': isSuperAdmin,
    };
}

export function navTampil(izin: Partial<Record<Izin, boolean>> | null | undefined): ItemNav[] {
    return NAV_ADMIN.filter((item) => item.izin === null || (izin && Boolean(izin[item.izin])));
}
