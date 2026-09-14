import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminLayoutClient } from './AdminLayoutClient';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // In a real app, you would fetch the user's role and permissions from a profiles table
    // For this migration, we mock it based on the user's metadata or default to super-admin
    const userRole = user.user_metadata?.peran || 'super-admin';
    const userName = user.user_metadata?.nama || user.email || 'Admin';
    const userIzin = user.user_metadata?.izin || {
        'berita.kelola': true,
        'halaman.kelola': true,
        'guru.kelola': true,
        'struktur.kelola': true,
        'ekstrakurikuler.kelola': true,
        'galeri.kelola': true,
        'pengaturan.kelola': true,
        'pengguna.kelola': true,
    };

    // Fetch site settings from database or environment
    const situs = {
        logoUrl: null,
        logoAlt: 'Logo SMA Ahlul Irfan',
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
