'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, School, Users, ClipboardList } from 'lucide-react';

const TABS = [
    { label: 'Tahun Ajaran', href: '/admin/akademik/tahun-ajaran', icon: CalendarDays },
    { label: 'Kelas', href: '/admin/akademik/kelas', icon: School },
    { label: 'Siswa', href: '/admin/akademik/siswa', icon: Users },
    { label: 'Roster Siswa', href: '/admin/akademik/roster', icon: ClipboardList },
];

export function AkademikSubNav() {
    const pathname = usePathname();

    return (
        <div className="mb-6 border-b border-line">
            <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1" aria-label="Navigasi Akademik">
                {TABS.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition ${
                                isActive
                                    ? 'border-brand text-brand font-semibold'
                                    : 'border-transparent text-ink-muted hover:border-line hover:text-ink'
                            }`}
                        >
                            <Icon className="size-4 shrink-0" aria-hidden="true" />
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
