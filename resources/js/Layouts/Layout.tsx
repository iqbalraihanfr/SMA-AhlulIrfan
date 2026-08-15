import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

type ItemMenu = {
    label: string;
    href: string;
    izin?: string;
};

export default function Layout({ children }: { children: ReactNode }) {
    const { auth, situs, flash } = usePage().props;
    const [notifikasi, setNotifikasi] = useState<string | null>(null);

    // Flash dari server tampil sekali lalu hilang sendiri. Disimpan ke state
    // agar tidak muncul lagi saat Inertia mengunjungi ulang halaman yang sama.
    useEffect(() => {
        if (!flash?.sukses) return;

        setNotifikasi(flash.sukses);
        const timer = setTimeout(() => setNotifikasi(null), 4000);

        return () => clearTimeout(timer);
    }, [flash?.sukses]);

    const menu: ItemMenu[] = [
        { label: 'Dasbor', href: route('dashboard') },
        { label: 'Berita', href: route('admin.berita.index'), izin: 'berita.kelola' },
    ];

    const menuTampil = menu.filter(
        (item) => !item.izin || auth.izin[item.izin as keyof typeof auth.izin],
    );

    const aktif = (href: string) =>
        typeof window !== 'undefined' && window.location.href.startsWith(href);

    return (
        <div className="min-h-screen bg-paper-sunken">
            <nav className="border-b border-line bg-paper">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link href={route('dashboard')} className="font-heading text-base font-semibold text-ink">
                            Panel Admin
                        </Link>

                        <ul className="flex items-center gap-1">
                            {menuTampil.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken ${
                                            aktif(item.href) ? 'text-brand' : 'text-ink-muted'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={situs.urlPublik}
                            target="_blank"
                            rel="noopener"
                            className="hidden rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-sunken sm:block"
                        >
                            Lihat situs
                        </a>

                        <span className="hidden text-sm text-ink-muted sm:block">{auth.user?.nama}</span>

                        <button
                            type="button"
                            onClick={() => router.post(route('logout'))}
                            className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-paper-sunken"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </nav>

            {notifikasi && (
                <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
                    <p role="status" className="rounded-md border border-line bg-paper px-4 py-3 text-sm text-success shadow-card">
                        {notifikasi}
                    </p>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
