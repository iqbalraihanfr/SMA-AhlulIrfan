'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function savePengguna(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Check if caller is super-admin
    const { data: callerProfile } = await supabase
        .from('users')
        .select('peran')
        .eq('id', user.id)
        .single();

    if (callerProfile?.peran !== 'super-admin') {
        throw new Error('Hanya super-admin yang dapat mengelola akun pengguna.');
    }

    const id = formData.get('id') as string | null;
    const nama = formData.get('nama') as string;
    const email = formData.get('email') as string;
    const peran = (formData.get('peran') as string) || 'admin';
    const guru_id = formData.get('guru_id') ? parseInt(formData.get('guru_id') as string, 10) : null;
    const password = formData.get('password') as string | null;

    if (id) {
        // Update existing user
        const { error: updateError } = await supabase
            .from('users')
            .update({
                nama,
                email,
                peran,
                guru_id,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (updateError) throw new Error(updateError.message);

        // If editing own password
        if (password && id === user.id) {
            const { error: passError } = await supabase.auth.updateUser({ password });
            if (passError) throw new Error(passError.message);
        }
    } else {
        // Create new user
        if (!password || password.length < 6) {
            throw new Error('Kata sandi minimal 6 karakter.');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error('Gagal membuat akun autentikasi.');

        const { error: insertError } = await supabase.from('users').insert({
            id: authData.user.id,
            nama,
            email,
            peran,
            guru_id,
        });

        if (insertError) throw new Error(insertError.message);
    }

    revalidatePath('/admin/pengguna');
    redirect('/admin/pengguna');
}

export async function deletePengguna(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    if (user.id === id) {
        throw new Error('Tidak dapat menghapus akun Anda sendiri.');
    }

    const { data: callerProfile } = await supabase
        .from('users')
        .select('peran')
        .eq('id', user.id)
        .single();

    if (callerProfile?.peran !== 'super-admin') {
        throw new Error('Hanya super-admin yang dapat menghapus akun pengguna.');
    }

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/pengguna');
}
