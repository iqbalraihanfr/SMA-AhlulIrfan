import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/Components/Ui';

type SimpulProp = {
    id: number;
    label: string;
    guru_id: number | null;
    atasan_id: number | null;
    tipe: string;
    nama_luar: string | null;
    baris: number;
    urutan: number;
} | null;

type Pilihan = {
    guru: { value: number; label: string }[];
    atasan: { value: number; label: string }[];
    tipe: { value: string; label: string }[];
};

export default function Form({ simpul, pilihan, aksi }: { simpul: SimpulProp; pilihan: Pilihan; aksi: string }) {
    const baru = simpul === null;

    const { data, setData, post, put, processing, errors } = useForm({
        label: simpul?.label ?? '',
        tipe: simpul?.tipe ?? 'orang',
        guru_id: simpul?.guru_id?.toString() ?? '',
        nama_luar: simpul?.nama_luar ?? '',
        atasan_id: simpul?.atasan_id?.toString() ?? '',
        baris: simpul?.baris?.toString() ?? '1',
        urutan: simpul?.urutan?.toString() ?? '0',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        baru ? post(aksi) : put(aksi);
    };

    return (
        <>
            <Head title={baru ? 'Tambah Simpul' : simpul!.label} />

            <PageHeader judul={baru ? 'Tambah Simpul' : 'Ubah Simpul'} />

            <div className="max-w-2xl">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.struktur.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke bagan
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="label">Nama jabatan</Label>
                            <Input id="label" value={data.label} onChange={(e) => setData('label', e.target.value)} required autoFocus placeholder="mis. Waka Kurikulum" />
                            <Petunjuk>Teks yang tampil di kotak bagan.</Petunjuk>
                            <Galat pesan={errors.label} />
                        </div>

                        <div>
                            <Label htmlFor="tipe">Jenis simpul</Label>
                            <Select id="tipe" value={data.tipe} onChange={(e) => setData('tipe', e.target.value)}>
                                {pilihan.tipe.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </Select>
                            <Galat pesan={errors.tipe} />
                        </div>

                        {data.tipe === 'orang' && (
                            <div>
                                <Label htmlFor="guru_id">Orangnya</Label>
                                <Select id="guru_id" value={data.guru_id} onChange={(e) => setData('guru_id', e.target.value)}>
                                    <option value="">Belum dipilih</option>
                                    {pilihan.guru.map((g) => (
                                        <option key={g.value} value={g.value}>{g.label}</option>
                                    ))}
                                </Select>
                                <Petunjuk>
                                    Diambil dari data Guru &amp; Tendik, bukan diketik ulang — supaya nama hanya punya satu
                                    sumber kebenaran.
                                </Petunjuk>
                                <Galat pesan={errors.guru_id} />
                            </div>
                        )}

                        {data.tipe === 'penasihat' && (
                            <div>
                                <Label htmlFor="nama_luar">Nama</Label>
                                <Input id="nama_luar" value={data.nama_luar} onChange={(e) => setData('nama_luar', e.target.value)} placeholder="mis. Asmiatul Hosani, A. Akun." />
                                <Petunjuk>Untuk orang di luar daftar pegawai, seperti anggota Komite Sekolah.</Petunjuk>
                                <Galat pesan={errors.nama_luar} />
                            </div>
                        )}
                    </Kartu>

                    <Kartu className="space-y-5">
                        <h2 className="font-heading text-lg font-semibold text-ink">Posisi dalam bagan</h2>

                        <div>
                            <Label htmlFor="atasan_id">Atasan</Label>
                            <Select id="atasan_id" value={data.atasan_id} onChange={(e) => setData('atasan_id', e.target.value)}>
                                <option value="">Tidak ada — ini simpul teratas</option>
                                {pilihan.atasan.map((a) => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </Select>
                            <Galat pesan={errors.atasan_id} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="baris">Baris</Label>
                                <Input id="baris" type="number" min={1} max={9} value={data.baris} onChange={(e) => setData('baris', e.target.value)} />
                                <Petunjuk>
                                    Anak dari atasan yang sama dikelompokkan per baris. Bagan sekolah punya satu baris
                                    yang menggantung di bawah keempat Waka sekaligus — itulah gunanya kolom ini.
                                </Petunjuk>
                                <Galat pesan={errors.baris} />
                            </div>

                            <div>
                                <Label htmlFor="urutan">Urutan dalam baris</Label>
                                <Input id="urutan" type="number" min={0} max={99} value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} />
                                <Petunjuk>Dari kiri ke kanan.</Petunjuk>
                                <Galat pesan={errors.urutan} />
                            </div>
                        </div>
                    </Kartu>

                    <div className="flex items-center gap-3">
                        <Tombol disabled={processing}>{baru ? 'Simpan' : 'Simpan Perubahan'}</Tombol>
                        <Link href={route('admin.struktur.index')} className="text-sm text-ink-muted underline underline-offset-4">Batal</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
