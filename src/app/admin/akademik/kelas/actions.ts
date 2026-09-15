'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionFormState } from '@/types/absensi';

export async function saveKelas(
    prevState: ActionFormState,
    formData: FormData
): Promise<ActionFormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const id = formData.get('id') as string | null;
    const tahun_ajaran_id = parseInt(formData.get('tahun_ajaran_id') as string, 10);
    const nama = (formData.get('nama') as string)?.trim();
    const tingkat = parseInt(formData.get('tingkat') as string, 10);
    const wali_kelas_raw = formData.get('wali_kelas_id') as string | null;
    const wali_kelas_id = wali_kelas_raw && wali_kelas_raw !== '' ? parseInt(wali_kelas_raw, 10) : null;
    const aktif = formData.get('aktif') === 'true' || formData.get('aktif') === 'on';

    if (!tahun_ajaran_id || isNaN(tahun_ajaran_id)) {
        return { error: 'Tahun ajaran wajib dipilih.' };
    }

    if (!nama) {
        return { error: 'Nama kelas wajib diisi (mis. X-A atau XI MIPA 1).' };
    }

    if (![10, 11, 12].includes(tingkat)) {
        return { error: 'Tingkat kelas harus 10, 11, atau 12.' };
    }

    try {
        const payload = {
            tahun_ajaran_id,
            nama,
            tingkat,
            wali_kelas_id,
            aktif,
            updated_at: new Date().toISOString(),
        };

        let error;
        if (id) {
            ({ error } = await supabase.from('kelas').update(payload).eq('id', id));
        } else {
            ({ error } = await supabase.from('kelas').insert([payload]));
        }

        if (error) {
            if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
                return { error: `Kelas "${nama}" sudah terdaftar pada tahun ajaran ini.` };
            }
            return { error: error.message };
        }
    } catch (err: any) {
        return { error: err.message || 'Terjadi kesalahan saat menyimpan data kelas.' };
    }

    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik/kelas');
}

export async function deleteKelas(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Periksa relasi ke anggota_kelas
    const { count: anggotaCount, error: errAnggota } = await supabase
        .from('anggota_kelas')
        .select('*', { count: 'exact', head: true })
        .eq('kelas_id', id);

    if (errAnggota) {
        throw new Error(errAnggota.message);
    }

    if (anggotaCount && anggotaCount > 0) {
        throw new Error(
            `Tidak dapat menghapus kelas karena memiliki ${anggotaCount} siswa terdaftar. Silakan nonaktifkan kelas.`
        );
    }

    // Periksa relasi ke presensi
    const { count: presensiCount, error: errPresensi } = await supabase
        .from('presensi')
        .select('*', { count: 'exact', head: true })
        .eq('kelas_id', id);

    if (errPresensi) {
        throw new Error(errPresensi.message);
    }

    if (presensiCount && presensiCount > 0) {
        throw new Error(
            `Tidak dapat menghapus kelas karena memiliki ${presensiCount} riwayat sesi absensi. Silakan nonaktifkan kelas.`
        );
    }

    const { error } = await supabase.from('kelas').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/akademik/kelas');
    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik');
}
