import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/Components/Ui';

type GuruProp = {
    id: number;
    nama: string;
    kategori: string;
    jenis_kelamin: string | null;
    jabatan: string | null;
    mata_pelajaran: string | null;
    urutan: number;
    aktif: boolean;
    fotoUrl: string | null;
    fotoAlt: string | null;
} | null;

type Props = {
    guru: GuruProp;
    pilihanKategori: { value: string; label: string }[];
    aksi: string;
};

export default function Form({ guru, pilihanKategori, aksi }: Props) {
    const baru = guru === null;

    const { data, setData, post, processing, errors } = useForm({
        _method: baru ? 'post' : 'put',
        nama: guru?.nama ?? '',
        kategori: guru?.kategori ?? 'pendidik',
        jenis_kelamin: guru?.jenis_kelamin ?? '',
        jabatan: guru?.jabatan ?? '',
        mata_pelajaran: guru?.mata_pelajaran ?? '',
        urutan: guru?.urutan?.toString() ?? '0',
        aktif: guru?.aktif ?? true,
        foto: null as File | null,
        foto_alt: guru?.fotoAlt ?? '',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        post(aksi, { forceFormData: true });
    };

    return (
        <>
            <Head title={baru ? 'Tambah Orang' : guru!.nama} />

            <PageHeader judul={baru ? 'Tambah Orang' : 'Ubah Data'} />

            <div className="max-w-2xl">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.guru.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="nama">Nama lengkap dengan gelar</Label>
                            <Input id="nama" value={data.nama} onChange={(e) => setData('nama', e.target.value)} required autoFocus />
                            <Petunjuk>Tulis seperti yang dipakai sekolah, mis. &ldquo;Hilmi Fathiyatul Baroroh, S.Pd., Gr&rdquo;.</Petunjuk>
                            <Galat pesan={errors.nama} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="kategori">Kategori</Label>
                                <Select id="kategori" value={data.kategori} onChange={(e) => setData('kategori', e.target.value)}>
                                    {pilihanKategori.map((k) => (
                                        <option key={k.value} value={k.value}>{k.label}</option>
                                    ))}
                                </Select>
                                <Petunjuk>Menentukan di kelompok mana ia tampil di halaman Guru.</Petunjuk>
                                <Galat pesan={errors.kategori} />
                            </div>

                            <div>
                                <Label htmlFor="jenis_kelamin">Jenis kelamin</Label>
                                <Select id="jenis_kelamin" value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)}>
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
                                <Input id="jabatan" value={data.jabatan} onChange={(e) => setData('jabatan', e.target.value)} placeholder="mis. Waka Kurikulum" />
                                <Petunjuk>Kosongkan untuk guru mata pelajaran tanpa jabatan tambahan.</Petunjuk>
                                <Galat pesan={errors.jabatan} />
                            </div>

                            <div>
                                <Label htmlFor="mata_pelajaran">Mata pelajaran</Label>
                                <Input id="mata_pelajaran" value={data.mata_pelajaran} onChange={(e) => setData('mata_pelajaran', e.target.value)} placeholder="mis. Fisika" />
                                <Galat pesan={errors.mata_pelajaran} />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="urutan">Urutan tampil</Label>
                                <Input id="urutan" type="number" min={0} max={999} value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} />
                                <Petunjuk>Angka lebih kecil tampil lebih dulu.</Petunjuk>
                                <Galat pesan={errors.urutan} />
                            </div>

                            <label className="flex items-start gap-3 pt-7">
                                <input
                                    type="checkbox"
                                    checked={data.aktif}
                                    onChange={(e) => setData('aktif', e.target.checked)}
                                    className="mt-0.5 rounded border-line text-brand shadow-card focus:ring-brand"
                                />
                                <span>
                                    <span className="text-sm font-medium text-ink">Masih aktif</span>
                                    <span className="block text-sm text-ink-muted">Yang nonaktif disembunyikan dari situs, bukan dihapus.</span>
                                </span>
                            </label>
                        </div>
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Foto</h2>

                        {guru?.fotoUrl && (
                            <img src={guru.fotoUrl} alt={guru.fotoAlt ?? ''} width={96} height={96} className="size-24 rounded-full border border-line object-cover" />
                        )}

                        <div>
                            <Label htmlFor="foto">Berkas foto</Label>
                            <input
                                id="foto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('foto', e.target.files?.[0] ?? null)}
                                className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink"
                            />
                            <Petunjuk>Opsional. Tanpa foto, situs menampilkan inisial — bukan gambar rusak.</Petunjuk>
                            <Galat pesan={errors.foto} />
                        </div>

                        <div>
                            <Label htmlFor="foto_alt">Teks alternatif foto</Label>
                            <Input id="foto_alt" value={data.foto_alt} onChange={(e) => setData('foto_alt', e.target.value)} placeholder="mis. Foto Ibu Hilmi, Waka Kurikulum" />
                            <Galat pesan={errors.foto_alt} />
                        </div>
                    </Kartu>

                    <div className="flex items-center gap-3">
                        <Tombol disabled={processing}>{baru ? 'Simpan' : 'Simpan Perubahan'}</Tombol>
                        <Link href={route('admin.guru.index')} className="text-sm text-ink-muted underline underline-offset-4">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
