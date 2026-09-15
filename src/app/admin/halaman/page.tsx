import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/Ui';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Halaman | Admin',
};

const URL_PUBLIK: Record<string, string> = {
    sambutan_kepsek: '/profil#sambutan-kepala-sekolah',
    sejarah: '/profil#sejarah',
    visi_misi: '/profil#visi-misi',
    kurikulum: '/kurikulum',
};

export default async function HalamanIndex() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: halamanList, error } = await supabase
        .from('konten_halaman')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching halaman:', error.message);
    }

    const daftar = (halamanList ?? []).map((h) => {
        const textContent = (h.isi || '').replace(/<[^>]*>/g, '').trim();
        const adaNaskah = textContent.length > 0;
        return {
            id: h.id,
            kunci: h.kunci,
            judul: h.judul,
            terbit: Boolean(h.terbit),
            adaNaskah,
            urlUbah: `/admin/halaman/form?id=${h.id}`,
            urlPublik: URL_PUBLIK[h.kunci] ?? null,
        };
    });

    const belumAda = daftar.filter((h) => !h.adaNaskah);

    return (
        <>
            <PageHeader
                judul="Halaman"
                keterangan="Isi halaman berbasis naskah. Halaman tanpa isi otomatis disembunyikan dari navigasi situs."
            />

            {belumAda.length > 0 && (
                <p className="mb-6 max-w-3xl rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink-muted shadow-card">
                    <strong className="font-semibold text-ink">{belumAda.length} halaman belum punya naskah</strong> —{' '}
                    {belumAda.map((h) => h.judul).join(', ')}. Begitu naskahnya disimpan dan diterbitkan, tautannya muncul di navigasi.
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
                                        <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-on-brand">
                                            Tampil
                                        </span>
                                    ) : h.adaNaskah ? (
                                        <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
                                            Draf
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
                                            Naskah belum ada
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {h.urlPublik && (
                                        <Link
                                            href={h.urlPublik}
                                            target="_blank"
                                            rel="noopener"
                                            className="inline-flex items-center gap-1 text-sm text-ink-muted underline-offset-4 hover:underline"
                                        >
                                            <ExternalLink className="size-3.5" aria-hidden="true" />
                                            Lihat
                                        </Link>
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
