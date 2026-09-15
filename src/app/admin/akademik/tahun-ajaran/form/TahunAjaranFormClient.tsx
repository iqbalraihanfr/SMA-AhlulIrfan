'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { saveTahunAjaran } from '../actions';
import type { TahunAjaran, ActionFormState } from '@/types/absensi';

export default function TahunAjaranFormClient({
    tahunAjaran,
}: {
    tahunAjaran?: TahunAjaran | null;
}) {
    const baru = !tahunAjaran?.id;
    const initialState: ActionFormState = { error: '' };
    const [state, formAction, isPending] = useActionState(saveTahunAjaran, initialState);

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Tahun Ajaran' : 'Ubah Tahun Ajaran'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/akademik/tahun-ajaran" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar tahun ajaran
                </Link>
            </p>

            {state?.error && (
                <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                {tahunAjaran?.id && <input type="hidden" name="id" value={tahunAjaran.id} />}

                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="nama">Nama Tahun Ajaran</Label>
                        <Input
                            id="nama"
                            name="nama"
                            defaultValue={tahunAjaran?.nama ?? ''}
                            placeholder="mis. 2025/2026"
                            required
                            autoFocus
                        />
                        <Petunjuk>Format umum: YYYY/YYYY (contoh: 2025/2026).</Petunjuk>
                    </div>

                    <div>
                        <Label htmlFor="semester">Semester</Label>
                        <Select
                            id="semester"
                            name="semester"
                            defaultValue={tahunAjaran?.semester ?? 'ganjil'}
                            required
                        >
                            <option value="ganjil">Ganjil</option>
                            <option value="genap">Genap</option>
                        </Select>
                        <Petunjuk>Pilih semester yang berlangsung.</Petunjuk>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="mulai_pada">Tanggal Mulai</Label>
                            <Input
                                id="mulai_pada"
                                name="mulai_pada"
                                type="date"
                                defaultValue={tahunAjaran?.mulai_pada ?? ''}
                                required
                            />
                            <Petunjuk>Awal kalender semester.</Petunjuk>
                        </div>

                        <div>
                            <Label htmlFor="selesai_pada">Tanggal Selesai</Label>
                            <Input
                                id="selesai_pada"
                                name="selesai_pada"
                                type="date"
                                defaultValue={tahunAjaran?.selesai_pada ?? ''}
                                required
                            />
                            <Petunjuk>Akhir kalender semester.</Petunjuk>
                        </div>
                    </div>

                    <label className="flex items-start gap-3 pt-2">
                        <input
                            type="checkbox"
                            name="aktif"
                            value="true"
                            defaultChecked={tahunAjaran?.aktif ?? false}
                            className="mt-0.5 rounded border-line text-brand shadow-card focus:ring-brand"
                        />
                        <span>
                            <span className="text-sm font-medium text-ink">Jadikan Periode Aktif</span>
                            <span className="block text-sm text-ink-muted">
                                Menandai tahun ajaran ini sebagai semester yang sedang berjalan. Tahun ajaran lain akan otomatis dinonaktifkan.
                            </span>
                        </span>
                    </label>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={isPending}>
                        {isPending ? 'Menyimpan…' : baru ? 'Simpan Tahun Ajaran' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link
                        href="/admin/akademik/tahun-ajaran"
                        className="text-sm text-ink-muted underline underline-offset-4"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
