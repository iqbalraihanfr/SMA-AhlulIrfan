import { Link, router, usePage } from '@inertiajs/react';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { navTampil, type ItemNav } from '@/nav-admin';

/**
 * Kerangka panel admin.
 *
 * Struktur mengikuti panel yayasan (sidebar gelap tetap + nav mobile terpisah
 * + header sambutan), tetapi warnanya memakai token SMA — dua situs terasa
 * bersaudara tanpa tertukar.
 */

function isiAktif(href: string): boolean {
    if (typeof window === 'undefined') return false;

    const tujuan = route(href);
    const sekarang = window.location.href;

    // Dasbor cocok persis; menu lain cocok berawalan agar halaman turunan
    // (form tambah/ubah) tetap menyorot menu induknya.
    return href === 'dashboard' ? sekarang.replace(/\/$/, '') === tujuan.replace(/\/$/, '') : sekarang.startsWith(tujuan);
}

function DaftarMenu({ menu, onPilih }: { menu: ItemNav[]; onPilih?: () => void }) {
    return (
        <nav className="flex-1 space-y-1 p-3" aria-label="Navigasi admin">
            {menu.map((item) => {
                const aktif = isiAktif(item.href);
                const Ikon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={route(item.href)}
                        onClick={onPilih}
                        aria-current={aktif ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                            aktif
                                ? 'bg-on-brand/12 text-on-brand'
                                : 'text-on-brand/60 hover:bg-on-brand/8 hover:text-on-brand'
                        }`}
                    >
                        <Ikon className="size-4 shrink-0" aria-hidden="true" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

function KakiSidebar({ urlPublik }: { urlPublik: string }) {
    return (
        <div className="space-y-1 border-t border-on-brand/10 p-3">
            <a
                href={urlPublik}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-brand/60 transition hover:bg-on-brand/8 hover:text-on-brand"
            >
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                Lihat situs
            </a>

            <button
                type="button"
                onClick={() => router.post(route('logout'))}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-brand/60 transition hover:bg-on-brand/8 hover:text-on-brand"
            >
                <LogOut className="size-4 shrink-0" aria-hidden="true" />
                Keluar
            </button>
        </div>
    );
}

export default function Layout({ children }: { children: ReactNode }) {
    const { auth, situs, flash } = usePage().props;
    const [notifikasi, setNotifikasi] = useState<string | null>(null);
    const [navMobile, setNavMobile] = useState(false);

    const menu = navTampil(auth.izin);

    useEffect(() => {
        if (!flash?.sukses) return;

        setNotifikasi(flash.sukses);
        const timer = setTimeout(() => setNotifikasi(null), 4000);

        return () => clearTimeout(timer);
    }, [flash?.sukses]);

    // Menu mobile harus tertutup saat pindah halaman, kalau tidak ia menutupi
    // halaman tujuan setelah navigasi Inertia.
    useEffect(() => {
        const lepas = router.on('navigate', () => setNavMobile(false));

        return () => lepas();
    }, []);

    return (
        <div className="min-h-screen bg-paper-sunken text-ink">
            {/* Sidebar desktop */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand-strong lg:flex">
                <div className="flex items-center gap-3 border-b border-on-brand/10 p-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-on-brand/12 font-heading text-sm font-semibold text-on-brand">
                        AI
                    </span>
                    <span className="font-heading text-sm leading-tight font-semibold text-on-brand">Panel Admin</span>
                </div>

                <DaftarMenu menu={menu} />
                <KakiSidebar urlPublik={situs.urlPublik} />
            </aside>

            {/* Nav mobile */}
            {navMobile && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Tutup menu"
                        onClick={() => setNavMobile(false)}
                        className="absolute inset-0 bg-ink-deep/50"
                    />
                    <aside className="relative flex h-full w-64 flex-col bg-brand-strong">
                        <div className="flex items-center justify-between border-b border-on-brand/10 p-5">
                            <span className="font-heading text-sm font-semibold text-on-brand">Panel Admin</span>
                            <button type="button" onClick={() => setNavMobile(false)} className="text-on-brand/70 hover:text-on-brand">
                                <X className="size-5" aria-hidden="true" />
                                <span className="sr-only">Tutup menu</span>
                            </button>
                        </div>

                        <DaftarMenu menu={menu} onPilih={() => setNavMobile(false)} />
                        <KakiSidebar urlPublik={situs.urlPublik} />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header className="flex h-16 items-center justify-between gap-3 border-b border-line bg-paper px-4 sm:px-7">
                    <button
                        type="button"
                        onClick={() => setNavMobile(true)}
                        aria-expanded={navMobile}
                        className="rounded-md p-2 text-ink-muted hover:bg-paper-sunken lg:hidden"
                    >
                        <Menu className="size-5" aria-hidden="true" />
                        <span className="sr-only">Buka menu</span>
                    </button>

                    <div className="min-w-0">
                        <p className="text-xs text-ink-muted">Selamat datang kembali,</p>
                        <p className="truncate text-sm font-semibold text-ink">{auth.user?.nama}</p>
                    </div>

                    <span className="ml-auto rounded-full bg-paper-sunken px-3 py-1 text-xs font-medium text-ink-muted">
                        {auth.user?.peran === 'super-admin' ? 'Super Admin' : 'Admin Sekolah'}
                    </span>
                </header>

                {notifikasi && (
                    <div className="px-4 pt-4 sm:px-7">
                        <p role="status" className="rounded-md border border-line bg-paper px-4 py-3 text-sm text-success shadow-card">
                            {notifikasi}
                        </p>
                    </div>
                )}

                <main className="p-4 md:p-7">{children}</main>
            </div>
        </div>
    );
}
