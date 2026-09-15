'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/components/Ui';
import { savePengaturan } from './actions';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import { TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type Pengaturan = {
    nama_sekolah: string;
    nama_yayasan: string | null;
    semboyan: string | null;
    alamat: string | null;
    telepon: string | null;
    whatsapp: string | null;
    email: string | null;
    peta_lat: number | null;
    peta_lng: number | null;
    npsn: string | null;
    akreditasi: string | null;
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    logo_url: string | null;
};

export default function PengaturanFormClient({ pengaturan }: { pengaturan: Pengaturan }) {
    const [namaSekolah, setNamaSekolah] = useState(pengaturan.nama_sekolah ?? '');
    const [namaYayasan, setNamaYayasan] = useState(pengaturan.nama_yayasan ?? '');
    const [semboyan, setSemboyan] = useState(pengaturan.semboyan ?? '');
    const [alamat, setAlamat] = useState(pengaturan.alamat ?? '');
    const [telepon, setTelepon] = useState(pengaturan.telepon ?? '');
    const [whatsapp, setWhatsapp] = useState(pengaturan.whatsapp ?? '');
    const [email, setEmail] = useState(pengaturan.email ?? '');
    const [petaLat, setPetaLat] = useState(pengaturan.peta_lat?.toString() ?? '');
    const [petaLng, setPetaLng] = useState(pengaturan.peta_lng?.toString() ?? '');
    const [npsn, setNpsn] = useState(pengaturan.npsn ?? '');
    const [akreditasi, setAkreditasi] = useState(pengaturan.akreditasi ?? '');
    const [instagram, setInstagram] = useState(pengaturan.instagram ?? '');
    const [facebook, setFacebook] = useState(pengaturan.facebook ?? '');
    const [youtube, setYoutube] = useState(pengaturan.youtube ?? '');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl] = useState(pengaturan.logo_url ?? '');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pesanOptimasi, setPesanOptimasi] = useState('');

    const supabase = createClient();

    const wajibRilis = {
        alamat: Boolean(alamat.trim()),
        telepon: Boolean(telepon.trim()),
        whatsapp: Boolean(whatsapp.trim()),
    };

    const kurang = Object.entries(wajibRilis)
        .filter(([, ada]) => !ada)
        .map(([nama]) => nama);

    const unggahGambar = async (file: File) => {
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 800,
            useWebWorker: true,
        };
        try {
            const compressed = await imageCompression(file, options);
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const path = `logo/${Date.now()}-${safeName}`;
            const { data, error } = await supabase.storage.from('images').upload(path, compressed);
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            return publicUrl;
        } catch (error) {
            console.error('Error uploading logo:', error);
            throw error;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran logo maksimal 2 MB.');
            return;
        }
        setLogo(file);
    };

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            let finalLogoUrl = logoUrl;
            if (logo) {
                setPesanOptimasi('Mengoptimalkan & mengunggah logo...');
                finalLogoUrl = await unggahGambar(logo);
                setPesanOptimasi('');
            }

            const formData = new FormData();
            formData.append('nama_sekolah', namaSekolah);
            formData.append('nama_yayasan', namaYayasan);
            formData.append('semboyan', semboyan);
            formData.append('npsn', npsn);
            formData.append('akreditasi', akreditasi);
            formData.append('alamat', alamat);
            formData.append('telepon', telepon);
            formData.append('whatsapp', whatsapp);
            formData.append('email', email);
            formData.append('peta_lat', petaLat);
            formData.append('peta_lng', petaLng);
            formData.append('instagram', instagram);
            formData.append('facebook', facebook);
            formData.append('youtube', youtube);
            if (finalLogoUrl) formData.append('logo_url', finalLogoUrl);

            await savePengaturan(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan pengaturan' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <PageHeader judul="Pengaturan Situs" keterangan="Identitas, kontak, dan tautan resmi sekolah." />

            {kurang.length > 0 && (
                <div role="alert" className="flex gap-3 rounded-lg border border-line bg-paper p-4 shadow-card">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <div>
                        <p className="text-sm font-semibold text-ink">Perlu dilengkapi</p>
                        <p className="mt-1 text-sm text-ink-muted">
                            {kurang.join(', ')} masih kosong. Halaman Kontak membutuhkan informasi ini agar pengunjung dapat menghubungi sekolah.
                        </p>
                    </div>
                </div>
            )}

            {errors._general && <div className="text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Identitas Sekolah</h2>

                    <div>
                        <Label htmlFor="nama_sekolah">Nama sekolah</Label>
                        <Input
                            id="nama_sekolah"
                            value={namaSekolah}
                            onChange={(e) => setNamaSekolah(e.target.value)}
                            required
                        />
                        <Galat pesan={errors.nama_sekolah} />
                    </div>

                    <div>
                        <Label htmlFor="nama_yayasan">Nama yayasan</Label>
                        <Input
                            id="nama_yayasan"
                            value={namaYayasan}
                            onChange={(e) => setNamaYayasan(e.target.value)}
                        />
                        <Galat pesan={errors.nama_yayasan} />
                    </div>

                    <div>
                        <Label htmlFor="semboyan">Semboyan</Label>
                        <Input
                            id="semboyan"
                            value={semboyan}
                            onChange={(e) => setSemboyan(e.target.value)}
                        />
                        <Petunjuk>Tampil di hero beranda dan footer.</Petunjuk>
                        <Galat pesan={errors.semboyan} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="npsn">NPSN</Label>
                            <Input
                                id="npsn"
                                value={npsn}
                                onChange={(e) => setNpsn(e.target.value)}
                            />
                            <Galat pesan={errors.npsn} />
                        </div>
                        <div>
                            <Label htmlFor="akreditasi">Akreditasi</Label>
                            <Input
                                id="akreditasi"
                                value={akreditasi}
                                onChange={(e) => setAkreditasi(e.target.value)}
                                placeholder="mis. B (2023)"
                            />
                            <Galat pesan={errors.akreditasi} />
                        </div>
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Kontak</h2>
                    <p className="-mt-3 text-sm text-ink-muted">Alamat, telepon, dan WhatsApp diperlukan untuk halaman Kontak.</p>

                    <div>
                        <Label htmlFor="alamat">Alamat lengkap</Label>
                        <Textarea
                            id="alamat"
                            rows={2}
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                        />
                        <Petunjuk>Tulis nama jalan, dusun/desa, kecamatan, kabupaten, dan kode pos.</Petunjuk>
                        <Galat pesan={errors.alamat} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="telepon">Telepon</Label>
                            <Input
                                id="telepon"
                                value={telepon}
                                onChange={(e) => setTelepon(e.target.value)}
                            />
                            <Galat pesan={errors.telepon} />
                        </div>
                        <div>
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input
                                id="whatsapp"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="08xxxxxxxxxx"
                            />
                            <Petunjuk>Boleh diawali 0 atau 62.</Petunjuk>
                            <Galat pesan={errors.whatsapp} />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Galat pesan={errors.email} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="peta_lat">Lintang peta (Latitude)</Label>
                            <Input
                                id="peta_lat"
                                value={petaLat}
                                onChange={(e) => setPetaLat(e.target.value)}
                                placeholder="-8.2345678"
                            />
                            <Galat pesan={errors.peta_lat} />
                        </div>
                        <div>
                            <Label htmlFor="peta_lng">Bujur peta (Longitude)</Label>
                            <Input
                                id="peta_lng"
                                value={petaLng}
                                onChange={(e) => setPetaLng(e.target.value)}
                                placeholder="113.4567890"
                            />
                            <Petunjuk>Ambil dari Google Maps: angka pertama lintang, kedua bujur.</Petunjuk>
                            <Galat pesan={errors.peta_lng} />
                        </div>
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Media Sosial</h2>

                    <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                            id="instagram"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            placeholder="https://instagram.com/..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                            id="facebook"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            placeholder="https://facebook.com/..."
                        />
                    </div>

                    <div>
                        <Label htmlFor="youtube">YouTube</Label>
                        <Input
                            id="youtube"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                            placeholder="https://youtube.com/..."
                        />
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Logo Sekolah</h2>

                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt="Logo Sekolah"
                            width={80}
                            height={80}
                            className="size-20 rounded-md border border-line object-contain p-1"
                        />
                    )}

                    <div>
                        <Label htmlFor="logo">Berkas logo</Label>
                        <input
                            id="logo"
                            type="file"
                            accept={TIPE_GAMBAR_DITERIMA}
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                        />
                        <Petunjuk>PNG transparan, JPG, atau WebP. Maksimal 2 MB.</Petunjuk>
                        {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                        <Galat pesan={errors.logo} />
                    </div>
                </Kartu>

                <Tombol disabled={processing}>
                    {processing ? 'Menyimpan…' : 'Simpan Pengaturan'}
                </Tombol>
            </form>
        </div>
    );
}
