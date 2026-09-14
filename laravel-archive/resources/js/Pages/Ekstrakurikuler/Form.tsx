import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/Components/Ui';
import { useOptimasiGambar } from '@/hooks/useOptimasiGambar';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type EkskulProp = {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    pembina: string | null;
    jadwal: string | null;
    urutan: number;
    gambarUrl: string | null;
    gambarAlt: string | null;
} | null;

export default function Form({ ekskul, aksi }: { ekskul: EkskulProp; aksi: string }) {
    const baru = ekskul === null;
    const { pilihGambar, sedangMenyiapkan, pesanOptimasi, melewatiBatas } = useOptimasiGambar(5 * 1024 * 1024);

    const { data, setData, post, processing, errors } = useForm({
        _method: baru ? 'post' : 'put',
        nama: ekskul?.nama ?? '',
        slug: ekskul?.slug ?? '',
        deskripsi: ekskul?.deskripsi ?? '',
        pembina: ekskul?.pembina ?? '',
        jadwal: ekskul?.jadwal ?? '',
        urutan: ekskul?.urutan?.toString() ?? '0',
        gambar: null as File | null,
        gambar_alt: ekskul?.gambarAlt ?? '',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (sedangMenyiapkan || melewatiBatas) return;

        post(aksi, { forceFormData: true });
    };

    return (
        <>
            <Head title={baru ? 'Tambah Ekstrakurikuler' : ekskul!.nama} />

            <PageHeader judul={baru ? 'Tambah Ekstrakurikuler' : 'Ubah Ekstrakurikuler'} />

            <div className="max-w-2xl">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.ekstrakurikuler.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="nama">Nama</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required autoFocus />
                            <Galat pesan={errors.nama} />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" rows={3} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                            <Galat pesan={errors.deskripsi} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="pembina">Pembina</Label>
                                <Input id="pembina" value={data.pembina} onChange={(e) => setData('pembina', e.target.value)} />
                                <Petunjuk>Kosongkan bila belum ada. Bagian ini disembunyikan di situs selama kosong.</Petunjuk>
                                <Galat pesan={errors.pembina} />
                            </div>

                            <div>
                                <Label htmlFor="jadwal">Jadwal</Label>
                                <Input id="jadwal" value={data.jadwal} onChange={(e) => setData('jadwal', e.target.value)} placeholder="mis. Jumat, 14.00" />
                                <Galat pesan={errors.jadwal} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="urutan">Urutan tampil</Label>
                            <Input id="urutan" type="number" min={0} max={999} value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} className="max-w-32" />
                            <Galat pesan={errors.urutan} />
                        </div>
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Gambar kegiatan</h2>

                        {ekskul?.gambarUrl && (
                            <img src={ekskul.gambarUrl} alt={ekskul.gambarAlt ?? ''} width={320} height={200} className="rounded-md border border-line object-cover" />
                        )}

                        <div>
                            <Label htmlFor="gambar">Berkas gambar</Label>
                            <input
                                id="gambar"
                                type="file"
                                accept={TIPE_GAMBAR_DITERIMA}
                                onChange={(e) => void pilihGambar(e.target.files?.[0] ?? null, (gambar) => setData('gambar', gambar))}
                                className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                            />
                            {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                            <Galat pesan={errors.gambar} />
                        </div>

                        <div>
                            <Label htmlFor="gambar_alt">Teks alternatif gambar</Label>
                            <Input id="gambar_alt" value={data.gambar_alt} onChange={(e) => setData('gambar_alt', e.target.value)} />
                            <Galat pesan={errors.gambar_alt} />
                        </div>
                    </Kartu>

                    <div className="flex items-center gap-3">
                        <Tombol disabled={processing || sedangMenyiapkan || melewatiBatas}>
                            {sedangMenyiapkan ? 'Menyiapkan gambar…' : baru ? 'Simpan' : 'Simpan Perubahan'}
                        </Tombol>
                        <Link href={route('admin.ekstrakurikuler.index')} className="text-sm text-ink-muted underline underline-offset-4">Batal</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
