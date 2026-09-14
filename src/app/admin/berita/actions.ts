'use server';

import { createClient } from '@/lib/supabase/server';
import sanitizeHtml from 'sanitize-html';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveBerita(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string | null;
    const judul = formData.get('judul') as string;
    let slug = formData.get('slug') as string;
    const ringkasan = formData.get('ringkasan') as string;
    const isiRaw = formData.get('isi') as string;
    const status = formData.get('status') as string;
    const diterbitkan_pada = formData.get('diterbitkan_pada') as string;
    const image_url = formData.get('image_url') as string;
    const sampul_alt = formData.get('sampul_alt') as string;

    if (!slug) {
        slug = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const isi = sanitizeHtml(isiRaw, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h2', 'h3', 'iframe']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'img': ['src', 'alt', 'width', 'height'],
            'iframe': ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
        }
    });

    const payload = {
        judul,
        slug,
        ringkasan: ringkasan || null,
        isi,
        status,
        created_at: diterbitkan_pada ? new Date(diterbitkan_pada).toISOString() : new Date().toISOString(),
        image_url: image_url || null,
        sampul_alt: sampul_alt || null,
    };

    let error;

    if (id) {
        ({ error } = await supabase.from('berita').update(payload).eq('id', id));
    } else {
        ({ error } = await supabase.from('berita').insert([payload]));
    }

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/berita');
    redirect('/admin/berita');
}
