'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Textarea, Tombol } from '@/components/Ui';
import EditorTeks from '@/components/EditorTeks';
import PemilihJadwal from '@/components/PemilihJadwal';
import { saveBerita } from '../actions';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';

type BeritaProp = {
    id?: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    isi: string;
    status: string;
    diterbitkanPada: string | null;
    sampulUrl: string | null;
    sampulAlt: string | null;
} | null;

export default function BeritaFormClient({
    berita,
    pilihanStatus,
}: {
    berita: BeritaProp;
    pilihanStatus: { value: string; label: string }[];
}) {
    const baru = !berita?.id;
    const [judul, setJudul] = useState(berita?.judul ?? '');
    const [slug, setSlug] = useState(berita?.slug ?? '');
    const [ringkasan, setRingkasan] = useState(berita?.ringkasan ?? '');
    const [isi, setIsi] = useState(berita?.isi ?? '');
    const [status, setStatus] = useState(berita?.status ?? 'draf');
    const [diterbitkanPada, setDiterbitkanPada] = useState(berita?.diterbitkanPada ?? '');
    const [sampulAlt, setSampulAlt] = useState(berita?.sampulAlt ?? '');
    const [sampul, setSampul] = useState<File | null>(null);
    const [sampulUrl] = useState(berita?.sampulUrl ?? '');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesanOptimasi, setPesanOptimasi] = useState('');

    const supabase = createClient();

    const unggahGambar = async (file: File, path: string) => {
        const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(file, options);
            const fileName = `${Date.now()}-${compressedFile.name}`;
            const { data, error } = await supabase.storage.from('images').upload(`${path}/${fileName}`, compressedFile);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleUnggahGambarKonten = async (gambar: File, alt: string) => {
        const url = await unggahGambar(gambar, 'konten');
        // The editor expects a certain structure, let's mock it
        return {
            id: 0,
            url,
            alt,
            width: null,
            height: null,
        };
    };

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            let finalImageUrl = sampulUrl;
            if (sampul) {
                setPesanOptimasi('Mengoptimalkan & mengunggah sampul...');
                finalImageUrl = await unggahGambar(sampul, 'sampul');
                setPesanOptimasi('');
            }

            const formData = new FormData();
            if (berita?.id) formData.append('id', berita.id.toString());
            formData.append('judul', judul);
            formData.append('slug', slug);
            formData.append('ringkasan', ringkasan);
            formData.append('isi', isi);
            formData.append('status', status);
            formData.append('diterbitkan_pada', diterbitkanPada);
            if (finalImageUrl) formData.append('image_url', finalImageUrl);
            formData.append('sampul_alt', sampulAlt);

            await saveBerita(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan berita' });
            setProcessing(false);
        }
    };

    let labelSimpan = baru ? 'Simpan Berita' : 'Simpan Perubahan';
    if (processing) labelSimpan = 'Menyimpan...';

    return (
        <div className="mx-auto max-w-7xl">
            <PageHeader
                judul={baru ? 'Tulis Berita' : 'Ubah Berita'}
                keterangan="Susun isi di area utama, lalu atur publikasi dan gambar sampul di panel sebelah kanan."
            />

            <p className="mb-5 text-sm">
                <Link href="/admin/berita" className="inline-flex min-h-[44px] items-center text-ink-muted underline underline-offset-4">
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
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
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
                                value={ringkasan}
                                onChange={(e) => setRingkasan(e.target.value)}
                            />
                            <Petunjuk>Tampil di kartu berita dan hasil pencarian. Maksimal 300 karakter.</Petunjuk>
                            <Galat pesan={errors.ringkasan} />
                        </div>
                    </Kartu>

                    <Kartu>
                        <div className="mb-4">
                            <h2 className="font-heading text-lg font-semibold text-ink">Isi berita</h2>
                        </div>
                        <Label htmlFor="isi" className="sr-only">Isi Berita</Label>
                        <EditorTeks
                            id="isi"
                            nilai={isi}
                            onUbah={setIsi}
                            onUnggahGambar={handleUnggahGambarKonten}
                        />
                        <Galat pesan={errors.isi} />
                    </Kartu>
                </div>

                <aside className="space-y-6 lg:sticky lg:top-6">
                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Publikasi</h2>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                                {pilihanStatus.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="diterbitkan_pada">Tanggal terbit</Label>
                            <PemilihJadwal
                                id="diterbitkan_pada"
                                nilai={diterbitkanPada}
                                onUbah={setDiterbitkanPada}
                            />
                        </div>

                        <div className="border-t border-line pt-5">
                            {errors._general && <Galat pesan={errors._general} />}
                            <Tombol disabled={processing} className="w-full justify-center mt-2 min-h-[44px]">
                                {labelSimpan}
                            </Tombol>
                        </div>
                    </Kartu>

                    <Kartu className="space-y-4">
                        <h2 className="font-heading text-lg font-semibold text-ink">Gambar sampul</h2>
                        
                        {sampulUrl && !sampul && (
                            <div>
                                <img src={sampulUrl} alt={sampulAlt} className="aspect-video w-full rounded-md border border-line object-cover" />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="sampul">Berkas gambar</Label>
                            <input
                                id="sampul"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSampul(e.target.files?.[0] ?? null)}
                                className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
                            />
                            {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                        </div>

                        <div>
                            <Label htmlFor="sampul_alt">Teks alternatif</Label>
                            <Input
                                id="sampul_alt"
                                value={sampulAlt}
                                onChange={(e) => setSampulAlt(e.target.value)}
                            />
                        </div>
                    </Kartu>

                    <Kartu>
                        <h2 className="font-heading text-lg font-semibold text-ink">Alamat berita</h2>
                        <div className="mt-4">
                            <Label htmlFor="slug">Slug (opsional)</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="dibuat-otomatis-dari-judul"
                            />
                        </div>
                    </Kartu>
                </aside>
            </form>
        </div>
    );
}
