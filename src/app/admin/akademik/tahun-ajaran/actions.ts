'use server';

import { requireAdmin } from '@/lib/auth';
import { tanggalSchema } from '@/lib/konten';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionFormState } from '@/types/absensi';

export async function saveTahunAjaran(
    prevState: ActionFormState,
    formData: FormData
): Promise<ActionFormState> {
    let supabase;
    try { ({ supabase } = await requireAdmin()); }
    catch (error) { return { error: error instanceof Error ? error.message : 'Tidak memiliki izin.' }; }

    const id = formData.get('id') as string | null;
    const nama = (formData.get('nama') as string)?.trim();
    const semester = (formData.get('semester') as string)?.trim()?.toLowerCase();
    const mulai_pada = (formData.get('mulai_pada') as string)?.trim();
    const selesai_pada = (formData.get('selesai_pada') as string)?.trim();
    const aktif = formData.get('aktif') === 'true' || formData.get('aktif') === 'on';

    if (!nama || nama.length > 20) {
        return { error: 'Nama tahun ajaran wajib diisi (mis. 2025/2026).' };
    }

    if (!semester || !['ganjil', 'genap'].includes(semester)) {
        return { error: 'Semester harus dipilih (Ganjil atau Genap).' };
    }

    if (!tanggalSchema.safeParse(mulai_pada).success || !tanggalSchema.safeParse(selesai_pada).success) {
        return { error: 'Tanggal mulai dan selesai periode wajib diisi.' };
    }

    if (!mulai_pada || !selesai_pada || mulai_pada >= selesai_pada) {
        return { error: 'Tanggal selesai harus setelah tanggal mulai.' };
    }

    try {
        if (id && (!/^\d+$/.test(id) || Number(id) < 1)) return { error: 'ID tahun ajaran tidak valid.' };
        const { error } = await supabase.rpc('simpan_tahun_ajaran', {
            p_id: id ? Number(id) : null,
            p_nama: nama,
            p_semester: semester,
            p_mulai_pada: mulai_pada,
            p_selesai_pada: selesai_pada,
            p_aktif: aktif,
        });

        if (error) {
            if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
                return { error: `Tahun ajaran "${nama}" semester ${semester} sudah pernah didaftarkan.` };
            }
            return { error: error.message };
        }
    } catch (err) {
        return { error: err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data.' };
    }

    revalidatePath('/admin/akademik/tahun-ajaran');
    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik/tahun-ajaran');
}

export async function deleteTahunAjaran(id: number) {
    const { supabase } = await requireAdmin();
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('ID tahun ajaran tidak valid.');

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
