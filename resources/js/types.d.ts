export type Izin =
    | 'berita.kelola'
    | 'guru.kelola'
    | 'ekstrakurikuler.kelola'
    | 'galeri.kelola'
    | 'halaman.kelola'
    | 'struktur.kelola'
    | 'pengaturan.kelola'
    | 'pengguna.kelola';

export interface Pengguna {
    nama: string;
    email: string;
    peran: string | null;
}

/**
 * Props yang dibagikan HandleInertiaRequests ke setiap halaman admin.
 *
 * Sengaja TIDAK mewarisi PageProps bawaan Inertia: augmentasi di bawah
 * membuat PageProps mewarisi tipe ini, jadi pewarisan dua arah akan melingkar.
 */
export interface SharedProps {
    auth: {
        user: Pengguna | null;
        izin: Partial<Record<Izin, boolean>>;
    };
    flash: {
        sukses: string | null;
    };
    situs: {
        nama: string;
        urlPublik: string;
        logoUrl: string | null;
        logoAlt: string | null;
    };
}

declare global {
    /** Disediakan Ziggy lewat direktif @routes di resources/views/inertia.blade.php. */
    function route(name?: string, params?: unknown, absolute?: boolean): string;
}

declare module '@inertiajs/core' {
    interface PageProps extends SharedProps {}
}
