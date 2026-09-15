'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveStruktur } from '../actions';

type SimpulProp = {
    id?: number;
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

export default function StrukturFormClient({
    simpul,
    pilihan,
}: {
    simpul: SimpulProp;
    pilihan: Pilihan;
}) {
    const baru = !simpul?.id;

    const [label, setLabel] = useState(simpul?.label ?? '');
    const [tipe, setTipe] = useState(simpul?.tipe ?? 'orang');
    const [guruId, setGuruId] = useState(simpul?.guru_id?.toString() ?? '');
    const [namaLuar, setNamaLuar] = useState(simpul?.nama_luar ?? '');
    const [atasanId, setAtasanId] = useState(simpul?.atasan_id?.toString() ?? '');
    const [baris, setBaris] = useState(simpul?.baris?.toString() ?? '1');
    const [urutan, setUrutan] = useState(simpul?.urutan?.toString() ?? '0');

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const formData = new FormData();
            if (simpul?.id) formData.append('id', simpul.id.toString());
            formData.append('label', label);
            formData.append('tipe', tipe);
            if (tipe === 'orang' && guruId) formData.append('guru_id', guruId);
            if (tipe === 'penasihat' && namaLuar) formData.append('nama_luar', namaLuar);
            if (atasanId) formData.append('atasan_id', atasanId);
            formData.append('baris', baris);
            formData.append('urutan', urutan);

            await saveStruktur(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan simpul struktur' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Simpul' : 'Ubah Simpul'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/struktur" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke bagan
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="label">Nama jabatan</Label>
                        <Input
                            id="label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            required
                            autoFocus
                            placeholder="mis. Waka Kurikulum"
                        />
                        <Petunjuk>Teks yang tampil di kotak bagan.</Petunjuk>
                        <Galat pesan={errors.label} />
                    </div>

                    <div>
                        <Label htmlFor="tipe">Jenis simpul</Label>
                        <Select id="tipe" value={tipe} onChange={(e) => setTipe(e.target.value)}>
                            {pilihan.tipe.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </Select>
                        <Galat pesan={errors.tipe} />
                    </div>

                    {tipe === 'orang' && (
                        <div>
                            <Label htmlFor="guru_id">Orangnya</Label>
                            <Select id="guru_id" value={guruId} onChange={(e) => setGuruId(e.target.value)}>
                                <option value="">Belum dipilih</option>
                                {pilihan.guru.map((g) => (
                                    <option key={g.value} value={g.value}>
                                        {g.label}
                                    </option>
                                ))}
                            </Select>
                            <Petunjuk>
                                Diambil dari data Guru &amp; Tendik, bukan diketik ulang.
                            </Petunjuk>
                            <Galat pesan={errors.guru_id} />
                        </div>
                    )}

                    {tipe === 'penasihat' && (
                        <div>
                            <Label htmlFor="nama_luar">Nama</Label>
                            <Input
                                id="nama_luar"
                                value={namaLuar}
                                onChange={(e) => setNamaLuar(e.target.value)}
                                placeholder="mis. Komite Sekolah"
                            />
                            <Petunjuk>Untuk orang di luar daftar pegawai, seperti Komite Sekolah.</Petunjuk>
                            <Galat pesan={errors.nama_luar} />
                        </div>
                    )}
                </Kartu>

                <Kartu className="space-y-5">
                    <h2 className="font-heading text-lg font-semibold text-ink">Posisi dalam bagan</h2>

                    <div>
                        <Label htmlFor="atasan_id">Atasan</Label>
                        <Select id="atasan_id" value={atasanId} onChange={(e) => setAtasanId(e.target.value)}>
                            <option value="">Tidak ada — ini simpul teratas</option>
                            {pilihan.atasan.map((a) => (
                                <option key={a.value} value={a.value}>
                                    {a.label}
                                </option>
                            ))}
                        </Select>
                        <Galat pesan={errors.atasan_id} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="baris">Baris</Label>
                            <Input
                                id="baris"
                                type="number"
                                min={1}
                                max={9}
                                value={baris}
                                onChange={(e) => setBaris(e.target.value)}
                            />
                            <Petunjuk>Tingkatan hierarki bagan (1 = teratas).</Petunjuk>
                            <Galat pesan={errors.baris} />
                        </div>

                        <div>
                            <Label htmlFor="urutan">Urutan dalam baris</Label>
                            <Input
                                id="urutan"
                                type="number"
                                min={0}
                                max={99}
                                value={urutan}
                                onChange={(e) => setUrutan(e.target.value)}
                            />
                            <Petunjuk>Dari kiri ke kanan.</Petunjuk>
                            <Galat pesan={errors.urutan} />
                        </div>
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : baru ? 'Simpan' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/struktur" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
