import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SiswaFormClient from './SiswaFormClient';

export const metadata = {
    title: 'Form Siswa | Admin',
};

type Props = {
    searchParams: Promise<{ id?: string }>;
};

export default async function SiswaFormPage({ searchParams }: Props) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = await searchParams;
    let siswa = null;

    if (id) {
        const { data, error } = await supabase
            .from('siswa')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching siswa detail:', error.message);
        }
        siswa = data;
    }

    return <SiswaFormClient siswa={siswa} />;
}
