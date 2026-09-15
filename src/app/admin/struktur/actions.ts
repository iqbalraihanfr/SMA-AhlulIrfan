'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveStruktur(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string | null;
    const label = formData.get('label') as string;
    const tipe = (formData.get('tipe') as string) || 'orang';
    const guru_id = formData.get('guru_id') ? parseInt(formData.get('guru_id') as string, 10) : null;
    const nama_luar = (formData.get('nama_luar') as string) || null;
    const atasan_id = formData.get('atasan_id') ? parseInt(formData.get('atasan_id') as string, 10) : null;
    const baris = parseInt((formData.get('baris') as string) || '1', 10);
    const urutan = parseInt((formData.get('urutan') as string) || '0', 10);

    const payload = {
        label,
        tipe,
        guru_id: tipe === 'orang' ? guru_id : null,
        nama_luar: tipe === 'penasihat' ? nama_luar : null,
        atasan_id,
        baris,
        urutan,
        updated_at: new Date().toISOString(),
    };

    let error;

    if (id) {
        ({ error } = await supabase.from('struktur_organisasi').update(payload).eq('id', id));
    } else {
        ({ error } = await supabase.from('struktur_organisasi').insert([payload]));
    }

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/struktur');
    revalidatePath('/profil/struktur-organisasi');
    redirect('/admin/struktur');
}

export async function deleteStruktur(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('struktur_organisasi').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/struktur');
    revalidatePath('/profil/struktur-organisasi');
}
