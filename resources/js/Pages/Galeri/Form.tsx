import { Head, Link, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Textarea, Tombol } from '@/Components/Ui';
import { formatUkuranBerkas, optimalkanGambar, TIPE_GAMBAR_DITERIMA } from '@/lib/optimalkanGambar';

type Foto = { id: number; url: string; alt: string | null; urlHapus: string };

type AlbumProp = {
    id: number;
    judul: string;
    slug: string;
    deskripsi: string | null;
    urutan: number;
    foto: Foto[];
} | null;

type Props = { album: AlbumProp; aksi: string; aksiUnggah?: string };

/** Unggah beberapa foto sekaligus; tiap berkas wajib punya teks alternatif. */
function UnggahFoto({ aksiUnggah }: { aksiUnggah: string }) {
    const [berkas, setBerkas] = useState<File[]>([]);
    const [sedangMenyiapkan, setSedangMenyiapkan] = useState(false);
    const [pesanOptimasi, setPesanOptimasi] = useState<string | null>(null);
    const [melewatiBatas, setMelewatiBatas] = useState(false);
    const pilihanTerakhir = useRef(0);
    const { data, setData, post, processing, errors, reset } = useForm<{ foto: File[]; alt: string[] }>({
        foto: [],
        alt: [],
    });

    const pilih = async (daftar: FileList | null) => {
        const pilihan = ++pilihanTerakhir.current;
        const isi = Array.from(daftar ?? []);

        if (isi.length === 0) {
            setBerkas([]);
            setData({ foto: [], alt: [] });
            setPesanOptimasi(null);
            setSedangMenyiapkan(false);
            setMelewatiBatas(false);

            return;
        }

        setSedangMenyiapkan(true);
        setPesanOptimasi(`Menyiapkan 1 dari ${isi.length} foto…`);
        const hasil = [];

        for (const [indeks, foto] of isi.entries()) {
            if (pilihan !== pilihanTerakhir.current) return;

            setPesanOptimasi(`Menyiapkan ${indeks + 1} dari ${isi.length} foto…`);
            hasil.push(await optimalkanGambar(foto));
        }

        if (pilihan !== pilihanTerakhir.current) return;

        const fotoSiap = hasil.map((item) => item.berkas);
        const ukuranAwal = hasil.reduce((total, item) => total + item.ukuranAwal, 0);
        const ukuranAkhir = hasil.reduce((total, item) => total + item.ukuranAkhir, 0);
        const jumlahDikompres = hasil.filter((item) => item.dikompres).length;
        const jumlahTerlaluBesar = hasil.filter((item) => item.ukuranAkhir > 8 * 1024 * 1024).length;
        let pesan = `${fotoSiap.length} foto siap diunggah (${formatUkuranBerkas(ukuranAkhir)}).`;

        if (jumlahTerlaluBesar > 0) {
            pesan = `${jumlahTerlaluBesar} foto masih melebihi batas 8 MB. Pilih foto yang lebih kecil.`;
        } else if (jumlahDikompres > 0) {
            pesan = `${jumlahDikompres} foto diperkecil: ${formatUkuranBerkas(ukuranAwal)} menjadi ${formatUkuranBerkas(ukuranAkhir)}.`;
        }

        setBerkas(fotoSiap);
        setData({ foto: fotoSiap, alt: fotoSiap.map(() => '') });
        setMelewatiBatas(jumlahTerlaluBesar > 0);
        setPesanOptimasi(pesan);
        setSedangMenyiapkan(false);
    };

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (sedangMenyiapkan || melewatiBatas) return;

        post(aksiUnggah, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setBerkas([]);
                setPesanOptimasi(null);
                setMelewatiBatas(false);
            },
        });
    };

    return (
        <form onSubmit={kirim} className="space-y-5">
            <div>
                <Label htmlFor="foto">Pilih foto</Label>
                <input
                    id="foto"
                    type="file"
                    accept={TIPE_GAMBAR_DITERIMA}
                    multiple
                    onChange={(e) => void pilih(e.target.files)}
                    className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                />
                <Petunjuk>Bisa pilih banyak sekaligus. Maksimal 8 MB per foto.</Petunjuk>
                {pesanOptimasi && <Petunjuk>{pesanOptimasi}</Petunjuk>}
                <Galat pesan={errors.foto} />
            </div>

            {berkas.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm text-ink-muted">
                        Isi teks alternatif tiap foto. Wajib — inilah yang dibacakan pembaca layar dan yang tampil bila
                        gambar gagal dimuat.
                    </p>

                    {berkas.map((f, i) => (
                        <div key={f.name + i}>
                            <Label htmlFor={`alt-${i}`}>{f.name}</Label>
                            <Input
                                id={`alt-${i}`}
                                value={data.alt[i] ?? ''}
                                onChange={(e) => {
                                    const alt = [...data.alt];
                                    alt[i] = e.target.value;
                                    setData('alt', alt);
                                }}
                                required
                                placeholder="mis. Siswa mengikuti upacara bendera"
                            />
                            <Galat pesan={errors[`alt.${i}` as keyof typeof errors] as string | undefined} />
                        </div>
                    ))}

                    <Tombol disabled={processing || sedangMenyiapkan || melewatiBatas}>
                        {sedangMenyiapkan ? 'Menyiapkan foto…' : `Unggah ${berkas.length} foto`}
                    </Tombol>
                </div>
            )}
        </form>
    );
}

export default function Form({ album, aksi, aksiUnggah }: Props) {
    const baru = album === null;

    const { data, setData, post, put, processing, errors } = useForm({
        judul: album?.judul ?? '',
        slug: album?.slug ?? '',
        deskripsi: album?.deskripsi ?? '',
        urutan: album?.urutan?.toString() ?? '0',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        baru ? post(aksi) : put(aksi);
    };

    const hapusFoto = (foto: Foto) => {
        if (!confirm('Hapus foto ini dari album?')) return;

        router.delete(foto.urlHapus, { preserveScroll: true });
    };

    return (
        <>
            <Head title={baru ? 'Album Baru' : album!.judul} />

            <PageHeader judul={baru ? 'Album Baru' : 'Ubah Album'} />

            <div className="max-w-2xl space-y-6">
                <p className="text-sm">
                    <Link href={route('admin.galeri.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar album
                    </Link>
                </p>

                <form onSubmit={kirim}>
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="judul">Judul album</Label>
                            <Input id="judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} required autoFocus />
                            <Galat pesan={errors.judul} />
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" rows={2} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} />
                            <Galat pesan={errors.deskripsi} />
                        </div>

                        <div>
                            <Label htmlFor="urutan">Urutan tampil</Label>
                            <Input id="urutan" type="number" min={0} max={999} value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} className="max-w-32" />
                            <Galat pesan={errors.urutan} />
                        </div>

                        <Tombol disabled={processing}>{baru ? 'Buat Album' : 'Simpan Perubahan'}</Tombol>
                    </Kartu>
                </form>

                {!baru && aksiUnggah && (
                    <>
                        <Kartu className="space-y-5">
                            <h2 className="font-heading text-lg font-semibold text-ink">Unggah foto</h2>
                            <UnggahFoto aksiUnggah={aksiUnggah} />
                        </Kartu>

                        <Kartu className="space-y-4">
                            <h2 className="font-heading text-lg font-semibold text-ink">
                                Foto dalam album <span className="text-sm font-normal text-ink-muted">({album!.foto.length})</span>
                            </h2>

                            {album!.foto.length === 0 ? (
                                <p className="text-sm text-ink-muted">Album ini belum berisi foto.</p>
                            ) : (
                                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {album!.foto.map((f) => (
                                        <li key={f.id} className="space-y-2">
                                            <img src={f.url} alt={f.alt ?? ''} width={160} height={160} className="aspect-square w-full rounded-md border border-line object-cover" />
                                            <p className="line-clamp-2 text-xs text-ink-muted">{f.alt}</p>
                                            <Tombol type="button" variasi="bahaya" onClick={() => hapusFoto(f)}>Hapus</Tombol>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Kartu>
                    </>
                )}
            </div>
        </>
    );
}
