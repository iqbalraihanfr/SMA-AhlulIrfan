import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import KelasFormClient from './KelasFormClient';

export const metadata = {
    title: 'Form Kelas | Admin',
};

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export default async function KelasFormPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = await searchParams;
    let kelas = null;

    if (id) {
        const { data, error } = await supabase
            .from('kelas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching kelas detail:', error.message);
        }
        kelas = data;
    }

    // Ambil daftar tahun ajaran
    const { data: daftarTahunAjaran } = await supabase
        .from('tahun_ajaran')
        .select('id, nama, semester, aktif')
        .order('mulai_pada', { ascending: false });

    // Ambil daftar guru pendidik untuk opsi wali kelas
    const { data: daftarGuru } = await supabase
        .from('guru')
        .select('id, nama')
        .eq('aktif', true)
        .order('nama', { ascending: true });

    return (
        <KelasFormClient
            kelas={kelas}
            daftarTahunAjaran={daftarTahunAjaran ?? []}
            daftarGuru={daftarGuru ?? []}
        />
    );
}
