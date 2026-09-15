import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TahunAjaranFormClient from './TahunAjaranFormClient';

export const metadata = {
    title: 'Form Tahun Ajaran | Admin',
};

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export default async function TahunAjaranFormPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = await searchParams;
    let tahunAjaran = null;

    if (id) {
        const { data, error } = await supabase
            .from('tahun_ajaran')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching tahun_ajaran detail:', error.message);
        }
        tahunAjaran = data;
    }

    return <TahunAjaranFormClient tahunAjaran={tahunAjaran} />;
}
