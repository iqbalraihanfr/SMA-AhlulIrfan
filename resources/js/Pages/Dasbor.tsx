import { Head } from '@inertiajs/react';
import { PageHeader } from '@/Components/Ui';

type Kesiapan = {
    label: string;
    siap: boolean;
    catatan: string;
};

type Props = {
    jumlah: {
        berita: number;
        beritaTerbit: number;
        guru: number;
        ekstrakurikuler: number;
        album: number;
    };
    kesiapan: Kesiapan[];
};

export default function Dasbor({ jumlah, kesiapan }: Props) {
    const kartu = [
        ['Berita terbit', jumlah.beritaTerbit],
        ['Guru & tendik', jumlah.guru],
        ['Ekstrakurikuler', jumlah.ekstrakurikuler],
        ['Album galeri', jumlah.album],
    ] as const;

    const belumSiap = kesiapan.filter((k) => !k.siap).length;

    return (
        <>
            <Head title="Dasbor" />

            <PageHeader judul="Dasbor" keterangan="Ringkasan isi situs dan kesiapan peluncuran." />

            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
                <section>
                    <h2 className="sr-only">Ringkasan isi</h2>

                    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {kartu.map(([label, nilai]) => (
                            <div key={label} className="rounded-lg border border-line bg-paper p-4 shadow-card">
                                <dt className="text-sm text-ink-muted">{label}</dt>
                                <dd className="mt-1 font-heading text-2xl font-semibold text-ink">{nilai}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className="rounded-lg border border-line bg-paper p-6 shadow-card">
                    <h2 className="font-heading text-lg font-semibold text-ink">Kesiapan peluncuran</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                        {belumSiap === 0
                            ? 'Semua syarat terpenuhi.'
                            : `${belumSiap} hal masih menghambat peluncuran. Daftar ini sengaja selalu tampil supaya tidak terlupakan sampai hari H.`}
                    </p>

                    <ul className="mt-5 divide-y divide-line">
                        {kesiapan.map((item) => (
                            <li key={item.label} className="flex items-start gap-3 py-3">
                                <span
                                    aria-hidden="true"
                                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold ${
                                        item.siap ? 'bg-brand text-on-brand' : 'bg-paper-sunken text-ink-faint'
                                    }`}
                                >
                                    {item.siap ? '✓' : '·'}
                                </span>

                                <span>
                                    <span className="text-sm font-medium text-ink">{item.label}</span>
                                    <span className="sr-only">{item.siap ? ' — sudah siap' : ' — belum siap'}</span>
                                    {!item.siap && <span className="block text-sm text-ink-muted">{item.catatan}</span>}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </>
    );
}
