import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Tombol } from '@/Components/Ui';

type BarisPengguna = {
    id: number;
    nama: string;
    email: string;
    peran: string | null;
    peranLabel: string;
    diriSendiri: boolean;
    urlUbah: string;
    urlHapus: string;
};

export default function Index({ daftar }: { daftar: BarisPengguna[] }) {
    const hapus = (baris: BarisPengguna) => {
        if (!confirm(`Hapus akun ${baris.nama} (${baris.email})?`)) return;

        router.delete(baris.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Akun Pengguna" />

            <PageHeader
                judul="Akun Pengguna"
                keterangan="Hanya super admin yang bisa membuka halaman ini."
                aksi={
                    <Link
                        href={route('admin.pengguna.create')}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Akun
                    </Link>
                }
            />

            <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                <strong className="font-semibold text-ink">Ini jalur pemulihan resmi saat staf lupa kata sandi.</strong>{' '}
                Buka akunnya, isi kata sandi baru, lalu sampaikan langsung — jangan lewat grup chat. Karena itu situs ini
                tidak memerlukan SMTP untuk bisa diluncurkan.
            </p>

            <div className="max-w-3xl overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                        <tr>
                            <th scope="col" className="px-4 py-3">Nama</th>
                            <th scope="col" className="px-4 py-3">Email</th>
                            <th scope="col" className="px-4 py-3">Peran</th>
                            <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {daftar.map((u) => (
                            <tr key={u.id}>
                                <td className="px-4 py-3">
                                    <Link href={u.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                                        {u.nama}
                                    </Link>
                                    {u.diriSendiri && <span className="ml-2 text-xs text-ink-muted">(Anda)</span>}
                                </td>
                                <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            u.peran === 'super-admin' ? 'bg-brand text-on-brand' : 'bg-paper-sunken text-ink-muted'
                                        }`}
                                    >
                                        {u.peranLabel}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {u.diriSendiri ? (
                                        <span className="text-xs text-ink-faint">—</span>
                                    ) : (
                                        <Tombol type="button" variasi="bahaya" onClick={() => hapus(u)}>Hapus</Tombol>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
