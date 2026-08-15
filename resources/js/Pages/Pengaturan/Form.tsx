import { Head, useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/Components/Ui';

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
    logoUrl: string | null;
    logoAlt: string | null;
};

type Props = {
    pengaturan: Pengaturan;
    wajibRilis: { alamat: boolean; telepon: boolean; whatsapp: boolean };
};

export default function Form({ pengaturan, wajibRilis }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        nama_sekolah: pengaturan.nama_sekolah ?? '',
        nama_yayasan: pengaturan.nama_yayasan ?? '',
        semboyan: pengaturan.semboyan ?? '',
        alamat: pengaturan.alamat ?? '',
        telepon: pengaturan.telepon ?? '',
        whatsapp: pengaturan.whatsapp ?? '',
        email: pengaturan.email ?? '',
        peta_lat: pengaturan.peta_lat?.toString() ?? '',
        peta_lng: pengaturan.peta_lng?.toString() ?? '',
        npsn: pengaturan.npsn ?? '',
        akreditasi: pengaturan.akreditasi ?? '',
        instagram: pengaturan.instagram ?? '',
        facebook: pengaturan.facebook ?? '',
        youtube: pengaturan.youtube ?? '',
        logo: null as File | null,
        logo_alt: pengaturan.logoAlt ?? '',
    });

    const kurang = (Object.entries(wajibRilis) as [string, boolean][])
        .filter(([, ada]) => !ada)
        .map(([nama]) => nama);

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post(route('admin.pengaturan.update'), { forceFormData: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="Pengaturan Situs" />

            <PageHeader judul="Pengaturan Situs" keterangan="Identitas, kontak, dan tautan resmi sekolah." />

            <div className="max-w-3xl space-y-6">
                {kurang.length > 0 && (
                    <div role="alert" className="flex gap-3 rounded-lg border border-line bg-paper p-4 shadow-card">
                        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-highlight" aria-hidden="true" />
                        <div>
                            <p className="text-sm font-semibold text-ink">Belum bisa diluncurkan</p>
                            <p className="mt-1 text-sm text-ink-muted">
                                {kurang.join(', ')} masih kosong. Halaman Kontak tidak boleh disembunyikan maupun terbit
                                setengah isi — situs sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Identitas</h2>

                        <div>
                            <Label htmlFor="nama_sekolah">Nama sekolah</Label>
                            <Input id="nama_sekolah" value={data.nama_sekolah} onChange={(e) => setData('nama_sekolah', e.target.value)} required />
                            <Galat pesan={errors.nama_sekolah} />
                        </div>

                        <div>
                            <Label htmlFor="nama_yayasan">Nama yayasan</Label>
                            <Input id="nama_yayasan" value={data.nama_yayasan} onChange={(e) => setData('nama_yayasan', e.target.value)} />
                            <Galat pesan={errors.nama_yayasan} />
                        </div>

                        <div>
                            <Label htmlFor="semboyan">Semboyan</Label>
                            <Input id="semboyan" value={data.semboyan} onChange={(e) => setData('semboyan', e.target.value)} />
                            <Petunjuk>Tampil di hero beranda dan footer.</Petunjuk>
                            <Galat pesan={errors.semboyan} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="npsn">NPSN</Label>
                                <Input id="npsn" value={data.npsn} onChange={(e) => setData('npsn', e.target.value)} />
                                <Galat pesan={errors.npsn} />
                            </div>
                            <div>
                                <Label htmlFor="akreditasi">Akreditasi</Label>
                                <Input id="akreditasi" value={data.akreditasi} onChange={(e) => setData('akreditasi', e.target.value)} placeholder="mis. B (2023)" />
                                <Galat pesan={errors.akreditasi} />
                            </div>
                        </div>
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Kontak</h2>
                        <p className="-mt-3 text-sm text-ink-muted">Alamat, telepon, dan WhatsApp wajib terisi sebelum situs diluncurkan.</p>

                        <div>
                            <Label htmlFor="alamat">Alamat lengkap</Label>
                            <Textarea id="alamat" rows={2} value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                            <Petunjuk>Tulis sampai nama jalan dan nomor, bukan hanya nama desa.</Petunjuk>
                            <Galat pesan={errors.alamat} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="telepon">Telepon</Label>
                                <Input id="telepon" value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} />
                                <Galat pesan={errors.telepon} />
                            </div>
                            <div>
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input id="whatsapp" value={data.whatsapp} onChange={(e) => setData('whatsapp', e.target.value)} placeholder="08xxxxxxxxxx" />
                                <Petunjuk>Boleh diawali 0 atau 62 — sistem menyesuaikan sendiri.</Petunjuk>
                                <Galat pesan={errors.whatsapp} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <Galat pesan={errors.email} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="peta_lat">Lintang peta</Label>
                                <Input id="peta_lat" value={data.peta_lat} onChange={(e) => setData('peta_lat', e.target.value)} placeholder="-8.2345678" />
                                <Galat pesan={errors.peta_lat} />
                            </div>
                            <div>
                                <Label htmlFor="peta_lng">Bujur peta</Label>
                                <Input id="peta_lng" value={data.peta_lng} onChange={(e) => setData('peta_lng', e.target.value)} placeholder="113.4567890" />
                                <Petunjuk>Ambil dari Google Maps: klik kanan lokasi sekolah, angka pertama lintang, kedua bujur.</Petunjuk>
                                <Galat pesan={errors.peta_lng} />
                            </div>
                        </div>
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Media sosial</h2>

                        {(['instagram', 'facebook', 'youtube'] as const).map((kunci) => (
                            <div key={kunci}>
                                <Label htmlFor={kunci} className="capitalize">{kunci}</Label>
                                <Input
                                    id={kunci}
                                    value={data[kunci]}
                                    onChange={(e) => setData(kunci, e.target.value)}
                                    placeholder="https://…"
                                />
                                <Galat pesan={errors[kunci]} />
                            </div>
                        ))}
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Logo</h2>

                        {pengaturan.logoUrl && (
                            <img
                                src={pengaturan.logoUrl}
                                alt={pengaturan.logoAlt ?? ''}
                                width={80}
                                height={80}
                                className="size-20 rounded-md border border-line object-contain"
                            />
                        )}

                        <div>
                            <Label htmlFor="logo">Berkas logo</Label>
                            <input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                                className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                            />
                            <Petunjuk>PNG transparan atau SVG, maksimal 2 MB. Tanpa logo, navbar menampilkan inisial.</Petunjuk>
                            <Galat pesan={errors.logo} />
                        </div>

                        <div>
                            <Label htmlFor="logo_alt">Teks alternatif logo</Label>
                            <Input id="logo_alt" value={data.logo_alt} onChange={(e) => setData('logo_alt', e.target.value)} />
                            <Galat pesan={errors.logo_alt} />
                        </div>
                    </Kartu>

                    <Tombol disabled={processing}>Simpan Pengaturan</Tombol>
                </form>
            </div>
        </>
    );
}
