'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ActionFormState } from '@/types/absensi';

export async function saveSiswa(
    prevState: ActionFormState,
    formData: FormData
): Promise<ActionFormState> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Sesi telah berakhir. Silakan login kembali.' };
    }

    const id = formData.get('id') as string | null;
    const kode_siswa = (formData.get('kode_siswa') as string)?.trim();
    const nama = (formData.get('nama') as string)?.trim();
    const jenis_kelamin_raw = (formData.get('jenis_kelamin') as string)?.trim();
    const jenis_kelamin = jenis_kelamin_raw && ['L', 'P'].includes(jenis_kelamin_raw) ? jenis_kelamin_raw : null;
    const aktif = formData.get('aktif') === 'true' || formData.get('aktif') === 'on';

    if (!kode_siswa) {
        return { error: 'Kode Siswa / Nomor Induk wajib diisi (mis. AI-2026-001).' };
    }

    if (!nama) {
        return { error: 'Nama lengkap siswa wajib diisi.' };
    }

    try {
        const payload = {
            kode_siswa,
            nama,
            jenis_kelamin,
            aktif,
            updated_at: new Date().toISOString(),
        };

        let error;
        if (id) {
            ({ error } = await supabase.from('siswa').update(payload).eq('id', id));
        } else {
            ({ error } = await supabase.from('siswa').insert([payload]));
        }

        if (error) {
            if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
                return { error: `Kode Siswa / NIS "${kode_siswa}" sudah terdaftar.` };
            }
            return { error: error.message };
        }
    } catch (err: any) {
        return { error: err.message || 'Terjadi kesalahan saat menyimpan data siswa.' };
    }

    revalidatePath('/admin/akademik/siswa');
    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik/siswa');
}

export async function deleteSiswa(id: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // Periksa relasi ke anggota_kelas
    const { count: anggotaCount, error: errAnggota } = await supabase
        .from('anggota_kelas')
        .select('*', { count: 'exact', head: true })
        .eq('siswa_id', id);

    if (errAnggota) {
        throw new Error(errAnggota.message);
    }

    if (anggotaCount && anggotaCount > 0) {
        throw new Error(
            `Tidak dapat menghapus siswa karena tercatat di ${anggotaCount} riwayat kelas. Silakan ubah status menjadi nonaktif.`
        );
    }

    // Periksa relasi ke kehadiran_siswa
    const { count: presensiCount, error: errPresensi } = await supabase
        .from('kehadiran_siswa')
        .select('*', { count: 'exact', head: true })
        .eq('siswa_id', id);

    if (errPresensi) {
        throw new Error(errPresensi.message);
    }

    if (presensiCount && presensiCount > 0) {
        throw new Error(
            `Tidak dapat menghapus siswa karena memiliki riwayat absensi. Silakan ubah status menjadi nonaktif.`
        );
    }

    const { error } = await supabase.from('siswa').delete().eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/admin/akademik/siswa');
    revalidatePath('/admin/akademik/roster');
    revalidatePath('/admin/akademik');
}
