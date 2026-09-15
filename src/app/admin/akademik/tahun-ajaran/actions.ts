'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionFormState } from '@/types/absensi';

export async function saveTahunAjaran(
    prevState: ActionFormState,
    formData: FormData
): Promise<ActionFormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const id = formData.get('id') as string | null;
    const nama = (formData.get('nama') as string)?.trim();
    const semester = (formData.get('semester') as string)?.trim()?.toLowerCase();
    const mulai_pada = (formData.get('mulai_pada') as string)?.trim();
    const selesai_pada = (formData.get('selesai_pada') as string)?.trim();
    const aktif = formData.get('aktif') === 'true' || formData.get('aktif') === 'on';

    if (!nama) {
        return { error: 'Nama tahun ajaran wajib diisi (mis. 2025/2026).' };
    }

    if (!semester || !['ganjil', 'genap'].includes(semester)) {
        return { error: 'Semester harus dipilih (Ganjil atau Genap).' };
    }

    if (!mulai_pada || !selesai_pada) {
        return { error: 'Tanggal mulai dan selesai periode wajib diisi.' };
    }

    if (mulai_pada >= selesai_pada) {
        return { error: 'Tanggal selesai harus setelah tanggal mulai.' };
    }

    try {
        if (aktif) {
            // Pastikan hanya satu tahun ajaran yang berstatus aktif
            if (id) {
                await supabase.from('tahun_ajaran').update({ aktif: false }).neq('id', id);
            } else {
                await supabase.from('tahun_ajaran').update({ aktif: false }).neq('id', 0);
            }
        }

        const payload = {
            nama,
            semester,
            mulai_pada,
            selesai_pada,
            aktif,
            updated_at: new Date().toISOString(),
        };

        let error;
        if (id) {
            ({ error } = await supabase.from('tahun_ajaran').update(payload).eq('id', id));
        } else {
            ({ error } = await supabase.from('tahun_ajaran').insert([payload]));
        }

        if (error) {
            if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
                return { error: `Tahun ajaran "${nama}" semester ${semester} sudah pernah didaftarkan.` };
            }
            return { error: error.message };
        }
    } catch (err: any) {
        return { error: err.message || 'Terjadi kesalahan saat menyimpan data.' };
    }

    revalidatePath('/admin/akademik/tahun-ajaran');
    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik/tahun-ajaran');
}

export async function deleteTahunAjaran(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Periksa apakah ada kelas yang terhubung
    const { count, error: errCount } = await supabase
        .from('kelas')
        .select('*', { count: 'exact', head: true })
        .eq('tahun_ajaran_id', id);

    if (errCount) {
        throw new Error(errCount.message);
    }

    if (count && count > 0) {
        throw new Error(
            `Tidak dapat menghapus tahun ajaran karena masih memiliki ${count} kelas terdaftar. Silakan nonaktifkan saja.`
        );
    }

    const { error } = await supabase.from('tahun_ajaran').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/akademik/tahun-ajaran');
    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik');
}
