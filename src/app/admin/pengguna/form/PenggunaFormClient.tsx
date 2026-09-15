'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Select, Tombol } from '@/components/Ui';
import { savePengguna } from '../actions';

type PenggunaProp = {
    id?: string;
    nama: string;
    email: string;
    peran: string | null;
    guru_id: number | null;
} | null;

type Props = {
    pengguna: PenggunaProp;
    pilihanPeran: { value: string; label: string; keterangan: string }[];
    pilihanGuru: { id: number; nama: string }[];
};

export default function PenggunaFormClient({ pengguna, pilihanPeran, pilihanGuru }: Props) {
    const baru = !pengguna?.id;

    const [nama, setNama] = useState(pengguna?.nama ?? '');
    const [email, setEmail] = useState(pengguna?.email ?? '');
    const [peran, setPeran] = useState(pengguna?.peran ?? 'admin');
    const [guruId, setGuruId] = useState(pengguna?.guru_id?.toString() ?? '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const kirim = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        if (password && password !== passwordConfirmation) {
            setErrors({ password_confirmation: 'Konfirmasi kata sandi tidak cocok.' });
            setProcessing(false);
            return;
        }

        if (baru && (!password || password.length < 6)) {
            setErrors({ password: 'Kata sandi baru minimal 6 karakter.' });
            setProcessing(false);
            return;
        }

        try {
            const formData = new FormData();
            if (pengguna?.id) formData.append('id', pengguna.id);
            formData.append('nama', nama);
            formData.append('email', email);
            formData.append('peran', peran);
            if (guruId) formData.append('guru_id', guruId);
            if (password) formData.append('password', password);

            await savePengguna(formData);
        } catch (err: any) {
            setErrors({ _general: err.message || 'Gagal menyimpan akun pengguna' });
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <PageHeader judul={baru ? 'Tambah Akun' : 'Ubah Akun'} />

            <p className="mb-4 text-sm">
                <Link href="/admin/pengguna" className="text-ink-muted underline underline-offset-4">
                    ← Kembali ke daftar akun
                </Link>
            </p>

            {errors._general && <div className="mb-4 text-sm text-danger">{errors._general}</div>}

            <form onSubmit={kirim} className="space-y-6">
                <Kartu className="space-y-5">
                    <div>
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            autoFocus
                        />
                        <Galat pesan={errors.nama} />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                        />
                        <Petunjuk>Dipakai untuk masuk ke panel admin.</Petunjuk>
                        <Galat pesan={errors.email} />
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium text-ink">Peran</legend>

                        {pilihanPeran.map((p) => (
                            <label key={p.value} className="flex items-start gap-3">
                                <input
                                    type="radio"
                                    name="peran"
                                    value={p.value}
                                    checked={peran === p.value}
                                    onChange={(e) => setPeran(e.target.value)}
                                    className="mt-0.5 border-line text-brand focus:ring-brand"
                                />
                                <span>
                                    <span className="text-sm font-medium text-ink">{p.label}</span>
                                    <span className="block text-sm text-ink-muted">{p.keterangan}</span>
                                </span>
                            </label>
                        ))}

                        <Galat pesan={errors.peran} />
                    </fieldset>

                    <div>
                        <Label htmlFor="guru_id">Tautan ke Data Guru / Tendik (Opsional)</Label>
                        <Select
                            id="guru_id"
                            value={guruId}
                            onChange={(e) => setGuruId(e.target.value)}
                        >
                            <option value="">Tidak ditautkan</option>
                            {pilihanGuru.map((guru) => (
                                <option key={guru.id} value={guru.id}>
                                    {guru.nama}
                                </option>
                            ))}
                        </Select>
                        <Petunjuk>Hubungkan akun ini dengan profil pendidik atau tenaga kependidikan.</Petunjuk>
                        <Galat pesan={errors.guru_id} />
                    </div>
                </Kartu>

                <Kartu className="space-y-5">
                    <div>
                        <h2 className="font-heading text-lg font-semibold text-ink">
                            {baru ? 'Kata sandi' : 'Ganti kata sandi'}
                        </h2>
                        <p className="mt-1 text-sm text-ink-muted">
                            {baru
                                ? 'Minimal 6 karakter. Sampaikan langsung ke orangnya, jangan lewat grup terbuka.'
                                : 'Kosongkan bila tidak ingin mengganti. Isi bila yang bersangkutan lupa kata sandinya.'}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="password">Kata sandi{baru ? '' : ' baru'}</Label>
                        <div className="relative mt-1">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={baru}
                                autoComplete="new-password"
                                className="!mt-0 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink focus:outline-none"
                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                        <Galat pesan={errors.password} />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation">Ulangi kata sandi</Label>
                        <div className="relative mt-1">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required={baru || Boolean(password)}
                                autoComplete="new-password"
                                className="!mt-0 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink focus:outline-none"
                                aria-label={showPasswordConfirmation ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showPasswordConfirmation ? (
                                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                        <Galat pesan={errors.password_confirmation} />
                    </div>
                </Kartu>

                <div className="flex items-center gap-3">
                    <Tombol disabled={processing}>
                        {processing ? 'Menyimpan…' : baru ? 'Buat Akun' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/pengguna" className="text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
