import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { redirect } from 'next/navigation';
import { deleteGuru } from './actions';

export const metadata = {
    title: 'Guru & Tenaga Kependidikan | Admin',
};

function dapatkanInisial(nama: string): string {
    const kata = nama.trim().split(/\s+/);
    if (kata.length === 1) return kata[0].slice(0, 2).toUpperCase();
    return (kata[0][0] + kata[1][0]).toUpperCase();
}

export default async function GuruIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: daftarGuru, error } = await supabase
        .from('guru')
        .select('*')
        .order('urutan', { ascending: true })
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching guru:', error.message);
    }

    const daftar = daftarGuru ?? [];

    const kelompok = [
        { kunci: 'pendidik', judul: 'Pendidik' },
        { kunci: 'tenaga_kependidikan', judul: 'Tenaga Kependidikan' },
    ];

    return (
        <>
            <PageHeader
                judul="Guru & Tenaga Kependidikan"
                keterangan="Nama yang tercatat di sini juga dipakai bagan struktur organisasi."
                aksi={
                    <Link
                        href="/admin/guru/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Orang
                    </Link>
                }
            />

            {daftar.length === 0 ? (
                <EmptyState judul="Belum ada data" pesan="Tambahkan pendidik dan tenaga kependidikan sekolah." />
            ) : (
                <div className="max-w-4xl space-y-8">
                    {kelompok.map(({ kunci, judul }) => {
                        const isi = daftar.filter((g) => g.kategori === kunci);

                        if (isi.length === 0) return null;

                        return (
                            <section key={kunci}>
                                <h2 className="mb-3 font-heading text-lg font-semibold text-ink">
                                    {judul} <span className="text-sm font-normal text-ink-muted">({isi.length})</span>
                                </h2>

                                <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                                    {isi.map((g) => {
                                        const peran = [g.jabatan, g.mata_pelajaran].filter(Boolean).join(' • ');

                                        return (
                                            <li key={g.id} className="flex items-center gap-4 px-4 py-3">
                                                {g.image_url ? (
                                                    <img
                                                        src={g.image_url}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                        className="size-10 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span
                                                        aria-hidden="true"
                                                        className="grid size-10 shrink-0 place-items-center rounded-full bg-paper-sunken text-sm font-semibold text-brand"
                                                    >
                                                        {dapatkanInisial(g.nama)}
                                                    </span>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/admin/guru/form?id=${g.id}`}
                                                        className="font-medium text-ink underline-offset-4 hover:underline"
                                                    >
                                                        {g.nama}
                                                    </Link>
                                                    {peran && <p className="truncate text-sm text-ink-muted">{peran}</p>}
                                                </div>

                                                {!g.aktif && (
                                                    <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs text-ink-muted">
                                                        Nonaktif
                                                    </span>
                                                )}

                                                <form
                                                    action={async () => {
                                                        'use server';
                                                        await deleteGuru(g.id);
                                                    }}
                                                >
                                                    <DeleteButton
                                                        id={g.id}
                                                        judul={g.nama}
                                                        pesan={`Hapus ${g.nama} dari daftar? Tindakan ini tidak bisa dibatalkan.`}
                                                        onDelete={async () => {
                                                            'use server';
                                                            await deleteGuru(g.id);
                                                        }}
                                                    />
                                                </form>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            )}
        </>
    );
}
