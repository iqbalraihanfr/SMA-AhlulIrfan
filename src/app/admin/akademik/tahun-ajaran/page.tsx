import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { AkademikSubNav } from '../AkademikSubNav';
import { formatTanggal, formatSemester } from '@/lib/akademik';
import { deleteTahunAjaran } from './actions';
import type { TahunAjaran } from '@/types/absensi';

export const metadata = {
    title: 'Tahun Ajaran | Admin',
};

export default async function TahunAjaranPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: daftarTahunAjaran, error } = await supabase
        .from('tahun_ajaran')
        .select('*')
        .order('mulai_pada', { ascending: false })
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching tahun_ajaran:', error.message);
    }

    const daftar: TahunAjaran[] = daftarTahunAjaran ?? [];

    return (
        <div className="max-w-5xl">
            <PageHeader
                judul="Data Akademik"
                keterangan="Kelola master data akademik sekolah: tahun ajaran, kelas, siswa, dan keanggotaan rombel."
                aksi={
                    <Link
                        href="/admin/akademik/tahun-ajaran/form"
                        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Tahun Ajaran
                    </Link>
                }
            />

            <AkademikSubNav />

            {daftar.length === 0 ? (
                <EmptyState
                    judul="Belum ada tahun ajaran"
                    pesan="Tambahkan tahun ajaran baru untuk mengaktifkan pendataan kelas dan roster siswa."
                />
            ) : (
                <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-paper-sunken text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Tahun Ajaran</th>
                                    <th className="px-4 py-3 font-semibold">Semester</th>
                                    <th className="px-4 py-3 font-semibold">Rentang Periode</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {daftar.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-paper-raised">
                                        <td className="px-4 py-3.5 font-medium text-ink">
                                            <Link
                                                href={`/admin/akademik/tahun-ajaran/form?id=${item.id}`}
                                                className="underline-offset-4 hover:text-brand hover:underline"
                                            >
                                                {item.nama}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3.5 text-ink">
                                            <span className="rounded bg-paper-sunken px-2.5 py-1 text-xs font-medium text-ink">
                                                {formatSemester(item.semester)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-ink-muted">
                                            {formatTanggal(item.mulai_pada)} — {formatTanggal(item.selesai_pada)}
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
                                                    href={`/admin/akademik/tahun-ajaran/form?id=${item.id}`}
                                                    className="text-sm font-medium text-ink underline-offset-4 hover:underline"
                                                >
                                                    Ubah
                                                </Link>
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteTahunAjaran(item.id);
                                                    }}
                                                >
                                                    <DeleteButton
                                                        id={item.id}
                                                        judul={`${item.nama} (${formatSemester(item.semester)})`}
                                                        pesan={`Hapus tahun ajaran "${item.nama} - ${formatSemester(item.semester)}"? Data tidak dapat dikembalikan.`}
                                                        onDelete={async () => {
                                                            'use server';
                                                            await deleteTahunAjaran(item.id);
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
