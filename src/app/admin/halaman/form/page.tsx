import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import HalamanFormClient from './HalamanFormClient';

export const metadata = {
    title: 'Ubah Halaman | Admin',
};

export default async function HalamanFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    if (!searchParams.id) {
        redirect('/admin/halaman');
    }

    const { data: halaman } = await supabase
        .from('konten_halaman')
        .select('*')
        .eq('id', searchParams.id)
        .single();

    if (!halaman) {
        notFound();
    }

    return (
        <HalamanFormClient
            halaman={{
                id: halaman.id,
                kunci: halaman.kunci,
                judul: halaman.judul,
                isi: halaman.isi || '',
                terbit: Boolean(halaman.terbit),
            }}
        />
    );
}
