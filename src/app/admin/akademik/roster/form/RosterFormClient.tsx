'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveRoster } from '../actions';
import { formatSemester } from '@/lib/akademik';
import type { ActionFormState } from '@/types/absensi';

type KelasOption = {
    id: number;
    nama: string;
    tingkat: number;
    tahun_ajaran?: any;
};

type SiswaOption = {
    id: number;
    kode_siswa: string;
    nama: string;
    jenis_kelamin: string | null;
};

export default function RosterFormClient({
    anggotaKelas,
    daftarKelas,
    daftarSiswa,
    defaultKelasId,
}: {
    anggotaKelas?: any;
    daftarKelas: KelasOption[];
    daftarSiswa: SiswaOption[];
    defaultKelasId?: number | null;
}) {
    const baru = !anggotaKelas?.id;
    const initialState: ActionFormState = { error: '' };
    const [state, formAction, isPending] = useActionState(saveRoster, initialState);

    // Tentukan nilai default kelas
    const selectedKelas =
        anggotaKelas?.kelas_id?.toString() ??
        defaultKelasId?.toString() ??
        daftarKelas[0]?.id?.toString() ??
        '';

    // Tanggal hari ini dalam format YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Anggota Roster' : 'Ubah Data Keanggotaan'} />

            <p className="mb-4 text-sm">
                <Link
                    href={`/admin/akademik/roster${selectedKelas ? `?kelas_id=${selectedKelas}` : ''}`}
                    className="text-ink-muted underline underline-offset-4"
                >
                    ← Kembali ke daftar roster
                </Link>
            </p>

            {state?.error && (
                <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                {anggotaKelas?.id && <input type="hidden" name="id" value={anggotaKelas.id} />}

                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="kelas_id">Rombongan Belajar (Kelas)</Label>
                        <Select
                            id="kelas_id"
                            name="kelas_id"
                            defaultValue={selectedKelas}
                            required
                        >
                            <option value="" disabled>
                                -- Pilih Kelas --
                            </option>
                            {daftarKelas.map((k) => {
                                const ta = Array.isArray(k.tahun_ajaran) ? k.tahun_ajaran[0] : k.tahun_ajaran;
                                return (
                                    <option key={k.id} value={k.id}>
                                        {k.nama} (Kelas {k.tingkat}) {ta ? `— ${ta.nama} ${formatSemester(ta.semester)}` : ''}
                                    </option>
                                );
                            })}
                        </Select>
                        <Petunjuk>Kelas yang menjadi tempat siswa belajar.</Petunjuk>
                    </div>

                    <div>
                        <Label htmlFor="siswa_id">Pilih Siswa</Label>
                        <Select
                            id="siswa_id"
                            name="siswa_id"
                            defaultValue={anggotaKelas?.siswa_id?.toString() ?? ''}
                            required
                        >
                            <option value="" disabled>
                                -- Pilih Siswa --
                            </option>
                            {daftarSiswa.map((s) => (
                                <option key={s.id} value={s.id}>
                                    [{s.kode_siswa}] {s.nama} ({s.jenis_kelamin || '-'})
                                </option>
                            ))}
                        </Select>
                        <Petunjuk>Pilih peserta didik yang akan dimasukkan ke rombel.</Petunjuk>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="mulai_pada">Mulai Bergabung</Label>
                            <Input
                                id="mulai_pada"
                                name="mulai_pada"
                                type="date"
                                defaultValue={anggotaKelas?.mulai_pada ?? todayStr}
                                required
                            />
                            <Petunjuk>Tanggal siswa mulai aktif di kelas ini.</Petunjuk>
                        </div>

                        <div>
                            <Label htmlFor="selesai_pada">Selesai / Pindah (Opsional)</Label>
                            <Input
                                id="selesai_pada"
                                name="selesai_pada"
                                type="date"
                                defaultValue={anggotaKelas?.selesai_pada ?? ''}
                            />
                            <Petunjuk>Kosongkan jika siswa masih aktif di kelas ini.</Petunjuk>
                        </div>
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={isPending}>
                        {isPending ? 'Menyimpan…' : baru ? 'Simpan ke Roster' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link
                        href={`/admin/akademik/roster${selectedKelas ? `?kelas_id=${selectedKelas}` : ''}`}
                        className="text-sm text-ink-muted underline underline-offset-4"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
