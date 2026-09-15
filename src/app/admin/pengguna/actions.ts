'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const penggunaSchema = z.object({
    id: z.preprocess((value) => value || undefined, z.string().uuid().optional()),
    nama: z.string().trim().min(1, 'Nama wajib diisi.').max(120, 'Nama maksimal 120 karakter.'),
    email: z.string().trim().email('Email tidak valid.').transform((email) => email.toLowerCase()),
    peran: z.enum(['super-admin', 'admin', 'guru']),
    guru_id: z.preprocess(
        (value) => value || null,
        z.coerce.number().int().positive().nullable(),
    ),
    password: z.preprocess(
        (value) => value || undefined,
        z.string().min(6, 'Kata sandi minimal 6 karakter.').optional(),
    ),
});

const hapusPenggunaSchema = z.object({
    id: z.string().uuid('ID akun tidak valid.'),
    konfirmasiEmail: z.string().max(320),
});

function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Supabase admin credentials (NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY) belum dikonfigurasi di file environment.');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });
}

export async function savePengguna(formData: FormData) {
    const supabase = await createServerClient();
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

    const result = penggunaSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        throw new Error(result.error.issues[0]?.message || 'Data akun tidak valid.');
    }

    const { id, nama, email, peran, password } = result.data;
    const guru_id = peran === 'guru' ? result.data.guru_id : null;
    if (peran === 'guru' && !guru_id) {
        throw new Error('Akun guru wajib ditautkan ke data guru.');
    }

    if (id) {
        const { data: penggunaLama, error: penggunaError } = await supabase
            .from('users')
            .select('nama, email, peran, guru_id')
            .eq('id', id)
            .single();

        if (penggunaError) throw new Error(penggunaError.message);

        if (penggunaLama.peran === 'super-admin' && peran !== 'super-admin') {
            const { count, error: countError } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('peran', 'super-admin');

            if (countError) throw new Error(countError.message);
            if ((count ?? 0) <= 1) {
                throw new Error('Super-admin terakhir tidak dapat diturunkan perannya.');
            }
        }

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

        if (email !== penggunaLama.email || password) {
            const { error: authError } = await getSupabaseAdmin().auth.admin.updateUserById(id, {
                email,
                email_confirm: true,
                ...(password ? { password } : {}),
            });

            if (authError) {
                await supabase.from('users').update(penggunaLama).eq('id', id);
                throw new Error(authError.message);
            }
        }
    } else {
        if (!password) throw new Error('Kata sandi wajib diisi.');

        const supabaseAdmin = getSupabaseAdmin();
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
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

        if (insertError) {
            // Rollback newly created auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            throw new Error(insertError.message);
        }
    }

    revalidatePath('/admin/pengguna');
    redirect('/admin/pengguna');
}

export async function deletePengguna(id: string, konfirmasiEmail: string) {
    const hasilValidasi = hapusPenggunaSchema.safeParse({ id, konfirmasiEmail });
    if (!hasilValidasi.success) {
        throw new Error(hasilValidasi.error.issues[0]?.message || 'Permintaan hapus tidak valid.');
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    if (user.id === hasilValidasi.data.id) {
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

    const { data: target, error: targetError } = await supabase
        .from('users')
        .select('email')
        .eq('id', hasilValidasi.data.id)
        .single();

    if (targetError) throw new Error(targetError.message);
    if (hasilValidasi.data.konfirmasiEmail.trim() !== target.email) {
        throw new Error('Email konfirmasi tidak cocok. Akun tidak dihapus.');
    }

    // Relasi users.id memakai ON DELETE CASCADE, jadi profil ikut terhapus hanya
    // setelah penghapusan akun Auth berhasil.
    const { error: authError } = await getSupabaseAdmin().auth.admin.deleteUser(hasilValidasi.data.id);

    if (authError) {
        throw new Error(authError.message);
    }

    revalidatePath('/admin/pengguna');
}
