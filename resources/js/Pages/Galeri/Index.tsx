import { Head, Link, router } from '@inertiajs/react';
import { EmptyState, PageHeader, Tombol } from '@/Components/Ui';

type BarisAlbum = {
    id: number;
    judul: string;
    jumlahFoto: number;
    sampulUrl: string | null;
    urlUbah: string;
    urlHapus: string;
};

export default function Index({ daftar }: { daftar: BarisAlbum[] }) {
    const hapus = (baris: BarisAlbum) => {
        if (!confirm(`Hapus album "${baris.judul}" beserta ${baris.jumlahFoto} fotonya? Tindakan ini tidak bisa dibatalkan.`)) return;

        router.delete(baris.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Galeri" />

            <PageHeader
                judul="Galeri"
                keterangan="Album foto kegiatan sekolah."
                aksi={
                    <Link
                        href={route('admin.galeri.create')}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Album Baru
                    </Link>
                }
            />

            {daftar.length === 0 ? (
                <EmptyState judul="Belum ada album" pesan="Buat album dulu, lalu unggah foto ke dalamnya." />
            ) : (
                <ul className="grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {daftar.map((a) => (
                        <li key={a.id} className="overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                            {a.sampulUrl ? (
                                <img src={a.sampulUrl} alt="" width={320} height={240} className="aspect-[4/3] w-full object-cover" />
                            ) : (
                                <div className="grid aspect-[4/3] w-full place-items-center bg-paper-sunken text-sm text-ink-faint">
                                    Belum ada foto
                                </div>
                            )}

                            <div className="space-y-2 p-4">
                                <Link href={a.urlUbah} className="block font-medium text-ink underline-offset-4 hover:underline">
                                    {a.judul}
                                </Link>
                                <p className="text-sm text-ink-muted">{a.jumlahFoto} foto</p>
                                <Tombol type="button" variasi="bahaya" onClick={() => hapus(a)}>Hapus album</Tombol>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
