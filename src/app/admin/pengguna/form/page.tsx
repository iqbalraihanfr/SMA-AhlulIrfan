import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PenggunaFormClient from './PenggunaFormClient';

export const metadata = {
    title: 'Tambah/Ubah Akun Pengguna | Admin',
};

export default async function PenggunaFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('peran')
        .eq('id', user.id)
        .maybeSingle();

    if (profile?.peran !== 'super-admin') {
        redirect('/admin');
    }

    let pengguna = null;

    if (searchParams.id) {
        const { data } = await supabase.from('users').select('*').eq('id', searchParams.id).single();
        if (data) {
            pengguna = {
                id: data.id,
                nama: data.nama,
                email: data.email,
                peran: data.peran,
                guru_id: data.guru_id,
            };
        }
    }

    const { data: guruList } = await supabase
        .from('guru')
        .select('id, nama')
        .eq('aktif', true)
        .order('nama', { ascending: true });

    const pilihanPeran = [
        {
            value: 'super-admin',
            label: 'Super Admin',
            keterangan: 'Akses penuh termasuk pengaturan situs dan pengelolaan akun.',
        },
        {
            value: 'admin',
            label: 'Admin Sekolah',
            keterangan: 'Mengelola konten sekolah (berita, guru, galeri, ekstrakurikuler, bagan, dan halaman).',
        },
        {
            value: 'guru',
            label: 'Guru / Wali Kelas',
            keterangan: 'Hanya dapat mengisi presensi harian dan melihat rekap presensi kelasnya.',
        },
    ];

    const pilihanGuru = (guruList ?? []).map((g) => ({
        id: g.id,
        nama: g.nama,
    }));

    return (
        <PenggunaFormClient
            pengguna={pengguna}
            pilihanPeran={pilihanPeran}
            pilihanGuru={pilihanGuru}
        />
    );
}
