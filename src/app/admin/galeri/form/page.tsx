import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GaleriFormClient from './GaleriFormClient';

export const metadata = {
    title: 'Album Baru/Ubah | Admin',
};

export default async function GaleriFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let album = null;

    if (searchParams.id) {
        const { data } = await supabase.from('album').select('*').eq('id', searchParams.id).single();
        if (data) {
            album = {
                id: data.id,
                judul: data.judul,
                slug: data.slug,
                deskripsi: data.deskripsi,
                urutan: data.urutan ?? 0,
                image_url: data.image_url,
            };
        }
    }

    return <GaleriFormClient album={album} />;
}
