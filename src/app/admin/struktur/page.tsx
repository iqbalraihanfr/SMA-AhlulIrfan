import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { redirect } from 'next/navigation';
import { deleteStruktur } from './actions';

export const metadata = {
    title: 'Struktur Organisasi | Admin',
};

type Simpul = {
    id: number;
    label: string;
    nama: string | null;
    tipe: string;
    atasan_id: number | null;
    baris: number;
    urutan: number;
};

const LABEL_TIPE: Record<string, string> = {
    orang: 'Orang',
    kelompok: 'Kelompok',
    penasihat: 'Penasihat',
};

function Cabang({
    simpul,
    semua,
    dalam,
}: {
    simpul: Simpul;
    semua: Simpul[];
    dalam: number;
}) {
    const anak = semua.filter((s) => s.atasan_id === simpul.id);

    return (
        <>
            <li
                className="flex items-center gap-3 px-4 py-3"
                style={{ paddingLeft: `${dalam * 1.5 + 1}rem` }}
            >
                <div className="min-w-0 flex-1">
                    <Link
                        href={`/admin/struktur/form?id=${simpul.id}`}
                        className="font-medium text-ink underline-offset-4 hover:underline"
                    >
                        {simpul.label}
                    </Link>
                    {simpul.nama && <p className="truncate text-sm text-ink-muted">{simpul.nama}</p>}
                </div>

                <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs text-ink-muted">
                    {LABEL_TIPE[simpul.tipe] ?? simpul.tipe}
                </span>

                {simpul.atasan_id !== null && (
                    <DeleteButton
                        id={simpul.id}
                        judul={simpul.label}
                        pesan={`Hapus simpul "${simpul.label}" beserta seluruh turunannya?`}
                        onDelete={async () => {
                            'use server';
                            await deleteStruktur(simpul.id);
                        }}
                    />
                )}
            </li>

            {anak.map((a) => (
                <Cabang key={a.id} simpul={a} semua={semua} dalam={dalam + 1} />
            ))}
        </>
    );
}

export default async function StrukturIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: nodes, error } = await supabase
        .from('struktur_organisasi')
        .select(`
            id,
            label,
            tipe,
            nama_luar,
            atasan_id,
            baris,
            urutan,
            guru:guru_id ( nama )
        `)
        .order('baris', { ascending: true })
        .order('urutan', { ascending: true })
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching struktur_organisasi:', error.message);
    }

    const daftar: Simpul[] = (nodes ?? []).map((item: any) => ({
        id: item.id,
        label: item.label,
        nama: item.tipe === 'penasihat' ? item.nama_luar : item.guru?.nama || null,
        tipe: item.tipe,
        atasan_id: item.atasan_id,
        baris: item.baris ?? 1,
        urutan: item.urutan ?? 0,
    }));

    const akar = daftar.filter((s) => s.atasan_id === null);

    return (
        <>
            <PageHeader
                judul="Struktur Organisasi"
                keterangan="Nama diambil dari data Guru & Tendik, jadi bagan ikut berubah saat ada mutasi."
                aksi={
                    <Link
                        href="/admin/struktur/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Simpul
                    </Link>
                }
            />

            <div className="max-w-3xl space-y-4">
                <p className="text-sm">
                    <Link
                        href="/profil/struktur-organisasi"
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1 text-ink-muted underline underline-offset-4"
                    >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        Lihat bagan di situs
                    </Link>
                </p>

                <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    {akar.map((s) => (
                        <Cabang key={s.id} simpul={s} semua={daftar} dalam={0} />
                    ))}
                </ul>

                <p className="text-sm text-ink-muted">
                    Simpul teratas tidak bisa dihapus — tanpa akar, halaman bagan di situs tidak bisa dirender.
                </p>
            </div>
        </>
    );
}
