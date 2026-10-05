import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
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
        if (!/^\d+$/.test(searchParams.id) || Number(searchParams.id) < 1) notFound();
        const { data, error } = await supabase.from('berita').select('*').eq('id', searchParams.id).single();
        if (error?.code === 'PGRST116' || (!error && !data)) notFound();
        if (error) throw new Error('Berita gagal dimuat. Silakan coba kembali.');
        if (data) {
            berita = {
                id: data.id,
                judul: data.judul,
                slug: data.slug,
                ringkasan: data.ringkasan,
                isi: data.isi,
                status: data.status,
                diterbitkanPada: data.diterbitkan_pada ? new Date(new Date(data.diterbitkan_pada).getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16) : null,
                sampulUrl: data.image_url,
            };
        }
    }

    const pilihanStatus = [
        { value: 'draft', label: 'Draf' },
        { value: 'terbit', label: 'Terbit' },
    ];

    return <BeritaFormClient berita={berita} pilihanStatus={pilihanStatus} />;
}
