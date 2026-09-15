import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, PageHeader } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { redirect } from 'next/navigation';
import { deleteAlbum } from './actions';

export const metadata = {
    title: 'Galeri | Admin',
};

export default async function GaleriIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: daftarAlbum, error } = await supabase
        .from('album')
        .select('*')
        .order('urutan', { ascending: true })
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching albums:', error.message);
    }

    const daftar = daftarAlbum ?? [];

    return (
        <>
            <PageHeader
                judul="Galeri"
                keterangan="Album foto kegiatan sekolah."
                aksi={
                    <Link
                        href="/admin/galeri/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Album Baru
                    </Link>
                }
            />

            {daftar.length === 0 ? (
                <EmptyState judul="Belum ada album" pesan="Buat album baru untuk menampilkan dokumentasi sekolah." />
            ) : (
                <ul className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {daftar.map((a) => (
                        <li key={a.id} className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                            {a.image_url ? (
                                <img
                                    src={a.image_url}
                                    alt={a.judul}
                                    width={320}
                                    height={240}
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            ) : (
                                <div className="grid aspect-[4/3] w-full place-items-center bg-paper-sunken text-sm text-ink-muted">
                                    Belum ada foto
                                </div>
                            )}

                            <div className="space-y-2 p-4">
                                <Link
                                    href={`/admin/galeri/form?id=${a.id}`}
                                    className="block font-medium text-ink underline-offset-4 hover:underline"
                                >
                                    {a.judul}
                                </Link>
                                {a.deskripsi && (
                                    <p className="line-clamp-2 text-xs text-ink-muted">{a.deskripsi}</p>
                                )}
                                <div className="pt-2">
                                    <DeleteButton
                                        id={a.id}
                                        judul={a.judul}
                                        pesan={`Hapus album "${a.judul}"? Tindakan ini tidak bisa dibatalkan.`}
                                        onDelete={async () => {
                                            'use server';
                                            await deleteAlbum(a.id);
                                        }}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
