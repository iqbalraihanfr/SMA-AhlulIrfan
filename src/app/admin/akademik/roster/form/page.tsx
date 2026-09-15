import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RosterFormClient from './RosterFormClient';

export const metadata = {
    title: 'Form Roster Kelas | Admin',
};

type Props = {
    searchParams: Promise<{ id?: string; kelas_id?: string }>;
};

export default async function RosterFormPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { id, kelas_id } = await searchParams;
    let anggotaKelas = null;

    if (id) {
        const { data, error } = await supabase
            .from('anggota_kelas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching anggota_kelas detail:', error.message);
        }
        anggotaKelas = data;
    }

    // Ambil daftar kelas
    const { data: daftarKelas } = await supabase
        .from('kelas')
        .select(`
            id,
            nama,
            tingkat,
            tahun_ajaran (
                nama,
                semester
            )
        `)
        .eq('aktif', true)
        .order('tingkat', { ascending: true })
        .order('nama', { ascending: true });

    // Ambil daftar siswa aktif
    const { data: daftarSiswa } = await supabase
        .from('siswa')
        .select('id, kode_siswa, nama, jenis_kelamin')
        .eq('aktif', true)
        .order('kode_siswa', { ascending: true });

    const defaultKelasId = kelas_id ? parseInt(kelas_id, 10) : null;

    return (
        <RosterFormClient
            anggotaKelas={anggotaKelas}
            daftarKelas={daftarKelas ?? []}
            daftarSiswa={daftarSiswa ?? []}
            defaultKelasId={defaultKelasId}
        />
    );
}
