import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { AkademikSubNav } from '../AkademikSubNav';
import { deleteSiswa } from './actions';
import type { Siswa } from '@/types/absensi';

export const metadata = {
    title: 'Data Siswa | Admin',
};

type Props = {
    searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function SiswaPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { q, status } = await searchParams;

    let query = supabase
        .from('siswa')
        .select('*')
        .order('kode_siswa', { ascending: true });

    if (q) {
        const cleanQ = q.trim();
        query = query.or(`nama.ilike.%${cleanQ}%,kode_siswa.ilike.%${cleanQ}%`);
    }

    if (status === 'aktif') {
        query = query.eq('aktif', true);
    } else if (status === 'nonaktif') {
        query = query.eq('aktif', false);
    }

    const { data: daftarSiswa, error } = await query;

    if (error) {
        console.error('Error fetching siswa:', error.message);
    }

    const daftar: Siswa[] = daftarSiswa ?? [];

    return (
        <div className="max-w-5xl">
            <PageHeader
                judul="Data Akademik"
                keterangan="Kelola master data akademik sekolah: tahun ajaran, kelas, siswa, dan keanggotaan rombel."
                aksi={
                    <Link
                        href="/admin/akademik/siswa/form"
                        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Siswa
                    </Link>
                }
            />

            <AkademikSubNav />

            {/* Filter & Search Bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form method="GET" action="/admin/akademik/siswa" className="flex items-center gap-2">
                    <input
                        type="search"
                        name="q"
                        defaultValue={q ?? ''}
                        placeholder="Cari nama atau kode siswa..."
                        className="rounded-md border-line bg-paper px-3 py-1.5 text-sm text-ink shadow-card placeholder:text-ink-faint focus:border-brand focus:ring-brand"
                    />
                    {status && <input type="hidden" name="status" value={status} />}
                    <button
                        type="submit"
                        className="rounded-md border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-paper-sunken"
                    >
                        Cari
                    </button>
                    {q && (
                        <Link
                            href="/admin/akademik/siswa"
                            className="text-xs text-ink-muted underline underline-offset-4"
                        >
                            Reset
                        </Link>
                    )}
                </form>

                <div className="flex items-center gap-1.5">
                    <Link
                        href={`/admin/akademik/siswa${q ? `?q=${encodeURIComponent(q)}` : ''}`}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                            !status || status === 'semua'
                                ? 'bg-brand text-on-brand'
                                : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                        }`}
                    >
                        Semua ({daftar.length})
                    </Link>
                    <Link
                        href={`/admin/akademik/siswa?status=aktif${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                            status === 'aktif'
                                ? 'bg-brand text-on-brand'
                                : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                        }`}
                    >
                        Aktif
                    </Link>
                    <Link
                        href={`/admin/akademik/siswa?status=nonaktif${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                            status === 'nonaktif'
                                ? 'bg-brand text-on-brand'
                                : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                        }`}
                    >
                        Nonaktif
                    </Link>
                </div>
            </div>

            {daftar.length === 0 ? (
                <EmptyState
                    judul="Data siswa tidak ditemukan"
                    pesan={
                        q
                            ? `Tidak ada siswa yang cocok dengan pencarian "${q}".`
                            : 'Belum ada data siswa terdaftar. Tambahkan siswa baru.'
                    }
                />
            ) : (
                <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-paper-sunken text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Kode Siswa</th>
                                    <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                                    <th className="px-4 py-3 font-semibold">L/P</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {daftar.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-paper-raised">
                                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-ink">
                                            {item.kode_siswa}
                                        </td>
                                        <td className="px-4 py-3.5 font-medium text-ink">
                                            <Link
                                                href={`/admin/akademik/siswa/form?id=${item.id}`}
                                                className="underline-offset-4 hover:text-brand hover:underline"
                                            >
                                                {item.nama}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3.5 text-ink">
                                            {item.jenis_kelamin === 'L' ? (
                                                <span className="text-xs">Laki-laki</span>
                                            ) : item.jenis_kelamin === 'P' ? (
                                                <span className="text-xs">Perempuan</span>
                                            ) : (
                                                '-'
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
                                                    href={`/admin/akademik/siswa/form?id=${item.id}`}
                                                    className="text-sm font-medium text-ink underline-offset-4 hover:underline"
                                                >
                                                    Ubah
                                                </Link>
                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteSiswa(item.id);
                                                    }}
                                                >
                                                    <DeleteButton
                                                        id={item.id}
                                                        judul={item.nama}
                                                        pesan={`Hapus siswa "${item.nama}" (${item.kode_siswa})? Tindakan ini tidak dapat dibatalkan.`}
                                                        onDelete={async () => {
                                                            'use server';
                                                            await deleteSiswa(item.id);
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
