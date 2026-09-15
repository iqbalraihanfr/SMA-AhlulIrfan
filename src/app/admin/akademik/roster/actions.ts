'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionFormState } from '@/types/absensi';

export async function saveRoster(
    prevState: ActionFormState,
    formData: FormData
): Promise<ActionFormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const id = formData.get('id') as string | null;
    const kelas_id = parseInt(formData.get('kelas_id') as string, 10);
    const siswa_id = parseInt(formData.get('siswa_id') as string, 10);
    const mulai_pada = (formData.get('mulai_pada') as string)?.trim();
    const selesai_pada_raw = (formData.get('selesai_pada') as string)?.trim();
    const selesai_pada = selesai_pada_raw && selesai_pada_raw !== '' ? selesai_pada_raw : null;

    if (!kelas_id || isNaN(kelas_id)) {
        return { error: 'Kelas wajib dipilih.' };
    }

    if (!siswa_id || isNaN(siswa_id)) {
        return { error: 'Siswa wajib dipilih.' };
    }

    if (!mulai_pada) {
        return { error: 'Tanggal mulai keanggotaan kelas wajib diisi.' };
    }

    if (selesai_pada && selesai_pada < mulai_pada) {
        return { error: 'Tanggal selesai keanggotaan tidak boleh mendahului tanggal mulai.' };
    }

    try {
        // Cek apakah siswa sudah aktif di kelas yang sama
        let checkQuery = supabase
            .from('anggota_kelas')
            .select('id, selesai_pada')
            .eq('kelas_id', kelas_id)
            .eq('siswa_id', siswa_id);

        if (id) {
            checkQuery = checkQuery.neq('id', id);
        }

        const { data: existingMembers } = await checkQuery;
        if (existingMembers && existingMembers.length > 0) {
            const hasActive = existingMembers.some((m) => !m.selesai_pada || m.selesai_pada >= mulai_pada);
            if (hasActive) {
                return { error: 'Siswa ini sudah terdaftar aktif di kelas ini.' };
            }
        }

        const payload = {
            kelas_id,
            siswa_id,
            mulai_pada,
            selesai_pada,
            updated_at: new Date().toISOString(),
        };

        let error;
        if (id) {
            ({ error } = await supabase.from('anggota_kelas').update(payload).eq('id', id));
        } else {
            ({ error } = await supabase.from('anggota_kelas').insert([payload]));
        }

        if (error) {
            return { error: error.message };
        }
    } catch (err: any) {
        return { error: err.message || 'Terjadi kesalahan saat menyimpan keanggotaan kelas.' };
    }

    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik');
    redirect(`/admin/akademik/roster?kelas_id=${kelas_id}`);
}

export async function deleteRoster(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const { error } = await supabase.from('anggota_kelas').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik');
}
