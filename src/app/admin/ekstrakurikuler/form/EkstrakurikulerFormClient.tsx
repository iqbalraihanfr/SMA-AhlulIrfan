'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/components/Ui';
import { saveEkstrakurikuler } from '../actions';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type EkskulProp = {
    id?: number;
    nama: string;
    slug: string;
    deskripsi: string | null;
    pembina: string | null;
    jadwal: string | null;
    urutan: number;
    image_url: string | null;
} | null;

export default function EkstrakurikulerFormClient({ ekskul }: { ekskul: EkskulProp }) {
    const baru = !ekskul?.id;

    const [nama, setNama] = useState(ekskul?.nama ?? '');
    const [slug, setSlug] = useState(ekskul?.slug ?? '');
    const [deskripsi, setDeskripsi] = useState(ekskul?.deskripsi ?? '');
    const [pembina, setPembina] = useState(ekskul?.pembina ?? '');
    const [jadwal, setJadwal] = useState(ekskul?.jadwal ?? '');
    const [urutan, setUrutan] = useState(ekskul?.urutan?.toString() ?? '0');
    const [gambar, setGambar] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(ekskul?.image_url ?? '');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesanOptimasi, setPesanOptimasi] = useState('');

    const supabase = createClient();

    const unggahGambar = async (file: File) => {
        const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };
        try {
            const compressed = await imageCompression(file, options);
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `ekskul/${Date.now()}-${safeName}`;
            const { data, error } = await supabase.storage.from('images').upload(path, compressed);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 5 MB.');
            return;
        }
        setGambar(file);
    };

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            let finalImageUrl = imageUrl;
            if (gambar) {
                setPesanOptimasi('Mengoptimalkan & mengunggah gambar...');
                finalImageUrl = await unggahGambar(gambar);
                setPesanOptimasi('');
            }

            const formData = new FormData();
            if (ekskul?.id) formData.append('id', ekskul.id.toString());
            formData.append('nama', nama);
            formData.append('slug', slug);
            formData.append('deskripsi', deskripsi);
            formData.append('pembina', pembina);
            formData.append('jadwal', jadwal);
            formData.append('urutan', urutan);
            if (finalImageUrl) formData.append('image_url', finalImageUrl);

            await saveEkstrakurikuler(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan ekstrakurikuler' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Ekstrakurikuler' : 'Ubah Ekstrakurikuler'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/ekstrakurikuler" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            autoFocus
                        />
                        <Galat pesan={errors.nama} />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (opsional)</Label>
                        <Input
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="Dibuat otomatis bila dikosongkan"
                        />
                        <Galat pesan={errors.slug} />
                    </div>

                    <div>
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            id="deskripsi"
                            rows={3}
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                        />
                        <Galat pesan={errors.deskripsi} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="pembina">Pembina</Label>
                            <Input
                                id="pembina"
                                value={pembina}
                                onChange={(e) => setPembina(e.target.value)}
                            />
                            <Petunjuk>Kosongkan bila belum ada. Disembunyikan di situs selama kosong.</Petunjuk>
                            <Galat pesan={errors.pembina} />
                        </div>

                        <div>
                            <Label htmlFor="jadwal">Jadwal</Label>
                            <Input
                                id="jadwal"
                                value={jadwal}
                                onChange={(e) => setJadwal(e.target.value)}
                                placeholder="mis. Jumat, 14.00"
                            />
                            <Galat pesan={errors.jadwal} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="urutan">Urutan tampil</Label>
                        <Input
                            id="urutan"
                            type="number"
                            min={0}
                            max={999}
                            value={urutan}
                            onChange={(e) => setUrutan(e.target.value)}
                            className="max-w-32"
                        />
                        <Galat pesan={errors.urutan} />
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Gambar kegiatan</h2>

                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt=""
                            width={320}
                            height={200}
                            className="rounded-md border border-line object-cover"
                        />
                    )}

                    <div>
                        <Label htmlFor="gambar">Berkas gambar</Label>
                        <input
                            id="gambar"
                            type="file"
                            accept={TIPE_GAMBAR_DITERIMA}
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                        />
                        {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                        <Galat pesan={errors.gambar} />
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : baru ? 'Simpan' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/ekstrakurikuler" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
