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

export type Izin = 
    | 'berita.kelola'
    | 'halaman.kelola'
    | 'guru.kelola'
    | 'struktur.kelola'
    | 'ekstrakurikuler.kelola'
    | 'galeri.kelola'
    | 'pengaturan.kelola'
    | 'pengguna.kelola';

export type ItemNav = {
    label: string;
    href: string;
    icon: LucideIcon;
    izin: Izin | null;
};

export const NAV_ADMIN: readonly ItemNav[] = [
    { label: 'Dasbor', href: '/admin', icon: LayoutDashboard, izin: null },
    { label: 'Berita', href: '/admin/berita', icon: BookOpenText, izin: 'berita.kelola' },
    { label: 'Halaman', href: '/admin/halaman', icon: CheckSquare2, izin: 'halaman.kelola' },
    { label: 'Guru & Tendik', href: '/admin/guru', icon: GraduationCap, izin: 'guru.kelola' },
    { label: 'Struktur Organisasi', href: '/admin/struktur', icon: Network, izin: 'struktur.kelola' },
    { label: 'Ekstrakurikuler', href: '/admin/ekstrakurikuler', icon: Trophy, izin: 'ekstrakurikuler.kelola' },
    { label: 'Galeri', href: '/admin/galeri', icon: ImageIcon, izin: 'galeri.kelola' },
    { label: 'Pengaturan Situs', href: '/admin/pengaturan', icon: Settings, izin: 'pengaturan.kelola' },
    { label: 'Akun Pengguna', href: '/admin/pengguna', icon: UsersRound, izin: 'pengguna.kelola' },
];

export function navTampil(izin: Partial<Record<Izin, boolean>> | null | undefined): ItemNav[] {
    return NAV_ADMIN.filter((item) => item.izin === null || (izin && izin[item.izin]));
}
