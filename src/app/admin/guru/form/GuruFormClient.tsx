'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveGuru } from '../actions';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type GuruProp = {
    id?: number;
    nama: string;
    kategori: string;
    jenis_kelamin: string | null;
    jabatan: string | null;
    mata_pelajaran: string | null;
    urutan: number;
    aktif: boolean;
    image_url: string | null;
} | null;

export default function GuruFormClient({
    guru,
    pilihanKategori,
}: {
    guru: GuruProp;
    pilihanKategori: { value: string; label: string }[];
}) {
    const baru = !guru?.id;

    const [nama, setNama] = useState(guru?.nama ?? '');
    const [kategori, setKategori] = useState(guru?.kategori ?? 'pendidik');
    const [jenisKelamin, setJenisKelamin] = useState(guru?.jenis_kelamin ?? '');
    const [jabatan, setJabatan] = useState(guru?.jabatan ?? '');
    const [mataPelajaran, setMataPelajaran] = useState(guru?.mata_pelajaran ?? '');
    const [urutan, setUrutan] = useState(guru?.urutan?.toString() ?? '0');
    const [aktif, setAktif] = useState(guru?.aktif ?? true);
    const [foto, setFoto] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(guru?.image_url ?? '');

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
            const path = `guru/${Date.now()}-${safeName}`;
            const { data, error } = await supabase.storage.from('images').upload(path, compressed);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto maksimal 5 MB.');
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
            if (guru?.id) formData.append('id', guru.id.toString());
            formData.append('nama', nama);
            formData.append('kategori', kategori);
            formData.append('jenis_kelamin', jenisKelamin);
            formData.append('jabatan', jabatan);
            formData.append('mata_pelajaran', mataPelajaran);
            formData.append('urutan', urutan);
            formData.append('aktif', aktif ? 'true' : 'false');
            if (finalImageUrl) formData.append('image_url', finalImageUrl);

            await saveGuru(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan data guru' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Orang' : 'Ubah Data'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/guru" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="nama">Nama lengkap dengan gelar</Label>
                        <Input
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            autoFocus
                        />
                        <Petunjuk>
                            Tulis seperti yang dipakai sekolah, mis. &ldquo;Hilmi Fathiyatul Baroroh, S.Pd., Gr&rdquo;.
                        </Petunjuk>
                        <Galat pesan={errors.nama} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="kategori">Kategori</Label>
                            <Select
                                id="kategori"
                                value={kategori}
                                onChange={(e) => setKategori(e.target.value)}
                            >
                                {pilihanKategori.map((k) => (
                                    <option key={k.value} value={k.value}>
                                        {k.label}
                                    </option>
                                ))}
                            </Select>
                            <Petunjuk>Menentukan di kelompok mana ia tampil di halaman Guru.</Petunjuk>
                            <Galat pesan={errors.kategori} />
                        </div>

                        <div>
                            <Label htmlFor="jenis_kelamin">Jenis kelamin</Label>
                            <Select
                                id="jenis_kelamin"
                                value={jenisKelamin}
                                onChange={(e) => setJenisKelamin(e.target.value)}
                            >
                                <option value="">Tidak diisi</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </Select>
                            <Galat pesan={errors.jenis_kelamin} />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="jabatan">Jabatan struktural</Label>
                            <Input
                                id="jabatan"
                                value={jabatan}
                                onChange={(e) => setJabatan(e.target.value)}
                                placeholder="mis. Waka Kurikulum"
                            />
                            <Petunjuk>Kosongkan untuk guru mata pelajaran tanpa jabatan tambahan.</Petunjuk>
                            <Galat pesan={errors.jabatan} />
                        </div>

                        <div>
                            <Label htmlFor="mata_pelajaran">Mata pelajaran</Label>
                            <Input
                                id="mata_pelajaran"
                                value={mataPelajaran}
                                onChange={(e) => setMataPelajaran(e.target.value)}
                                placeholder="mis. Fisika"
                            />
                            <Galat pesan={errors.mata_pelajaran} />
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="urutan">Urutan tampil</Label>
                            <Input
                                id="urutan"
                                type="number"
                                min={0}
                                max={999}
                                value={urutan}
                                onChange={(e) => setUrutan(e.target.value)}
                            />
                            <Petunjuk>Angka lebih kecil tampil lebih dulu.</Petunjuk>
                            <Galat pesan={errors.urutan} />
                        </div>

                        <label className="flex items-start gap-3 pt-7">
                            <input
                                type="checkbox"
                                checked={aktif}
                                onChange={(e) => setAktif(e.target.checked)}
                                className="mt-0.5 rounded border-line text-brand shadow-card focus:ring-brand"
                            />
                            <span>
                                <span className="text-sm font-medium text-ink">Masih aktif</span>
                                <span className="block text-sm text-ink-muted">
                                    Yang nonaktif disembunyikan dari situs, bukan dihapus.
                                </span>
                            </span>
                        </label>
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Foto</h2>

                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt=""
                            width={96}
                            height={96}
                            className="size-24 rounded-full border border-line object-cover"
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
                        <Petunjuk>Opsional. Tanpa foto, situs menampilkan inisial — bukan gambar rusak.</Petunjuk>
                        {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                        <Galat pesan={errors.foto} />
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : baru ? 'Simpan' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/guru" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
