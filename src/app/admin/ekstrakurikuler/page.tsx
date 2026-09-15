import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { redirect } from 'next/navigation';
import { deleteEkstrakurikuler } from './actions';

export const metadata = {
    title: 'Ekstrakurikuler | Admin',
};

export default async function EkstrakurikulerIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: daftarEkskul, error } = await supabase
        .from('ekstrakurikuler')
        .select('*')
        .order('urutan', { ascending: true })
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching ekstrakurikuler:', error.message);
    }

    const daftar = daftarEkskul ?? [];
    const belumLengkap = daftar.filter((e) => !e.pembina || !e.jadwal).length;

    return (
        <>
            <PageHeader
                judul="Ekstrakurikuler"
                keterangan="Kelola kegiatan ekstrakurikuler dan pembina."
                aksi={
                    <Link
                        href="/admin/ekstrakurikuler/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah
                    </Link>
                }
            />

            {belumLengkap > 0 && (
                <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                    {belumLengkap} ekstrakurikuler belum punya pembina atau jadwal. Keduanya disembunyikan di situs sampai terisi.
                </p>
            )}

            {daftar.length === 0 ? (
                <EmptyState judul="Belum ada ekstrakurikuler" pesan="Tambahkan kegiatan ekstrakurikuler sekolah." />
            ) : (
                <div className="max-w-3xl overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                            <tr>
                                <th scope="col" className="px-4 py-3">Nama</th>
                                <th scope="col" className="px-4 py-3">Pembina</th>
                                <th scope="col" className="px-4 py-3">Jadwal</th>
                                <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {daftar.map((e) => (
                                <tr key={e.id}>
                                    <td className="px-4 py-3">
                                        <Link
                                            href={`/admin/ekstrakurikuler/form?id=${e.id}`}
                                            className="font-medium text-ink underline-offset-4 hover:underline"
                                        >
                                            {e.nama}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-ink-muted">{e.pembina ?? '—'}</td>
                                    <td className="px-4 py-3 text-ink-muted">{e.jadwal ?? '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <DeleteButton
                                            id={e.id}
                                            judul={e.nama}
                                            pesan={`Hapus ekstrakurikuler "${e.nama}"?`}
                                            onDelete={async () => {
                                                'use server';
                                                await deleteEkstrakurikuler(e.id);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
