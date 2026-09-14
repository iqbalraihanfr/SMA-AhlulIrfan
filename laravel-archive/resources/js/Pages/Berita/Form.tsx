import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Textarea, Tombol } from '@/Components/Ui';
import EditorTeks from '@/Components/EditorTeks';
import PemilihJadwal from '@/Components/PemilihJadwal';
import type { MediaGambarBerita } from '@/Components/GambarBerita';
import { useOptimasiGambar } from '@/hooks/useOptimasiGambar';
import { optimalkanGambar, TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type BeritaProp = {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    isi: string;
    status: string;
    diterbitkanPada: string | null;
    sampulUrl: string | null;
    sampulAlt: string | null;
} | null;

type Props = {
    berita: BeritaProp;
    pilihanStatus: { value: string; label: string }[];
    aksi: string;
    unggahGambarUrl: string | null;
};

export default function Form({ berita, pilihanStatus, aksi, unggahGambarUrl }: Props) {
    const baru = berita === null;
    const { pilihGambar, sedangMenyiapkan, pesanOptimasi, melewatiBatas } = useOptimasiGambar(5 * 1024 * 1024);
    const [sedangMengunggahIsi, setSedangMengunggahIsi] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // Inertia mengirim berkas lewat multipart, dan multipart tidak mengenal
        // metode PUT. Method spoofing Laravel yang menanganinya.
        _method: baru ? 'post' : 'put',
        judul: berita?.judul ?? '',
        slug: berita?.slug ?? '',
        ringkasan: berita?.ringkasan ?? '',
        isi: berita?.isi ?? '',
        status: berita?.status ?? 'draft',
        diterbitkan_pada: berita?.diterbitkanPada ?? '',
        sampul: null as File | null,
        sampul_alt: berita?.sampulAlt ?? '',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (sedangMenyiapkan || sedangMengunggahIsi || melewatiBatas) return;

        post(aksi, { forceFormData: true });
    };

    const unggahGambar = async (gambar: File, alt: string): Promise<MediaGambarBerita> => {
        if (!unggahGambarUrl) throw new Error('Simpan berita terlebih dahulu sebelum menambahkan gambar.');

        const token = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
        if (!token) throw new Error('Sesi keamanan tidak ditemukan. Muat ulang halaman lalu coba lagi.');

        const gambarSiap = await optimalkanGambar(gambar);
        if (gambarSiap.ukuranAkhir > 5 * 1024 * 1024) {
            throw new Error('Ukuran gambar masih melebihi batas 5 MB. Pilih gambar lain.');
        }

        const formulir = new FormData();
        formulir.append('gambar', gambarSiap.berkas);
        formulir.append('alt', alt);

        const respons = await fetch(unggahGambarUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': token,
            },
            body: formulir,
        });
        const hasil = (await respons.json()) as { media?: MediaGambarBerita; errors?: Record<string, string[]>; message?: string };

        if (!respons.ok || !hasil.media) {
            const pesanValidasi = hasil.errors ? Object.values(hasil.errors).flat()[0] : null;
            throw new Error(pesanValidasi ?? hasil.message ?? 'Gambar gagal diunggah. Coba lagi.');
        }

        return hasil.media;
    };

    const sibukGambar = sedangMenyiapkan || sedangMengunggahIsi;
    let labelSimpan = baru ? 'Simpan Berita' : 'Simpan Perubahan';

    if (processing) labelSimpan = 'Menyimpan…';
    if (sibukGambar) labelSimpan = 'Menyiapkan gambar…';

    return (
        <>
            <Head title={baru ? 'Tulis Berita' : 'Ubah Berita'} />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <PageHeader
                    judul={baru ? 'Tulis Berita' : 'Ubah Berita'}
                    keterangan="Susun isi di area utama, lalu atur publikasi dan gambar sampul di panel sebelah kanan."
                />

                <p className="mb-5 text-sm">
                    <Link href={route('admin.berita.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar berita
                    </Link>
                </p>

                <form onSubmit={kirim} className="grid items-start gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Kartu className="space-y-5">
                            <div>
                                <h2 className="font-heading text-lg font-semibold text-ink">Konten utama</h2>
                                <p className="mt-1 text-sm text-ink-muted">Judul dan ringkasan membantu pembaca memahami berita sebelum membukanya.</p>
                            </div>

                            <div>
                                <Label htmlFor="judul">Judul</Label>
                                <Input
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    required
                                    autoFocus
                                    className="text-base font-semibold"
                                />
                                <Galat pesan={errors.judul} />
                            </div>

                            <div>
                                <Label htmlFor="ringkasan">Ringkasan (opsional)</Label>
                                <Textarea
                                    id="ringkasan"
                                    rows={3}
                                    maxLength={300}
                                    value={data.ringkasan}
                                    onChange={(e) => setData('ringkasan', e.target.value)}
                                />
                                <Petunjuk>Tampil di kartu berita dan hasil pencarian. Maksimal 300 karakter.</Petunjuk>
                                <Galat pesan={errors.ringkasan} />
                            </div>
                        </Kartu>

                        <Kartu>
                            <div className="mb-4">
                                <h2 className="font-heading text-lg font-semibold text-ink">Isi berita</h2>
                                <p className="mt-1 text-sm text-ink-muted">Gunakan subjudul dan daftar agar artikel panjang tetap mudah dipindai.</p>
                            </div>
                            <Label htmlFor="isi" className="sr-only">Isi Berita</Label>
                            <EditorTeks
                                id="isi"
                                nilai={data.isi}
                                onUbah={(html) => setData('isi', html)}
                                onUnggahGambar={unggahGambarUrl ? unggahGambar : undefined}
                                onStatusUnggahBerubah={setSedangMengunggahIsi}
                            />
                            <Galat pesan={errors.isi} />
                        </Kartu>
                    </div>

                    <aside className="space-y-6 lg:sticky lg:top-6" aria-label="Metadata dan publikasi berita">
                        <Kartu className="space-y-5">
                            <h2 className="font-heading text-lg font-semibold text-ink">Publikasi</h2>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    {pilihanStatus.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </Select>
                                <Galat pesan={errors.status} />
                            </div>

                            <div>
                                <Label htmlFor="diterbitkan_pada_tanggal">Tanggal terbit</Label>
                                <PemilihJadwal
                                    id="diterbitkan_pada"
                                    nilai={data.diterbitkan_pada}
                                    onUbah={(nilai) => setData('diterbitkan_pada', nilai)}
                                />
                                <Galat pesan={errors.diterbitkan_pada} />
                            </div>

                            <div className="border-t border-line pt-5">
                                <Tombol
                                    disabled={processing || sibukGambar || melewatiBatas}
                                    className="w-full justify-center"
                                >
                                    {labelSimpan}
                                </Tombol>
                                <Link
                                    href={route('admin.berita.index')}
                                    className="mt-3 block text-center text-sm text-ink-muted underline underline-offset-4"
                                >
                                    Batal
                                </Link>
                            </div>
                        </Kartu>

                        <Kartu className="space-y-4">
                            <h2 className="font-heading text-lg font-semibold text-ink">Gambar sampul</h2>

                            {berita?.sampulUrl && (
                                <div>
                                    <img
                                        src={berita.sampulUrl}
                                        alt={berita.sampulAlt ?? ''}
                                        width={320}
                                        height={200}
                                        className="aspect-video w-full rounded-md border border-line object-cover"
                                    />
                                    <Petunjuk>Unggah berkas baru untuk mengganti gambar ini.</Petunjuk>
                                </div>
                            )}

                            <div>
                                <Label htmlFor="sampul">Berkas gambar</Label>
                                <input
                                    id="sampul"
                                    type="file"
                                    accept={TIPE_GAMBAR_DITERIMA}
                                    onChange={(e) => void pilihGambar(e.target.files?.[0] ?? null, (sampul) => setData('sampul', sampul))}
                                    className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
                                />
                                <Petunjuk>Maksimal 5 MB. Idealnya minimal 1600 piksel.</Petunjuk>
                                {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                                <Galat pesan={errors.sampul} />
                            </div>

                            <div>
                                <Label htmlFor="sampul_alt">Teks alternatif</Label>
                                <Input
                                    id="sampul_alt"
                                    value={data.sampul_alt}
                                    onChange={(e) => setData('sampul_alt', e.target.value)}
                                />
                                <Petunjuk>Jelaskan isi gambar dalam satu kalimat untuk pembaca layar.</Petunjuk>
                                <Galat pesan={errors.sampul_alt} />
                            </div>
                        </Kartu>

                        <Kartu>
                            <h2 className="font-heading text-lg font-semibold text-ink">Alamat berita</h2>
                            <div className="mt-4">
                                <Label htmlFor="slug">Slug (opsional)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="dibuat-otomatis-dari-judul"
                                />
                                <Petunjuk>Kosongkan bila ragu; sistem membuatnya dari judul.</Petunjuk>
                                <Galat pesan={errors.slug} />
                            </div>
                        </Kartu>
                    </aside>
                </form>
            </div>
        </>
    );
}
