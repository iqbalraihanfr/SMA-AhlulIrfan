import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import BeritaFormClient from './BeritaFormClient';

export const metadata = {
    title: 'Tulis/Ubah Berita | Admin',
};

export default async function BeritaFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let berita = null;

    if (searchParams.id) {
        const { data } = await supabase.from('berita').select('*').eq('id', searchParams.id).single();
        if (data) {
            berita = {
                id: data.id,
                judul: data.judul,
                slug: data.slug,
                ringkasan: data.ringkasan,
                isi: data.isi,
                status: data.status,
                diterbitkanPada: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : null,
                sampulUrl: data.image_url,
                sampulAlt: data.sampul_alt,
            };
        }
    }

    const pilihanStatus = [
        { value: 'draf', label: 'Draf' },
        { value: 'terbit', label: 'Terbit' },
    ];

    return <BeritaFormClient berita={berita} pilihanStatus={pilihanStatus} />;
}
