import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GuruFormClient from './GuruFormClient';

export const metadata = {
    title: 'Tambah/Ubah Guru | Admin',
};

export default async function GuruFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let guru = null;

    if (searchParams.id) {
        const { data } = await supabase.from('guru').select('*').eq('id', searchParams.id).single();
        if (data) {
            guru = {
                id: data.id,
                nama: data.nama,
                kategori: data.kategori || 'pendidik',
                jenis_kelamin: data.jenis_kelamin,
                jabatan: data.jabatan,
                mata_pelajaran: data.mata_pelajaran,
                urutan: data.urutan ?? 0,
                aktif: data.aktif ?? true,
                image_url: data.image_url,
            };
        }
    }

    const pilihanKategori = [
        { value: 'pendidik', label: 'Pendidik' },
        { value: 'tenaga_kependidikan', label: 'Tenaga Kependidikan' },
    ];

    return <GuruFormClient guru={guru} pilihanKategori={pilihanKategori} />;
}
