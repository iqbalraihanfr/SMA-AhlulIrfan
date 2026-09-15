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
                <Link href="/admin/pengguna" className="inline-flex min-h-[44px] items-center text-ink-muted underline underline-offset-4">
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
                        />
                        <Galat pesan={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="peran">Peran</Label>
                        <Select
                            id="peran"
                            value={peran}
                            onChange={(e) => setPeran(e.target.value)}
                        >
                            {pilihanPeran.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </Select>
                        <Petunjuk>
                            {pilihanPeran.find((p) => p.value === peran)?.keterangan}
                        </Petunjuk>
                    </div>

                    {peran === 'guru' && (
                        <div>
                            <Label htmlFor="guru_id">Tautkan ke Data Guru</Label>
                            <Select
                                id="guru_id"
                                value={guruId}
                                onChange={(e) => setGuruId(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Profil Guru --</option>
                                {pilihanGuru.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.nama}
                                    </option>
                                ))}
                            </Select>
                            <Petunjuk>
                                Akun ini akan mengenali perwalian kelas dan absensi sesuai guru yang ditautkan.
                            </Petunjuk>
                        </div>
                    )}
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
                                className="!mt-0 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex min-w-[44px] items-center justify-center text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-r-md"
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
                                className="!mt-0 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex min-w-[44px] items-center justify-center text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-r-md"
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
                    <Tombol disabled={processing} className="min-h-[44px]">
                        {processing ? 'Menyimpan…' : baru ? 'Buat Akun' : 'Simpan Perubahan'}
                    </Tombol>
                    <Link href="/admin/pengguna" className="inline-flex min-h-[44px] items-center px-2 text-sm text-ink-muted underline underline-offset-4">
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}
