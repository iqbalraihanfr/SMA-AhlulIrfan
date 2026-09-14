import { Head, Link, router } from '@inertiajs/react';
import { EmptyState, PageHeader, Tombol } from '@/Components/Ui';

type BarisGuru = {
    id: number;
    nama: string;
    kategori: string;
    kategoriLabel: string;
    peran: string;
    aktif: boolean;
    fotoUrl: string | null;
    inisial: string;
    urlUbah: string;
    urlHapus: string;
};

export default function Index({ daftar }: { daftar: BarisGuru[] }) {
    const kelompok = [
        ['pendidik', 'Pendidik'],
        ['tenaga_kependidikan', 'Tenaga Kependidikan'],
    ] as const;

    const hapus = (baris: BarisGuru) => {
        if (!confirm(`Hapus ${baris.nama} dari daftar? Tindakan ini tidak bisa dibatalkan.`)) return;

        router.delete(baris.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Guru & Tenaga Kependidikan" />

            <PageHeader
                judul="Guru & Tenaga Kependidikan"
                keterangan="Nama yang tercatat di sini juga dipakai bagan struktur organisasi."
                aksi={
                    <Link
                        href={route('admin.guru.create')}
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
                    {kelompok.map(([kunci, judul]) => {
                        const isi = daftar.filter((g) => g.kategori === kunci);

                        if (isi.length === 0) return null;

                        return (
                            <section key={kunci}>
                                <h2 className="mb-3 font-heading text-lg font-semibold text-ink">
                                    {judul} <span className="text-sm font-normal text-ink-muted">({isi.length})</span>
                                </h2>

                                <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                                    {isi.map((g) => (
                                        <li key={g.id} className="flex items-center gap-4 px-4 py-3">
                                            {g.fotoUrl ? (
                                                <img src={g.fotoUrl} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
                                            ) : (
                                                <span
                                                    aria-hidden="true"
                                                    className="grid size-10 shrink-0 place-items-center rounded-full bg-paper-sunken text-sm font-semibold text-brand"
                                                >
                                                    {g.inisial}
                                                </span>
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <Link href={g.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                                                    {g.nama}
                                                </Link>
                                                {g.peran && <p className="truncate text-sm text-ink-muted">{g.peran}</p>}
                                            </div>

                                            {!g.aktif && (
                                                <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs text-ink-muted">Nonaktif</span>
                                            )}

                                            <Tombol type="button" variasi="bahaya" onClick={() => hapus(g)}>
                                                Hapus
                                            </Tombol>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            )}
        </>
    );
}
