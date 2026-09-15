'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Tombol } from '@/components/Ui';
import EditorTeks from '@/components/EditorTeks';
import { saveHalaman } from '../actions';

type HalamanProp = {
    id: number;
    kunci: string;
    judul: string;
    isi: string;
    terbit: boolean;
};

export default function HalamanFormClient({ halaman }: { halaman: HalamanProp }) {
    const [judul, setJudul] = useState(halaman.judul);
    const [isi, setIsi] = useState(halaman.isi);
    const [terbit, setTerbit] = useState(halaman.terbit);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const textContent = isi.replace(/<[^>]*>/g, '').trim();
    const adaIsi = textContent.length > 0;

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('id', halaman.id.toString());
            formData.append('judul', judul);
            formData.append('isi', isi);
            formData.append('terbit', terbit ? 'true' : 'false');

            await saveHalaman(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan halaman' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <PageHeader judul={halaman.judul} keterangan={`Kunci sistem: ${halaman.kunci}`} />

            <p className="mb-4 text-sm">
                <Link href="/admin/halaman" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar halaman
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="judul">Judul halaman</Label>
                        <Input
                            id="judul"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            required
                        />
                        <Galat pesan={errors.judul} />
                    </div>

                    <div>
                        <Label htmlFor="isi">Isi</Label>
                        <EditorTeks
                            id="isi"
                            nilai={isi}
                            onUbah={setIsi}
                            placeholder="Tempel naskah dari sekolah di sini…"
                        />
                        <Galat pesan={errors.isi} />
                    </div>
                </Kartu>

                <Kartu className="space-y-4">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={terbit}
                            disabled={!adaIsi}
                            onChange={(e) => setTerbit(e.target.checked)}
                            className="mt-0.5 rounded border-line text-brand shadow-card focus:ring-brand disabled:opacity-50"
                        />
                        <span>
                            <span className="text-sm font-medium text-ink">Tampilkan di situs</span>
                            <span className="block text-sm text-ink-muted">
                                {adaIsi
                                    ? 'Saat dicentang, halaman ini terbit dan tautannya muncul di navigasi.'
                                    : 'Isi naskahnya dulu. Halaman kosong tidak boleh diterbitkan.'}
                            </span>
                        </span>
                    </label>

                    <Petunjuk>Perubahan langsung terlihat di situs setelah disimpan.</Petunjuk>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/halaman" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
