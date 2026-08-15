import { Head, Link } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { PageHeader } from '@/Components/Ui';

type BarisHalaman = {
    id: number;
    kunci: string;
    judul: string;
    terbit: boolean;
    adaNaskah: boolean;
    urlUbah: string;
    urlPublik: string | null;
};

export default function Index({ daftar }: { daftar: BarisHalaman[] }) {
    const belumAda = daftar.filter((h) => !h.adaNaskah);

    return (
        <>
            <Head title="Halaman" />

            <PageHeader
                judul="Halaman"
                keterangan="Isi halaman berbasis naskah. Halaman tanpa isi otomatis disembunyikan dari navigasi situs."
            />

            {belumAda.length > 0 && (
                <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                    <strong className="font-semibold text-ink">{belumAda.length} halaman belum punya naskah</strong> —{' '}
                    {belumAda.map((h) => h.judul).join(', ')}. Halaman-halaman itu belum tampil di situs. Begitu naskahnya
                    ditempel dan diterbitkan, tautannya muncul sendiri di navigasi.
                </p>
            )}

            <div className="max-w-3xl overflow-hidden rounded-lg border border-line bg-paper shadow-card">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                        <tr>
                            <th scope="col" className="px-4 py-3">Halaman</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {daftar.map((h) => (
                            <tr key={h.id}>
                                <td className="px-4 py-3">
                                    <Link href={h.urlUbah} className="font-medium text-ink underline-offset-4 hover:underline">
                                        {h.judul}
                                    </Link>
                                </td>
                                <td className="px-4 py-3">
                                    {h.terbit ? (
                                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-on-brand">Tampil</span>
                                    ) : h.adaNaskah ? (
                                        <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">Draf</span>
                                    ) : (
                                        <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
                                            Naskah belum ada
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {h.urlPublik && (
                                        <a
                                            href={h.urlPublik}
                                            target="_blank"
                                            rel="noopener"
                                            className="inline-flex items-center gap-1 text-sm text-ink-muted underline-offset-4 hover:underline"
                                        >
                                            <ExternalLink className="size-3.5" aria-hidden="true" />
                                            Lihat
                                        </a>
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
