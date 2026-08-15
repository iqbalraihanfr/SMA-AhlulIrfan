import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Label, PageHeader, Petunjuk, Select, Textarea, Tombol } from '@/Components/Ui';
import EditorTeks from '@/Components/EditorTeks';

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
};

export default function Form({ berita, pilihanStatus, aksi }: Props) {
    const baru = berita === null;

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
        post(aksi, { forceFormData: true });
    };

    return (
        <>
            <Head title={baru ? 'Tulis Berita' : 'Ubah Berita'} />

            <PageHeader judul={baru ? 'Tulis Berita' : 'Ubah Berita'} />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.berita.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar berita
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6 rounded-lg border border-line bg-paper p-6 shadow-card">
                    <div>
                        <Label htmlFor="judul">Judul</Label>
                        <Input id="judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} required autoFocus />
                        <Galat pesan={errors.judul} />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (opsional)</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="dibuat otomatis dari judul"
                        />
                        <Petunjuk>Bagian alamat halaman berita. Kosongkan saja bila ragu — sistem membuatnya dari judul.</Petunjuk>
                        <Galat pesan={errors.slug} />
                    </div>

                    <div>
                        <Label htmlFor="ringkasan">Ringkasan (opsional)</Label>
                        <Textarea
                            id="ringkasan"
                            rows={2}
                            maxLength={300}
                            value={data.ringkasan}
                            onChange={(e) => setData('ringkasan', e.target.value)}
                        />
                        <Petunjuk>Tampil di kartu berita dan hasil pencarian. Maksimal 300 karakter.</Petunjuk>
                        <Galat pesan={errors.ringkasan} />
                    </div>

                    <div>
                        <Label htmlFor="isi">Isi Berita</Label>
                        <EditorTeks id="isi" nilai={data.isi} onUbah={(html) => setData('isi', html)} />
                        <Galat pesan={errors.isi} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
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
                            <Label htmlFor="diterbitkan_pada">Tanggal Terbit</Label>
                            <Input
                                id="diterbitkan_pada"
                                type="datetime-local"
                                value={data.diterbitkan_pada}
                                onChange={(e) => setData('diterbitkan_pada', e.target.value)}
                            />
                            <Petunjuk>Kosongkan untuk terbit sekarang. Tanggal di masa depan berarti berita baru muncul pada waktu itu.</Petunjuk>
                            <Galat pesan={errors.diterbitkan_pada} />
                        </div>
                    </div>

                    <fieldset className="space-y-3 border-t border-line pt-6">
                        <legend className="text-sm font-semibold text-ink">Gambar Sampul</legend>

                        {berita?.sampulUrl && (
                            <>
                                <img
                                    src={berita.sampulUrl}
                                    alt={berita.sampulAlt ?? ''}
                                    width={320}
                                    height={200}
                                    className="rounded-md border border-line object-cover"
                                />
                                <Petunjuk>Unggah berkas baru untuk mengganti gambar ini.</Petunjuk>
                            </>
                        )}

                        <div>
                            <Label htmlFor="sampul">Berkas gambar</Label>
                            <input
                                id="sampul"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('sampul', e.target.files?.[0] ?? null)}
                                className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                            />
                            <Petunjuk>Maksimal 5 MB. Ukuran ideal minimal 1600 piksel lebarnya.</Petunjuk>
                            <Galat pesan={errors.sampul} />
                        </div>

                        <div>
                            <Label htmlFor="sampul_alt">Teks alternatif gambar</Label>
                            <Input id="sampul_alt" value={data.sampul_alt} onChange={(e) => setData('sampul_alt', e.target.value)} />
                            <Petunjuk>
                                Jelaskan isi gambar dalam satu kalimat. Wajib diisi — inilah yang dibacakan pembaca layar dan yang
                                tampil bila gambar gagal dimuat.
                            </Petunjuk>
                            <Galat pesan={errors.sampul_alt} />
                        </div>
                    </fieldset>

                    <div className="flex items-center gap-3 border-t border-line pt-6">
                        <Tombol disabled={processing}>{baru ? 'Simpan Berita' : 'Simpan Perubahan'}</Tombol>
                        <Link href={route('admin.berita.index')} className="text-sm text-ink-muted underline underline-offset-4">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
