'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveSiswa } from '../actions';
import type { Siswa, ActionFormState } from '@/types/absensi';

export default function SiswaFormClient({
    siswa,
}: {
    siswa?: Siswa | null;
}) {
    const baru = !siswa?.id;
    const initialState: ActionFormState = { error: '' };
    const [state, formAction, isPending] = useActionState(saveSiswa, initialState);

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Siswa' : 'Ubah Data Siswa'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/akademik/siswa" className="inline-flex min-h-[44px] items-center text-ink-muted underline underline-offset-4">
                    ← Kembali ke data siswa
                </Link>
            </p>

            {state?.error && (
                <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                {siswa?.id && <input type="hidden" name="id" value={siswa.id} />}

                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="kode_siswa">Nomor Induk / Kode Siswa</Label>
                        <Input
                            id="kode_siswa"
                            name="kode_siswa"
                            defaultValue={siswa?.kode_siswa ?? ''}
                            placeholder="mis. AI-2026-001 atau NIS"
                            required
                            autoFocus
                        />
                        <Petunjuk>
                            Pengenal unik internal siswa (unik per siswa, tanpa data sensitif seperti NIK/NISN).
                        </Petunjuk>
                    </div>

                    <div>
                        <Label htmlFor="nama">Nama Lengkap Siswa</Label>
                        <Input
                            id="nama"
                            name="nama"
                            defaultValue={siswa?.nama ?? ''}
                            placeholder="Nama lengkap sesuai dokumen sekolah"
                            required
                        />
                        <Petunjuk>Gunakan huruf kapital di awal kata.</Petunjuk>
                    </div>

                    <div>
                        <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                        <Select
                            id="jenis_kelamin"
                            name="jenis_kelamin"
                            defaultValue={siswa?.jenis_kelamin ?? ''}
                        >
                            <option value="">-- Pilih Jenis Kelamin --</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </Select>
                    </div>

                    <label className="flex items-start gap-3 pt-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="aktif"
                            value="true"
                            defaultChecked={siswa?.aktif ?? true}
                            className="mt-0.5 size-5 rounded border-line text-brand shadow-card focus:ring-brand"
                        />
                        <span>
                            <span className="text-sm font-medium text-ink">Status Aktif</span>
                            <span className="block text-sm text-ink-muted">
                                Siswa nonaktif (alumni, mutasi, atau keluar) disembunyikan dari pilihan keanggotaan kelas baru.
                            </span>
                        </span>
                    </label>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={isPending} className="min-h-[44px]">
                        {isPending ? 'Menyimpan…' : baru ? 'Simpan Siswa' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/akademik/siswa" className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
