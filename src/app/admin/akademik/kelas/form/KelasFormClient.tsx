'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveKelas } from '../actions';
import { formatSemester } from '@/lib/akademik';
import type { Kelas, ActionFormState } from '@/types/absensi';

type TahunAjaranOption = {
    id: number;
    nama: string;
    semester: string;
    aktif: boolean;
};

type GuruOption = {
    id: number;
    nama: string;
};

export default function KelasFormClient({
    kelas,
    daftarTahunAjaran,
    daftarGuru,
}: {
    kelas?: Kelas | null;
    daftarTahunAjaran: TahunAjaranOption[];
    daftarGuru: GuruOption[];
}) {
    const baru = !kelas?.id;
    const initialState: ActionFormState = { error: '' };
    const [state, formAction, isPending] = useActionState(saveKelas, initialState);

    // Tentukan default tahun ajaran: jika ada di kelas, pakai itu; jika tidak, pakai yang aktif
    const defaultTahunAjaranId =
        kelas?.tahun_ajaran_id?.toString() ??
        daftarTahunAjaran.find((ta) => ta.aktif)?.id.toString() ??
        daftarTahunAjaran[0]?.id.toString() ??
        '';

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Kelas' : 'Ubah Data Kelas'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/akademik/kelas" className="inline-flex min-h-[44px] items-center text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar kelas
                </Link>
            </p>

            {state?.error && (
                <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                {kelas?.id && <input type="hidden" name="id" value={kelas.id} />}

                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="tahun_ajaran_id">Tahun Ajaran</Label>
                        <Select
                            id="tahun_ajaran_id"
                            name="tahun_ajaran_id"
                            defaultValue={defaultTahunAjaranId}
                            required
                        >
                            <option value="" disabled>
                                -- Pilih Tahun Ajaran --
                            </option>
                            {daftarTahunAjaran.map((ta) => (
                                <option key={ta.id} value={ta.id}>
                                    {ta.nama} ({formatSemester(ta.semester)}) {ta.aktif ? '— (Aktif)' : ''}
                                </option>
                            ))}
                        </Select>
                        <Petunjuk>Kelas terikat pada tahun ajaran dan semester tertentu.</Petunjuk>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="nama">Nama Kelas</Label>
                            <Input
                                id="nama"
                                name="nama"
                                defaultValue={kelas?.nama ?? ''}
                                placeholder="mis. X-A atau XI MIPA 1"
                                required
                                autoFocus
                            />
                            <Petunjuk>Nama rombongan belajar.</Petunjuk>
                        </div>

                        <div>
                            <Label htmlFor="tingkat">Tingkat</Label>
                            <Select
                                id="tingkat"
                                name="tingkat"
                                defaultValue={kelas?.tingkat?.toString() ?? '10'}
                                required
                            >
                                <option value="10">Kelas 10 (Fase E)</option>
                                <option value="11">Kelas 11 (Fase F)</option>
                                <option value="12">Kelas 12 (Fase F)</option>
                            </Select>
                            <Petunjuk>Tingkat jenjang SMA (10, 11, atau 12).</Petunjuk>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="wali_kelas_id">Wali Kelas</Label>
                        <Select
                            id="wali_kelas_id"
                            name="wali_kelas_id"
                            defaultValue={kelas?.wali_kelas_id?.toString() ?? ''}
                        >
                            <option value="">-- Belum Ditentukan --</option>
                            {daftarGuru.map((guru) => (
                                <option key={guru.id} value={guru.id}>
                                    {guru.nama}
                                </option>
                            ))}
                        </Select>
                        <Petunjuk>
                            Wali kelas memiliki hak akses untuk mengisi dan menyelesaikan absensi harian kelas ini.
                        </Petunjuk>
                    </div>

                    <label className="flex items-start gap-3 pt-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="aktif"
                            value="true"
                            defaultChecked={kelas?.aktif ?? true}
                            className="mt-0.5 size-5 rounded border-line text-brand shadow-card focus:ring-brand"
                        />
                        <span>
                            <span className="text-sm font-medium text-ink">Status Aktif</span>
                            <span className="block text-sm text-ink-muted">
                                Kelas nonaktif tidak akan muncul pada menu pengisian absensi harian.
                            </span>
                        </span>
                    </label>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={isPending} className="min-h-[44px]">
                        {isPending ? 'Menyimpan…' : baru ? 'Simpan Kelas' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/akademik/kelas" className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
