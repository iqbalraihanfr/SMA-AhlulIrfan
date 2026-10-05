'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/components/Ui';
import { saveAlbum } from '../actions';
import { useRouter } from 'next/navigation';
import { unggahGambar } from '@/lib/unggah-gambar';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type AlbumProp = {
    id?: number;
    judul: string;
    slug: string;
    deskripsi: string | null;
    urutan: number;
    image_url: string | null;
    foto_urls?: string[];
} | null;

export default function GaleriFormClient({ album }: { album: AlbumProp }) {
    const baru = !album?.id;

    const [judul, setJudul] = useState(album?.judul ?? '');
    const [slug, setSlug] = useState(album?.slug ?? '');
    const [deskripsi, setDeskripsi] = useState(album?.deskripsi ?? '');
    const [urutan, setUrutan] = useState(album?.urutan?.toString() ?? '0');
    const [foto, setFoto] = useState<File[]>([]);
    const [fotoUrls, setFotoUrls] = useState<string[]>(album?.foto_urls?.length ? album.foto_urls : album?.image_url ? [album.image_url] : []);
    const router = useRouter();

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesanOptimasi, setPesanOptimasi] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length + fotoUrls.length > 50) {
            setErrors({ foto: 'Maksimal 50 foto per album.' });
            e.target.value = '';
            setFoto([]);
            return;
        }
        if (files.some((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 20 * 1024 * 1024)) {
            setErrors({ foto: 'Pilih foto JPG, PNG, atau WebP, maksimal 20 MB per foto.' });
            e.target.value = '';
            setFoto([]);
            return;
        }
        setErrors({});
        setFoto(files);
    };

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const urls = [...fotoUrls];
            for (let i = 0; i < foto.length; i++) {
                setPesanOptimasi(`Mengunggah foto ${i + 1} dari ${foto.length}…`);
                urls.push(await unggahGambar(foto[i], 'galeri'));
                setFotoUrls([...urls]);
                setFoto(foto.slice(i + 1));
            }
            setPesanOptimasi('');

            const formData = new FormData();
            if (album?.id) formData.append('id', album.id.toString());
            formData.append('judul', judul);
            formData.append('slug', slug);
            formData.append('deskripsi', deskripsi);
            formData.append('urutan', urutan);
            urls.forEach((url) => formData.append('foto_urls', url));

            await saveAlbum(formData);
            router.push('/admin/galeri?disimpan=1');
            router.refresh();
        } catch (err) {
            setPesanOptimasi('');
            setErrors({ _general: err instanceof Error ? err.message : 'Gagal menyimpan album' });
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

            {errors._general && <div role="alert" className="mb-4 text-sm text-danger">{errors._general}</div>}

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
                    <h2 className="font-heading text-lg font-semibold text-ink">Foto kegiatan</h2>

                    {fotoUrls.length > 0 && (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {fotoUrls.map((url, index) => (
                                <li key={url} className="space-y-2">
                                    <img src={url} alt={`${judul || 'Album'} — foto ${index + 1}`} width={320} height={240} className="aspect-[4/3] w-full rounded-md border border-line object-cover" />
                                    <Tombol type="button" variasi="garis" disabled={processing} aria-label={`Lepas foto ${index + 1}`} onClick={() => setFotoUrls(fotoUrls.filter((fotoUrl) => fotoUrl !== url))}>Lepas foto</Tombol>
                                    {index === 0 && <p className="text-xs text-ink-muted">Sampul album</p>}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div>
                        <Label htmlFor="foto">Berkas foto</Label>
                        <input
                            id="foto"
                            type="file"
                            multiple
                            disabled={processing}
                            accept={TIPE_GAMBAR_DITERIMA}
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                        />
                        <Petunjuk>Pilih beberapa foto sekaligus. JPG, PNG, atau WebP, maksimal 20 MB per foto dan 50 foto per album. Foto pertama menjadi sampul.</Petunjuk>
                        {foto.length > 0 && <Petunjuk>{foto.length} foto baru dipilih.</Petunjuk>}
                        {pesanOptimasi && <p role="status" className="text-sm text-ink-muted">{pesanOptimasi}</p>}
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
