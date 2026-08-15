import { Head, Link, useForm } from '@inertiajs/react';
import { Galat, Input, Kartu, Label, PageHeader, Petunjuk, Tombol } from '@/Components/Ui';

type PenggunaProp = { id: number; name: string; email: string; peran: string | null } | null;

type Props = {
    pengguna: PenggunaProp;
    pilihanPeran: { value: string; label: string; keterangan: string }[];
    aksi: string;
};

export default function Form({ pengguna, pilihanPeran, aksi }: Props) {
    const baru = pengguna === null;

    const { data, setData, post, put, processing, errors } = useForm({
        name: pengguna?.name ?? '',
        email: pengguna?.email ?? '',
        peran: pengguna?.peran ?? 'admin',
        password: '',
        password_confirmation: '',
    });

    const kirim = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        baru ? post(aksi) : put(aksi);
    };

    return (
        <>
            <Head title={baru ? 'Tambah Akun' : pengguna!.name} />

            <PageHeader judul={baru ? 'Tambah Akun' : 'Ubah Akun'} />

            <div className="max-w-2xl">
                <p className="mb-4 text-sm">
                    <Link href={route('admin.pengguna.index')} className="text-ink-muted underline underline-offset-4">
                        ← Kembali ke daftar akun
                    </Link>
                </p>

                <form onSubmit={kirim} className="space-y-6">
                    <Kartu className="space-y-5">
                        <div>
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus />
                            <Galat pesan={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="off" />
                            <Petunjuk>Dipakai untuk masuk ke panel.</Petunjuk>
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
                                        checked={data.peran === p.value}
                                        onChange={(e) => setData('peran', e.target.value)}
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
                    </Kartu>

                    <Kartu className="space-y-5">
                        <div>
                            <h2 className="font-heading text-lg font-semibold text-ink">
                                {baru ? 'Kata sandi' : 'Ganti kata sandi'}
                            </h2>
                            <p className="mt-1 text-sm text-ink-muted">
                                {baru
                                    ? 'Minimal 12 karakter. Sampaikan langsung ke orangnya, jangan lewat grup chat.'
                                    : 'Kosongkan bila tidak ingin mengganti. Isi bila yang bersangkutan lupa kata sandinya.'}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="password">Kata sandi{baru ? '' : ' baru'}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required={baru}
                                autoComplete="new-password"
                            />
                            <Galat pesan={errors.password} />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">Ulangi kata sandi</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required={baru}
                                autoComplete="new-password"
                            />
                        </div>
                    </Kartu>

                    <div className="flex items-center gap-3">
                        <Tombol disabled={processing}>{baru ? 'Buat Akun' : 'Simpan Perubahan'}</Tombol>
                        <Link href={route('admin.pengguna.index')} className="text-sm text-ink-muted underline underline-offset-4">Batal</Link>
                    </div>
                </form>
            </div>
        </>
    );
}
