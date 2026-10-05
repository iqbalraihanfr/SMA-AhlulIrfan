'use server';

import { requireAdmin } from '@/lib/auth';
import { albumSchema, buatSlug } from '@/lib/konten';
import { revalidatePath } from 'next/cache';

export async function saveAlbum(formData: FormData) {
    const { supabase } = await requireAdmin();
    const result = albumSchema.safeParse({ ...Object.fromEntries(formData), foto_urls: formData.getAll('foto_urls') });
    if (!result.success) throw new Error(result.error.issues[0]?.message || 'Data album tidak valid.');
    const { id, judul, slug: inputSlug, deskripsi, urutan, foto_urls } = result.data;
    const slug = inputSlug || buatSlug(judul);
    if (!slug) throw new Error('Isi slug menggunakan huruf atau angka.');
    const payload = {
        judul, slug, deskripsi: deskripsi || null, urutan,
        foto_urls: [...new Set(foto_urls)], image_url: foto_urls[0] || null,
        updated_at: new Date().toISOString(),
    };
    const query = id ? supabase.from('album').update(payload).eq('id', id) : supabase.from('album').insert(payload);
    const { data, error } = await query.select('id').single();
    if (error) throw new Error(error.code === '23505' ? 'Alamat album sudah digunakan. Ubah slug lalu simpan kembali.' : error.message);
    revalidatePath('/admin/galeri');
    revalidatePath('/galeri', 'layout');
    revalidatePath('/');
    return { id: data.id, slug };
}

export async function deleteAlbum(id: number) {
    const { supabase } = await requireAdmin();
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('ID album tidak valid.');

    const { error } = await supabase.from('album').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/galeri');
    revalidatePath('/galeri');
}
