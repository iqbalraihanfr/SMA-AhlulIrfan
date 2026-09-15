'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function savePengaturan(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const nama_sekolah = (formData.get('nama_sekolah') as string) || 'SMA Ahlul Irfan Bangsalsari';
    const nama_yayasan = (formData.get('nama_yayasan') as string) || null;
    const semboyan = (formData.get('semboyan') as string) || null;
    const npsn = (formData.get('npsn') as string) || null;
    const akreditasi = (formData.get('akreditasi') as string) || null;
    const alamat = (formData.get('alamat') as string) || null;
    const telepon = (formData.get('telepon') as string) || null;
    const whatsapp = (formData.get('whatsapp') as string) || null;
    const email = (formData.get('email') as string) || null;
    const peta_lat_raw = formData.get('peta_lat') as string;
    const peta_lng_raw = formData.get('peta_lng') as string;
    const peta_lat = peta_lat_raw ? parseFloat(peta_lat_raw) : null;
    const peta_lng = peta_lng_raw ? parseFloat(peta_lng_raw) : null;
    const instagram = (formData.get('instagram') as string) || null;
    const facebook = (formData.get('facebook') as string) || null;
    const youtube = (formData.get('youtube') as string) || null;
    const logo_url = (formData.get('logo_url') as string) || null;

    const payload = {
        id: 1,
        nama_sekolah,
        nama_yayasan,
        semboyan,
        npsn,
        akreditasi,
        alamat,
        telepon,
        whatsapp,
        email,
        peta_lat,
        peta_lng,
        instagram,
        facebook,
        youtube,
        logo_url,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('pengaturan_situs')
        .upsert([payload], { onConflict: 'id' });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/pengaturan');
    revalidatePath('/kontak');
    revalidatePath('/');
    redirect('/admin/pengaturan');
}
