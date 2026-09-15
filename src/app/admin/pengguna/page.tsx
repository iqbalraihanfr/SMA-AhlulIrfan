import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/Ui';
import { redirect } from 'next/navigation';
import { HapusPenggunaButton } from './HapusPenggunaButton';

export const metadata = {
    title: 'Akun Pengguna | Admin',
};

export default async function PenggunaIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('peran')
        .eq('id', user.id)
        .maybeSingle();

    if (profile?.peran !== 'super-admin') {
        redirect('/admin');
    }

    const { data: userList, error } = await supabase
        .from('users')
        .select(`
            id,
            nama,
            email,
            peran,
            guru:guru_id ( nama )
        `)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching users:', error.message);
    }

    const daftar = (userList ?? []).map((u: any) => ({
        id: u.id,
        nama: u.nama,
        email: u.email,
        peran: u.peran,
        peranLabel: u.peran === 'super-admin' ? 'Super Admin' : u.peran === 'guru' ? 'Guru' : 'Admin Sekolah',
        guruNama: u.guru?.nama || null,
        diriSendiri: u.id === user.id,
        urlUbah: `/admin/pengguna/form?id=${u.id}`,
    }));

    return (
        <>
            <PageHeader
                judul="Akun Pengguna"
                keterangan="Kelola akun pengelola dan staf sekolah yang berhak mengakses panel admin."
                aksi={
                    <Link
                        href="/admin/pengguna/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Akun
                    </Link>
                }
            />

            <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                <strong className="font-semibold text-ink">Ini jalur pemulihan resmi saat staf lupa kata sandi.</strong>{' '}
                Buka akunnya, isi kata sandi baru, lalu sampaikan langsung kepada staf yang bersangkutan.
            </p>

            <div className="max-w-3xl overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                        <tr>
                            <th scope="col" className="px-4 py-3">Nama</th>
                            <th scope="col" className="px-4 py-3">Email</th>
                            <th scope="col" className="px-4 py-3">Peran</th>
                            <th scope="col" className="px-4 py-3">Tautan guru</th>
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
                                            u.peran === 'super-admin'
                                                ? 'bg-brand text-on-brand'
                                                : 'bg-paper-sunken text-ink-muted'
                                        }`}
                                    >
                                        {u.peranLabel}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-ink-muted">
                                    {u.guruNama ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {u.diriSendiri ? (
                                        <span className="text-xs text-ink-faint">—</span>
                                    ) : (
                                        <HapusPenggunaButton id={u.id} email={u.email} />
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
