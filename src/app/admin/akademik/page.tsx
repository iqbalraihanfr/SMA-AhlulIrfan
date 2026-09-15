import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, Kartu } from '@/components/Ui';
import { AkademikSubNav } from './AkademikSubNav';
import { CalendarDays, School, Users, ClipboardList, ArrowRight } from 'lucide-react';
import { formatSemester } from '@/lib/akademik';

export const metadata = {
    title: 'Data Akademik | Admin',
};

export default async function AkademikHubPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch counts and active year
    const [
        { data: activeTahunAjaran },
        { count: totalTahunAjaran },
        { count: totalKelas },
        { count: totalSiswa },
        { count: totalRoster },
    ] = await Promise.all([
        supabase.from('tahun_ajaran').select('nama, semester').eq('aktif', true).maybeSingle(),
        supabase.from('tahun_ajaran').select('*', { count: 'exact', head: true }),
        supabase.from('kelas').select('*', { count: 'exact', head: true }).eq('aktif', true),
        supabase.from('siswa').select('*', { count: 'exact', head: true }).eq('aktif', true),
        supabase.from('anggota_kelas').select('*', { count: 'exact', head: true }).is('selesai_pada', null),
    ]);

    const cards = [
        {
            title: 'Tahun Ajaran',
            href: '/admin/akademik/tahun-ajaran',
            icon: CalendarDays,
            count: `${totalTahunAjaran ?? 0} Periode`,
            badge: activeTahunAjaran
                ? `Aktif: ${activeTahunAjaran.nama} (${formatSemester(activeTahunAjaran.semester)})`
                : 'Belum ada periode aktif',
            description: 'Kelola kalender akademik, semester ganjil/genap, dan penetapan periode aktif sekolah.',
        },
        {
            title: 'Kelas (Rombel)',
            href: '/admin/akademik/kelas',
            icon: School,
            count: `${totalKelas ?? 0} Kelas Aktif`,
            badge: 'Tingkat 10, 11, 12',
            description: 'Kelola rombongan belajar siswa dan penugasan guru sebagai wali kelas.',
        },
        {
            title: 'Data Siswa',
            href: '/admin/akademik/siswa',
            icon: Users,
            count: `${totalSiswa ?? 0} Siswa Aktif`,
            badge: 'Data Induk Siswa',
            description: 'Kelola data siswa menggunakan kode internal unik sekolah dan nama lengkap.',
        },
        {
            title: 'Roster Kelas',
            href: '/admin/akademik/roster',
            icon: ClipboardList,
            count: `${totalRoster ?? 0} Keanggotaan Aktif`,
            badge: 'Distribusi Rombel',
            description: 'Petakan siswa ke dalam rombel kelas untuk keperluan absensi harian.',
        },
    ];

    return (
        <div className="max-w-5xl">
            <PageHeader
                judul="Data Akademik"
                keterangan="Kelola master data akademik sekolah: tahun ajaran, kelas, siswa, dan rombongan belajar."
            />

            <AkademikSubNav />

            <div className="grid gap-6 sm:grid-cols-2">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Kartu key={card.href} className="flex flex-col justify-between transition hover:shadow-lg">
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                                        <Icon className="size-5" />
                                    </div>
                                    <span className="rounded-full bg-paper-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                                        {card.badge}
                                    </span>
                                </div>

                                <h2 className="mt-4 font-heading text-lg font-semibold text-ink">
                                    {card.title}
                                </h2>
                                <p className="mt-1 text-2xl font-bold text-ink">
                                    {card.count}
                                </p>
                                <p className="mt-2 text-sm text-ink-muted">
                                    {card.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-line">
                                <Link
                                    href={card.href}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline underline-offset-4"
                                >
                                    Buka {card.title}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </Kartu>
                    );
                })}
            </div>
        </div>
    );
}
