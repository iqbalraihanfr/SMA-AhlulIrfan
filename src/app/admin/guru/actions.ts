'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveGuru(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string | null;
    const nama = formData.get('nama') as string;
    const kategori = (formData.get('kategori') as string) || 'pendidik';
    const jenis_kelamin = (formData.get('jenis_kelamin') as string) || null;
    const jabatan = (formData.get('jabatan') as string) || null;
    const mata_pelajaran = (formData.get('mata_pelajaran') as string) || null;
    const urutan = parseInt((formData.get('urutan') as string) || '0', 10);
    const aktif = formData.get('aktif') === 'true' || formData.get('aktif') === 'on';
    const image_url = (formData.get('image_url') as string) || null;

    const payload = {
        nama,
        kategori,
        jenis_kelamin,
        jabatan,
        mata_pelajaran,
        urutan,
        aktif,
        image_url,
        updated_at: new Date().toISOString(),
    };

    let error;

    if (id) {
        ({ error } = await supabase.from('guru').update(payload).eq('id', id));
    } else {
        ({ error } = await supabase.from('guru').insert([payload]));
    }

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/guru');
    revalidatePath('/guru');
    revalidatePath('/profil/struktur-organisasi');
    redirect('/admin/guru');
}

export async function deleteGuru(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('guru').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/guru');
    revalidatePath('/guru');
    revalidatePath('/profil/struktur-organisasi');
}
