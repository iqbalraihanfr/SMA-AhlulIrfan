'use server';

import { requireAdmin } from '@/lib/auth';
import { beritaSchema, buatSlug, cleanHtml, jadwalPublikasi } from '@/lib/konten';
import { revalidatePath } from 'next/cache';

export async function saveBerita(formData: FormData) {
    const { supabase, user } = await requireAdmin();
    const result = beritaSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) throw new Error(result.error.issues[0]?.message || 'Data berita tidak valid.');
    const { id, judul, slug: inputSlug, ringkasan, isi: isiRaw, status, diterbitkan_pada, image_url } = result.data;
    const slug = inputSlug || buatSlug(judul);
    if (!slug) throw new Error('Isi slug menggunakan huruf atau angka.');
    const isi = cleanHtml(isiRaw);
    if (!isi.replace(/<[^>]*>/g, '').trim() && !isi.includes('<img')) throw new Error('Isi berita wajib diisi.');

    const payload = {
        judul, slug, ringkasan: ringkasan || null, isi, status,
        diterbitkan_pada: jadwalPublikasi(status, diterbitkan_pada),
        image_url, updated_at: new Date().toISOString(),
    };
    const query = id
        ? supabase.from('berita').update(payload).eq('id', id)
        : supabase.from('berita').insert({ ...payload, penulis_id: user.id });
    const { data, error } = await query.select('id').single();
    if (error) throw new Error(error.code === '23505' ? 'Alamat berita sudah digunakan. Ubah slug lalu simpan kembali.' : error.message);
    revalidatePath('/admin/berita');
    revalidatePath('/berita', 'layout');
    revalidatePath('/');
    return { id: data.id, slug };
}
