import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { EmptyState, Input, PageHeader, Select, Tombol } from '@/Components/Ui';

/**
 * Label paginasi Laravel datang sebagai entitas HTML ("&laquo; Previous").
 * Diterjemahkan ke teks biasa agar tidak perlu dangerouslySetInnerHTML —
 * sumbernya memang tepercaya, tapi menyuntik HTML untuk tiga label statis
 * itu risiko tanpa imbalan.
 */
const labelHalaman = (label: string): string =>
    label
        .replace(/&laquo;\s*/g, '‹ ')
        .replace(/\s*&raquo;/g, ' ›')
        .replace('Previous', 'Sebelumnya')
        .replace('Next', 'Berikutnya')
        .trim();

type BarisBerita = {
    id: number;
    judul: string;
    slug: string;
    status: string;
    statusLabel: string;
    diterbitkanPada: string | null;
    urlUbah: string;
    urlHapus: string;
};

type Props = {
    daftar: {
        data: BarisBerita[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filter: { cari: string | null; status: string | null };
    pilihanStatus: { value: string; label: string }[];
};

export default function Index({ daftar, filter, pilihanStatus }: Props) {
    const [cari, setCari] = useState(filter.cari ?? '');
    const [status, setStatus] = useState(filter.status ?? '');

    const terapkan = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        router.get(route('admin.berita.index'), { cari, status }, { preserveState: true, replace: true });
    };

    const hapus = (baris: BarisBerita) => {
        // Konfirmasi wajib: penghapusan berita tidak bisa dibatalkan dan tidak
        // ada tong sampah. Admin sekolah bukan pengguna teknis.
        if (!confirm(`Hapus berita "${baris.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;

        router.delete(baris.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Berita" />

            <PageHeader
                judul="Berita"
                keterangan="Kabar, kegiatan, dan pengumuman sekolah."
                aksi={
                    <Link
                        href={route('admin.berita.create')}
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tulis Berita
                    </Link>
                }
            />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
                <form onSubmit={terapkan} className="flex flex-wrap items-end gap-3">
                    <Input
                        type="search"
                        value={cari}
                        onChange={(e) => setCari(e.target.value)}
                        placeholder="Cari judul berita"
                        aria-label="Cari judul berita"
                        className="max-w-xs"
                    />

                    <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Saring status" className="max-w-40">
                        <option value="">Semua status</option>
                        {pilihanStatus.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </Select>

                    <Tombol variasi="garis">Terapkan</Tombol>
                </form>

                {daftar.data.length === 0 ? (
                    <EmptyState
                        judul="Belum ada berita"
                        pesan="Mulai dengan menulis satu berita agar halaman Berita di situs tidak kosong saat peluncuran."
                    />
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-line bg-paper shadow-card">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Judul</th>
                                        <th scope="col" className="px-4 py-3">Status</th>
                                        <th scope="col" className="px-4 py-3">Terbit</th>
                                        <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {daftar.data.map((baris) => (
                                        <tr key={baris.id}>
                                            <td className="px-4 py-3">
                                                <Link href={baris.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                                                    {baris.judul}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        baris.status === 'terbit'
                                                            ? 'bg-brand text-on-brand'
                                                            : 'bg-paper-sunken text-ink-muted'
                                                    }`}
                                                >
                                                    {baris.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-ink-muted">{baris.diterbitkanPada ?? '—'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Tombol type="button" variasi="bahaya" onClick={() => hapus(baris)}>
                                                    Hapus
                                                </Tombol>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <nav className="flex flex-wrap gap-1" aria-label="Halaman berita">
                            {daftar.links.map((tautan, i) =>
                                tautan.url ? (
                                    <Link
                                        key={i}
                                        href={tautan.url}
                                        aria-current={tautan.active ? 'page' : undefined}
                                        className={`rounded-md px-3 py-2 text-sm ${
                                            tautan.active ? 'bg-brand text-on-brand' : 'text-ink-muted hover:bg-paper-sunken'
                                        }`}
                                    >
                                        {labelHalaman(tautan.label)}
                                    </Link>
                                ) : (
                                    <span key={i} className="px-3 py-2 text-sm text-ink-faint">
                                        {labelHalaman(tautan.label)}
                                    </span>
                                ),
                            )}
                        </nav>
                    </>
                )}
            </div>
        </>
    );
}
