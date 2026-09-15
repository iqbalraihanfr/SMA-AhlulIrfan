import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PengaturanFormClient from './PengaturanFormClient';

export const metadata = {
    title: 'Pengaturan Situs | Admin',
};

export default async function PengaturanPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: settings } = await supabase
        .from('pengaturan_situs')
        .select('*')
        .limit(1)
        .single();

    const pengaturan = settings || {
        nama_sekolah: 'SMA Ahlul Irfan Bangsalsari',
        nama_yayasan: null,
        semboyan: null,
        npsn: null,
        akreditasi: null,
        alamat: null,
        telepon: null,
        whatsapp: null,
        email: null,
        peta_lat: null,
        peta_lng: null,
        instagram: null,
        facebook: null,
        youtube: null,
        logo_url: null,
    };

    return <PengaturanFormClient pengaturan={pengaturan} />;
}
