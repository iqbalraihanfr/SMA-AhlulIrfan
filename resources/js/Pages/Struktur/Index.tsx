import { Head, Link, router } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { PageHeader, Tombol } from '@/Components/Ui';

type Simpul = {
    id: number;
    label: string;
    nama: string | null;
    tipe: string;
    atasanId: number | null;
    baris: number;
    urutan: number;
    urlUbah: string;
    urlHapus: string;
};

type Props = { daftar: Simpul[]; urlTambah: string; urlPublik: string };

const LABEL_TIPE: Record<string, string> = {
    orang: 'Orang',
    kelompok: 'Kelompok',
    penasihat: 'Penasihat',
};

/** Merender pohon secara rekursif agar hierarkinya terbaca sekali lihat. */
function Cabang({ simpul, semua, dalam, onHapus }: { simpul: Simpul; semua: Simpul[]; dalam: number; onHapus: (s: Simpul) => void }) {
    const anak = semua.filter((s) => s.atasanId === simpul.id);

    return (
        <>
            <li className="flex items-center gap-3 px-4 py-3" style={{ paddingLeft: `${dalam * 1.5 + 1}rem` }}>
                <div className="min-w-0 flex-1">
                    <Link href={simpul.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                        {simpul.label}
                    </Link>
                    {simpul.nama && <p className="truncate text-sm text-ink-muted">{simpul.nama}</p>}
                </div>

                <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs text-ink-muted">
                    {LABEL_TIPE[simpul.tipe] ?? simpul.tipe}
                </span>

                {simpul.atasanId !== null && (
                    <Tombol type="button" variasi="bahaya" onClick={() => onHapus(simpul)}>Hapus</Tombol>
                )}
            </li>

            {anak.map((a) => (
                <Cabang key={a.id} simpul={a} semua={semua} dalam={dalam + 1} onHapus={onHapus} />
            ))}
        </>
    );
}

export default function Index({ daftar, urlTambah, urlPublik }: Props) {
    const akar = daftar.filter((s) => s.atasanId === null);

    const hapus = (s: Simpul) => {
        if (!confirm(`Hapus simpul "${s.label}" beserta seluruh turunannya?`)) return;

        router.delete(s.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Struktur Organisasi" />

            <PageHeader
                judul="Struktur Organisasi"
                keterangan="Nama diambil dari data Guru & Tendik, jadi bagan ikut berubah saat ada mutasi."
                aksi={
                    <Link
                        href={urlTambah}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tambah Simpul
                    </Link>
                }
            />

            <div className="max-w-3xl space-y-4">
                <p className="text-sm">
                    <a href={urlPublik} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-ink-muted underline underline-offset-4">
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        Lihat bagan di situs
                    </a>
                </p>

                <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                    {akar.map((s) => (
                        <Cabang key={s.id} simpul={s} semua={daftar} dalam={0} onHapus={hapus} />
                    ))}
                </ul>

                <p className="text-sm text-ink-muted">
                    Simpul teratas tidak bisa dihapus — tanpa akar, halaman bagan di situs tidak bisa dirender dan tidak
                    ada cara membuat akar baru dari sini.
                </p>
            </div>
        </>
    );
}
