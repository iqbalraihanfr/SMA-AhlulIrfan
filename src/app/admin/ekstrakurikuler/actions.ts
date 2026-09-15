'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveEkstrakurikuler(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string | null;
    const nama = formData.get('nama') as string;
    let slug = formData.get('slug') as string;
    const deskripsi = (formData.get('deskripsi') as string) || null;
    const pembina = (formData.get('pembina') as string) || null;
    const jadwal = (formData.get('jadwal') as string) || null;
    const urutan = parseInt((formData.get('urutan') as string) || '0', 10);
    const image_url = (formData.get('image_url') as string) || null;

    if (!slug) {
        slug = nama
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    const payload = {
        nama,
        slug,
        deskripsi,
        pembina,
        jadwal,
        urutan,
        image_url,
        updated_at: new Date().toISOString(),
    };

    let error;

    if (id) {
        ({ error } = await supabase.from('ekstrakurikuler').update(payload).eq('id', id));
    } else {
        ({ error } = await supabase.from('ekstrakurikuler').insert([payload]));
    }

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/ekstrakurikuler');
    revalidatePath('/ekstrakurikuler');
    redirect('/admin/ekstrakurikuler');
}

export async function deleteEkstrakurikuler(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('ekstrakurikuler').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/ekstrakurikuler');
    revalidatePath('/ekstrakurikuler');
}
