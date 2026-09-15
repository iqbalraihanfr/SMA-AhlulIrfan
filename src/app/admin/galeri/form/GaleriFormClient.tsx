'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/components/Ui';
import { saveAlbum } from '../actions';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type AlbumProp = {
    id?: number;
    judul: string;
    slug: string;
    deskripsi: string | null;
    urutan: number;
    image_url: string | null;
} | null;

export default function GaleriFormClient({ album }: { album: AlbumProp }) {
    const baru = !album?.id;

    const [judul, setJudul] = useState(album?.judul ?? '');
    const [slug, setSlug] = useState(album?.slug ?? '');
    const [deskripsi, setDeskripsi] = useState(album?.deskripsi ?? '');
    const [urutan, setUrutan] = useState(album?.urutan?.toString() ?? '0');
    const [foto, setFoto] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(album?.image_url ?? '');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesanOptimasi, setPesanOptimasi] = useState('');

    const supabase = createClient();

    const unggahGambar = async (file: File) => {
        const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
        };
        try {
            const compressed = await imageCompression(file, options);
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `galeri/${Date.now()}-${safeName}`;
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

        if (file.size > 8 * 1024 * 1024) {
            alert('Ukuran foto maksimal 8 MB.');
            return;
        }
        setFoto(file);
    };

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            let finalImageUrl = imageUrl;
            if (foto) {
                setPesanOptimasi('Mengoptimalkan & mengunggah foto...');
                finalImageUrl = await unggahGambar(foto);
                setPesanOptimasi('');
            }

            const formData = new FormData();
            if (album?.id) formData.append('id', album.id.toString());
            formData.append('judul', judul);
            formData.append('slug', slug);
            formData.append('deskripsi', deskripsi);
            formData.append('urutan', urutan);
            if (finalImageUrl) formData.append('image_url', finalImageUrl);

            await saveAlbum(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan album' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Album Baru' : 'Ubah Album'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/galeri" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar album
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="judul">Judul album</Label>
                        <Input
                            id="judul"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            required
                            autoFocus
                        />
                        <Galat pesan={errors.judul} />
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
                        <Petunjuk>Angka lebih kecil tampil lebih dulu.</Petunjuk>
                        <Galat pesan={errors.urutan} />
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Foto Sampul / Kegiatan</h2>

                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt=""
                            width={320}
                            height={240}
                            className="aspect-[4/3] w-full max-w-sm rounded-md border border-line object-cover"
                        />
                    )}

                    <div>
                        <Label htmlFor="foto">Berkas foto</Label>
                        <input
                            id="foto"
                            type="file"
                            accept={TIPE_GAMBAR_DITERIMA}
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                        />
                        <Petunjuk>Foto utama untuk album ini. Maksimal 8 MB.</Petunjuk>
                        {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                        <Galat pesan={errors.foto} />
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : baru ? 'Buat Album' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/galeri" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
