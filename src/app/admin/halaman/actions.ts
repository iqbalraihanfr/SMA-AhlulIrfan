'use server';

import { createClient } from '@/lib/supabase/server';
import sanitizeHtml from 'sanitize-html';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveHalaman(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const id = formData.get('id') as string;
    const judul = formData.get('judul') as string;
    const isiRaw = (formData.get('isi') as string) || '';
    const terbit = formData.get('terbit') === 'true' || formData.get('terbit') === 'on';

    const isi = sanitizeHtml(isiRaw, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h2', 'h3', 'iframe', 'blockquote']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'img': ['src', 'alt', 'width', 'height'],
            'iframe': ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
            '*': ['class'],
        },
    });

    const payload = {
        judul,
        isi,
        terbit,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('konten_halaman').update(payload).eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/halaman');
    revalidatePath('/profil');
    revalidatePath('/kurikulum');
    revalidatePath('/');
    redirect('/admin/halaman');
}
