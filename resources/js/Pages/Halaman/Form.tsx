import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Tombol } from '@/Components/Ui';
import EditorTeks from '@/Components/EditorTeks';

type Props = {
    halaman: { id: number; kunci: string; judul: string; isi: string; terbit: boolean };
    aksi: string;
};

export default function Form({ halaman, aksi }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        judul: halaman.judul,
        isi: halaman.isi,
        terbit: halaman.terbit,
    });

    // Editor TipTap menyisakan markup kosong ("<p></p>") saat isinya dihapus,
    // jadi keberadaan naskah tidak bisa dinilai dari panjang string.
    const adaIsi = data.isi.replace(/<[^>]*>/g, '').trim().length > 0;

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        put(aksi, { preserveScroll: true });
    };

    return (
        <>
            <Head title={halaman.judul} />

            <PageHeader judul={halaman.judul} keterangan={`Kunci sistem: ${halaman.kunci}`} />

            <div className="max-w-3xl">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.halaman.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar halaman
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="judul">Judul halaman</Label>
                            <Input id="judul" value={data.judul} onChange={(e) => setData('judul', e.target.value)} required />
                            <Galat pesan={errors.judul} />
                        </div>

                        <div>
                            <Label htmlFor="isi">Isi</Label>
                            <EditorTeks
                                id="isi"
                                nilai={data.isi}
                                onUbah={(html) => setData('isi', html)}
                                placeholder="Tempel naskah dari sekolah di sini…"
                            />
                            <Galat pesan={errors.isi} />
                        </div>
                    </Kartu>

                    <Kartu className="space-y-4">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.terbit}
                                disabled={!adaIsi}
                                onChange={(e) => setData('terbit', e.target.checked)}
                                className="mt-0.5 rounded border-line text-brand shadow-card focus:ring-brand disabled:opacity-50"
                            />
                            <span>
                                <span className="text-sm font-medium text-ink">Tampilkan di situs</span>
                                <span className="block text-sm text-ink-muted">
                                    {adaIsi
                                        ? 'Saat dicentang, halaman ini terbit dan tautannya muncul di navigasi.'
                                        : 'Isi naskahnya dulu. Halaman kosong tidak boleh diterbitkan — halaman setengah isi lebih merusak kepercayaan calon orang tua daripada halaman yang belum ada.'}
                                </span>
                            </span>
                        </label>

                        <Petunjuk>Perubahan langsung terlihat di situs setelah disimpan.</Petunjuk>
                    </Kartu>

                    <Tombol disabled={processing}>Simpan</Tombol>
                </form>
            </div>
        </>
    );
}
