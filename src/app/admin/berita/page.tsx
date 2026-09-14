import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EmptyState, Input, PageHeader, Select, Tombol } from '@/components/Ui';
import { DeleteButton } from '@/components/DeleteButton';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Berita | Admin',
};

const labelHalaman = (label: string): string =>
    label
        .replace(/&laquo;\s*/g, '‹ ')
        .replace(/\s*&raquo;/g, ' ›')
        .replace('Previous', 'Sebelumnya')
        .replace('Next', 'Berikutnya')
        .trim();

export default async function BeritaIndex(props: { searchParams: Promise<{ cari?: string; status?: string; page?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const cari = searchParams.cari ?? '';
    const status = searchParams.status ?? '';
    const page = parseInt(searchParams.page ?? '1', 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    let query = supabase
        .from('berita')
        .select('id, judul, slug, status, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (cari) {
        query = query.ilike('judul', `%${cari}%`);
    }

    if (status) {
        query = query.eq('status', status);
    }

    const { data: berita, count } = await query;

    const data = (berita ?? []).map((b) => ({
        id: b.id,
        judul: b.judul,
        slug: b.slug,
        status: b.status,
        statusLabel: b.status === 'terbit' ? 'Terbit' : 'Draf',
        diterbitkanPada: b.created_at ? new Date(b.created_at).toLocaleDateString('id-ID') : null,
        urlUbah: `/admin/berita/form?id=${b.id}`,
        urlHapus: `/api/admin/berita/${b.id}`, // We'll need a client component or server action to delete
    }));

    const totalPages = count ? Math.ceil(count / limit) : 0;
    
    // Generate simple pagination links
    const links = [];
    if (totalPages > 1) {
        links.push({ url: page > 1 ? `?page=${page - 1}&cari=${cari}&status=${status}` : null, label: '‹ Sebelumnya', active: false });
        for (let i = 1; i <= totalPages; i++) {
            links.push({ url: `?page=${i}&cari=${cari}&status=${status}`, label: i.toString(), active: i === page });
        }
        links.push({ url: page < totalPages ? `?page=${page + 1}&cari=${cari}&status=${status}` : null, label: 'Berikutnya ›', active: false });
    }

    const pilihanStatus = [
        { value: 'draf', label: 'Draf' },
        { value: 'terbit', label: 'Terbit' },
    ];

    return (
        <>
            <PageHeader
                judul="Berita"
                keterangan="Kabar, kegiatan, dan pengumuman sekolah."
                aksi={
                    <Link
                        href="/admin/berita/form"
                        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
                    >
                        Tulis Berita
                    </Link>
                }
            />

            <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
                <form className="flex flex-wrap items-end gap-3" method="GET">
                    <Input
                        type="search"
                        name="cari"
                        defaultValue={cari}
                        placeholder="Cari judul berita"
                        aria-label="Cari judul berita"
                        className="max-w-xs"
                    />

                    <Select name="status" defaultValue={status} aria-label="Saring status" className="max-w-40">
                        <option value="">Semua status</option>
                        {pilihanStatus.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </Select>

                    <Tombol variasi="garis">Terapkan</Tombol>
                </form>

                {data.length === 0 ? (
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
                                    {data.map((baris) => (
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
                                                <DeleteButton id={baris.id} judul={baris.judul} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {links.length > 0 && (
                            <nav className="flex flex-wrap gap-1" aria-label="Halaman berita">
                                {links.map((tautan, i) =>
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
                        )}
                    </>
                )}
            </div>
        </>
    );
}
