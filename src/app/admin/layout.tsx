import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminLayoutClient } from './AdminLayoutClient';
import { hitungIzin } from '@/lib/nav-admin';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Ambil data profil peran dan nama pengguna aktual dari tabel public.users
    const [{ data: profile }, { data: pengaturan }] = await Promise.all([
        supabase
            .from('users')
            .select('nama, peran')
            .eq('id', user.id)
            .maybeSingle(),
        supabase
            .from('pengaturan_situs')
            .select('logo_url, nama_sekolah')
            .limit(1)
            .maybeSingle(),
    ]);

    if (!profile) {
        throw new Error('Profil akun tidak ditemukan. Hubungi super-admin.');
    }

    const userRole = profile.peran;
    const userName = profile.nama;

    // Berdasarkan peran ('super-admin', 'admin', 'guru'), atur boolean flags izin yang sesuai
    const userIzin = hitungIzin(userRole);

    // Ambil logo sekolah dari pengaturan situs agar tampil di header sidebar admin
    const logoUrl = pengaturan?.logo_url || 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/logo-sma.webp';
    const logoAlt = pengaturan?.nama_sekolah ? `Logo ${pengaturan.nama_sekolah}` : 'Logo SMA Ahlul Irfan';

    const situs = {
        logoUrl,
        logoAlt,
        urlPublik: process.env.NEXT_PUBLIC_SITE_URL || '/',
    };

    const userInfo = {
        nama: userName,
        peran: userRole,
        izin: userIzin,
    };

    return (
        <AdminLayoutClient user={userInfo} situs={situs}>
            {children}
        </AdminLayoutClient>
    );
}
