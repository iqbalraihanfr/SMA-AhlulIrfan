'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { navTampil, type ItemNav } from '@/lib/nav-admin';

function isiAktif(pathname: string, href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
}

function DaftarMenu({ menu, pathname, onPilih }: { menu: ItemNav[]; pathname: string; onPilih?: () => void }) {
    return (
        <nav className="flex-1 space-y-1 p-3" aria-label="Navigasi admin">
            {menu.map((item) => {
                const aktif = isiAktif(pathname, item.href);
                const Ikon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
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

function KakiSidebar({ urlPublik, onLogout }: { urlPublik: string; onLogout: () => void }) {
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
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-brand/60 transition hover:bg-on-brand/8 hover:text-on-brand"
            >
                <LogOut className="size-4 shrink-0" aria-hidden="true" />
                Keluar
            </button>
        </div>
    );
}

function LogoPanel({ logoUrl, logoAlt }: { logoUrl: string | null; logoAlt: string | null }) {
    const defaultLogo = 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/logo-sma.webp';
    const effectiveLogo = logoUrl || defaultLogo;

    if (effectiveLogo) {
        return (
            <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-on-brand p-1 shadow-card">
                <img src={effectiveLogo} alt={logoAlt ?? 'Logo SMA Ahlul Irfan'} width={44} height={44} className="size-full object-contain" />
            </span>
        );
    }

    return (
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-on-brand/12 font-heading text-sm font-semibold text-on-brand">
            AI
        </span>
    );
}

function IdentitasPanel({ logoUrl, logoAlt }: { logoUrl: string | null; logoAlt: string | null }) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <LogoPanel logoUrl={logoUrl} logoAlt={logoAlt} />
            <span className="font-heading text-sm leading-tight font-semibold text-on-brand">Panel Admin</span>
        </div>
    );
}

export function AdminLayoutClient({
    children,
    user,
    situs,
}: {
    children: ReactNode;
    user: { nama: string; peran: string; izin: Record<string, boolean> };
    situs: { logoUrl: string | null; logoAlt: string | null; urlPublik: string };
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [navMobile, setNavMobile] = useState(false);

    const menu = navTampil(user.izin);

    useEffect(() => {
        setNavMobile(false);
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-paper-sunken text-ink">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-brand-strong lg:flex">
                <div className="border-b border-on-brand/10 p-4">
                    <IdentitasPanel logoUrl={situs.logoUrl} logoAlt={situs.logoAlt} />
                </div>

                <DaftarMenu menu={menu} pathname={pathname} />
                <KakiSidebar urlPublik={situs.urlPublik} onLogout={handleLogout} />
            </aside>

            {navMobile && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Tutup menu"
                        onClick={() => setNavMobile(false)}
                        className="absolute inset-0 bg-ink-deep/50"
                    />
                    <aside className="relative flex h-full w-64 flex-col bg-brand-strong">
                        <div className="flex items-center justify-between gap-3 border-b border-on-brand/10 p-4">
                            <IdentitasPanel logoUrl={situs.logoUrl} logoAlt={situs.logoAlt} />
                            <button type="button" onClick={() => setNavMobile(false)} className="text-on-brand/70 hover:text-on-brand">
                                <X className="size-5" aria-hidden="true" />
                                <span className="sr-only">Tutup menu</span>
                            </button>
                        </div>

                        <DaftarMenu menu={menu} pathname={pathname} onPilih={() => setNavMobile(false)} />
                        <KakiSidebar urlPublik={situs.urlPublik} onLogout={handleLogout} />
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
                        <p className="truncate text-sm font-semibold text-ink">{user.nama}</p>
                    </div>

                    <span className="ml-auto rounded-full bg-paper-sunken px-3 py-1 text-xs font-medium text-ink-muted">
                        {user.peran === 'super-admin' ? 'Super Admin' : user.peran === 'guru' ? 'Guru' : 'Admin Sekolah'}
                    </span>
                </header>

                <main className="p-4 md:p-7">{children}</main>
            </div>
        </div>
    );
}
