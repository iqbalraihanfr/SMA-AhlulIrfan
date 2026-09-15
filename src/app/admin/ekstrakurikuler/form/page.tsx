import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EkstrakurikulerFormClient from './EkstrakurikulerFormClient';

export const metadata = {
    title: 'Tambah/Ubah Ekstrakurikuler | Admin',
};

export default async function EkstrakurikulerFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let ekskul = null;

    if (searchParams.id) {
        const { data } = await supabase.from('ekstrakurikuler').select('*').eq('id', searchParams.id).single();
        if (data) {
            ekskul = {
                id: data.id,
                nama: data.nama,
                slug: data.slug,
                deskripsi: data.deskripsi,
                pembina: data.pembina,
                jadwal: data.jadwal,
                urutan: data.urutan ?? 0,
                image_url: data.image_url,
            };
        }
    }

    return <EkstrakurikulerFormClient ekskul={ekskul} />;
}
