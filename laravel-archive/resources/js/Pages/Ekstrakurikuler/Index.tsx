import { Head, Link, router } from '@inertiajs/react';
import { EmptyState, PageHeader, Tombol } from '@/Components/Ui';

type BarisEkskul = {
    id: number;
    nama: string;
    pembina: string | null;
    jadwal: string | null;
    adaGambar: boolean;
    urlUbah: string;
    urlHapus: string;
};

export default function Index({ daftar }: { daftar: BarisEkskul[] }) {
    const belumLengkap = daftar.filter((e) => !e.pembina || !e.jadwal).length;

    const hapus = (baris: BarisEkskul) => {
        if (!confirm(`Hapus ekstrakurikuler "${baris.nama}"?`)) return;

        router.delete(baris.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Ekstrakurikuler" />

            <PageHeader
                judul="Ekstrakurikuler"
                aksi={
                    <Link
                        href={route('admin.ekstrakurikuler.create')}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah
                    </Link>
                }
            />

            {belumLengkap > 0 && (
                <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                    {belumLengkap} ekstrakurikuler belum punya pembina atau jadwal. Keduanya belum ada di naskah sekolah,
                    jadi bagian itu memang disembunyikan di situs sampai terisi — bukan ditampilkan kosong.
                </p>
            )}

            {daftar.length === 0 ? (
                <EmptyState judul="Belum ada ekstrakurikuler" />
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
                                        <Link href={e.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                                            {e.nama}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 text-ink-muted">{e.pembina ?? '—'}</td>
                                    <td className="px-4 py-3 text-ink-muted">{e.jadwal ?? '—'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Tombol type="button" variasi="bahaya" onClick={() => hapus(e)}>Hapus</Tombol>
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
