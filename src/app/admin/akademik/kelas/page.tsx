import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { AkademikSubNav } from '../AkademikSubNav';
import { formatSemester } from '@/lib/akademik';
import { deleteKelas } from './actions';

export const metadata = {
    title: 'Daftar Kelas | Admin',
};

type Props = {
    searchParams: Promise<{ tahun_ajaran_id?: string }>;
};

export default async function KelasPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { tahun_ajaran_id } = await searchParams;

    // Ambil daftar tahun ajaran untuk filter
    const { data: daftarTahunAjaran } = await supabase
        .from('tahun_ajaran')
        .select('id, nama, semester, aktif')
        .order('mulai_pada', { ascending: false });

    // Query kelas
    let query = supabase
        .from('kelas')
        .select(`
            id,
            nama,
            tingkat,
            aktif,
            tahun_ajaran_id,
            wali_kelas_id,
            tahun_ajaran (
                id,
                nama,
                semester,
                aktif
            ),
            guru (
                id,
                nama
            )
        `)
        .order('tingkat', { ascending: true })
        .order('nama', { ascending: true });

    if (tahun_ajaran_id) {
        query = query.eq('tahun_ajaran_id', parseInt(tahun_ajaran_id, 10));
    }

    const { data: daftarKelas, error } = await query;

    if (error) {
        console.error('Error fetching kelas:', error.message);
    }

    const daftar = daftarKelas ?? [];

    return (
        <div className="max-w-5xl">
            <PageHeader
                judul="Data Akademik"
                keterangan="Kelola master data akademik sekolah: tahun ajaran, kelas, siswa, dan keanggotaan rombel."
                aksi={
                    <Link
                        href="/admin/akademik/kelas/form"
                        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Kelas
                    </Link>
                }
            />

            <AkademikSubNav />

            {/* Filter Tahun Ajaran */}
            {daftarTahunAjaran && daftarTahunAjaran.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        Filter Tahun Ajaran:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <Link
                            href="/admin/akademik/kelas"
                            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                !tahun_ajaran_id
                                    ? 'bg-brand text-on-brand'
                                    : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                            }`}
                        >
                            Semua
                        </Link>
                        {daftarTahunAjaran.map((ta) => {
                            const terpilih = tahun_ajaran_id === ta.id.toString();
                            return (
                                <Link
                                    key={ta.id}
                                    href={`/admin/akademik/kelas?tahun_ajaran_id=${ta.id}`}
                                    className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
                                        terpilih
                                            ? 'bg-brand text-on-brand'
                                            : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                                    }`}
                                >
                                    <span>{ta.nama} ({formatSemester(ta.semester)})</span>
                                    {ta.aktif && <span className="text-[10px] opacity-80">(Aktif)</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {daftar.length === 0 ? (
                <EmptyState
                    judul="Belum ada kelas"
                    pesan={
                        tahun_ajaran_id
                            ? 'Tidak ada kelas yang terdaftar pada tahun ajaran ini.'
                            : 'Tambahkan rombongan belajar baru untuk mulai memetakan siswa.'
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-paper-sunken text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Nama Kelas</th>
                                    <th className="px-4 py-3 font-semibold">Tingkat</th>
                                    <th className="px-4 py-3 font-semibold">Tahun Ajaran</th>
                                    <th className="px-4 py-3 font-semibold">Wali Kelas</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {daftar.map((item: any) => (
                                    <tr key={item.id} className="transition hover:bg-paper-raised">
                                        <td className="px-4 py-3.5 font-medium text-ink">
                                            <Link
                                                href={`/admin/akademik/kelas/form?id=${item.id}`}
                                                className="underline-offset-4 hover:text-brand hover:underline"
                                            >
                                                {item.nama}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-paper-sunken px-2.5 py-1 text-xs font-semibold text-ink">
                                                Kelas {item.tingkat}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-ink">
                                            {item.tahun_ajaran ? (
                                                <span>
                                                    {item.tahun_ajaran.nama} ({formatSemester(item.tahun_ajaran.semester)})
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-ink">
                                            {item.guru?.nama ? (
                                                <span>{item.guru.nama}</span>
                                            ) : (
                                                <span className="text-xs italic text-ink-muted">Belum ditentukan</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {item.aktif ? (
                                                <span className="inline-flex items-center rounded-full bg-brand/12 px-2.5 py-0.5 text-xs font-medium text-brand">
                                                    ● Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-paper-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center gap-3">
                                                <Link
                                                    href={`/admin/akademik/roster?kelas_id=${item.id}`}
                                                    className="text-xs font-medium text-brand underline-offset-4 hover:underline"
                                                    title="Lihat daftar anggota siswa"
                                                >
                                                    Roster
                                                </Link>
                                                <Link
                                                    href={`/admin/akademik/kelas/form?id=${item.id}`}
                                                    className="text-sm font-medium text-ink underline-offset-4 hover:underline"
                                                >
                                                    Ubah
                                                </Link>
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteKelas(item.id);
                                                    }}
                                                >
                                                    <DeleteButton
                                                        id={item.id}
                                                        judul={`Kelas ${item.nama}`}
                                                        pesan={`Hapus kelas "${item.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                                                        onDelete={async () => {
                                                            'use server';
                                                            await deleteKelas(item.id);
                                                        }}
                                                    />
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
