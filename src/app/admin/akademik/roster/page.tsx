import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { AkademikSubNav } from '../AkademikSubNav';
import { formatTanggal, formatSemester } from '@/lib/akademik';
import { deleteRoster } from './actions';

export const metadata = {
    title: 'Roster Siswa Kelas | Admin',
};

type Props = {
    searchParams: Promise<{ kelas_id?: string }>;
};

export default async function RosterPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { kelas_id: queryKelasId } = await searchParams;

    // Ambil daftar kelas untuk selector
    const { data: daftarKelas } = await supabase
        .from('kelas')
        .select(`
            id,
            nama,
            tingkat,
            aktif,
            tahun_ajaran (
                id,
                nama,
                semester,
                aktif
            )
        `)
        .order('tingkat', { ascending: true })
        .order('nama', { ascending: true });

    const listKelas = daftarKelas ?? [];

    // Tentukan kelas yang aktif dipilih (default ke kelas pertama jika belum dipilih)
    const selectedKelasId = queryKelasId
        ? parseInt(queryKelasId, 10)
        : listKelas.length > 0
        ? listKelas[0].id
        : null;

    const kelasTerpilih = listKelas.find((k) => k.id === selectedKelasId);

    // Ambil data anggota kelas
    let anggotaQuery = supabase
        .from('anggota_kelas')
        .select(`
            id,
            kelas_id,
            siswa_id,
            mulai_pada,
            selesai_pada,
            siswa (
                id,
                kode_siswa,
                nama,
                jenis_kelamin,
                aktif
            ),
            kelas (
                id,
                nama,
                tingkat,
                tahun_ajaran (
                    id,
                    nama,
                    semester
                )
            )
        `)
        .order('id', { ascending: true });

    if (selectedKelasId) {
        anggotaQuery = anggotaQuery.eq('kelas_id', selectedKelasId);
    }

    const { data: daftarAnggota, error } = await anggotaQuery;

    if (error) {
        console.error('Error fetching anggota_kelas:', error.message);
    }

    const daftar = daftarAnggota ?? [];

    return (
        <div className="max-w-5xl">
            <PageHeader
                judul="Data Akademik"
                keterangan="Kelola master data akademik sekolah: tahun ajaran, kelas, siswa, dan keanggotaan rombel."
                aksi={
                    <Link
                        href={`/admin/akademik/roster/form${selectedKelasId ? `?kelas_id=${selectedKelasId}` : ''}`}
                        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Anggota Roster
                    </Link>
                }
            />

            <AkademikSubNav />

            {/* Pilihan Rombongan Belajar (Kelas) */}
            {listKelas.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        Pilih Kelas:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {listKelas.map((k: any) => {
                            const terpilih = selectedKelasId === k.id;
                            return (
                                <Link
                                    key={k.id}
                                    href={`/admin/akademik/roster?kelas_id=${k.id}`}
                                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                                        terpilih
                                            ? 'bg-brand text-on-brand'
                                            : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                                    }`}
                                >
                                    {k.nama}{' '}
                                    <span className="text-[10px] opacity-75">
                                        ({k.tahun_ajaran ? `${k.tahun_ajaran.nama} ${formatSemester(k.tahun_ajaran.semester)}` : ''})
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {listKelas.length === 0 ? (
                <EmptyState
                    judul="Belum ada kelas yang dibuat"
                    pesan="Silakan tambahkan data kelas terlebih dahulu sebelum mendaftarkan anggota rombel."
                />
            ) : daftar.length === 0 ? (
                <EmptyState
                    judul={`Belum ada siswa di kelas ${kelasTerpilih?.nama ?? ''}`}
                    pesan="Tambahkan siswa ke dalam rombel kelas ini untuk mulai mengaktifkan absensi."
                />
            ) : (
                <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    <div className="border-b border-line bg-paper-sunken px-4 py-3 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-heading text-base font-semibold text-ink">
                                Roster Kelas {kelasTerpilih?.nama}
                            </h2>
                            <p className="text-xs text-ink-muted">
                                Total: {daftar.length} siswa terdaftar
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-line bg-paper-sunken text-xs uppercase tracking-wider text-ink-muted">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">No</th>
                                    <th className="px-4 py-3 font-semibold">Kode Siswa</th>
                                    <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                                    <th className="px-4 py-3 font-semibold">L/P</th>
                                    <th className="px-4 py-3 font-semibold">Periode Keanggotaan</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {daftar.map((item: any, idx: number) => {
                                    const isSelesai = Boolean(item.selesai_pada);
                                    return (
                                        <tr key={item.id} className="transition hover:bg-paper-raised">
                                            <td className="px-4 py-3.5 text-xs text-ink-muted">{idx + 1}</td>
                                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-ink">
                                                {item.siswa?.kode_siswa ?? '-'}
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-ink">
                                                <Link
                                                    href={`/admin/akademik/roster/form?id=${item.id}`}
                                                    className="underline-offset-4 hover:text-brand hover:underline"
                                                >
                                                    {item.siswa?.nama ?? '-'}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3.5 text-ink">
                                                {item.siswa?.jenis_kelamin ?? '-'}
                                            </td>
                                            <td className="px-4 py-3.5 text-ink-muted">
                                                {formatTanggal(item.mulai_pada)} s.d.{' '}
                                                {item.selesai_pada ? formatTanggal(item.selesai_pada) : 'Sekarang'}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {!isSelesai ? (
                                                    <span className="inline-flex items-center rounded-full bg-brand/12 px-2.5 py-0.5 text-xs font-medium text-brand">
                                                        ● Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-paper-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
                                                        Selesai/Pindah
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="inline-flex items-center gap-3">
                                                    <Link
                                                        href={`/admin/akademik/roster/form?id=${item.id}`}
                                                        className="text-sm font-medium text-ink underline-offset-4 hover:underline"
                                                    >
                                                        Ubah
                                                    </Link>
                                                    <form
                                                        action={async () => {
                                                            'use server';
                                                            await deleteRoster(item.id);
                                                        }}
                                                    >
                                                        <DeleteButton
                                                            id={item.id}
                                                            judul={item.siswa?.nama ?? 'Siswa'}
                                                            pesan={`Keluarkan siswa "${item.siswa?.nama ?? ''}" dari roster kelas ini?`}
                                                            onDelete={async () => {
                                                                'use server';
                                                                await deleteRoster(item.id);
                                                            }}
                                                        />
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
