'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { PresensiState, SimpanPresensiPayload, StatusKehadiran } from '@/types/absensi';

/**
 * Zod Enum validasi untuk status kehadiran siswa
 */
export const statusKehadiranEnum = z.enum(
  ['belum_diisi', 'hadir', 'sakit', 'izin', 'alpa', 'terlambat'],
  {
    errorMap: () => ({ message: 'Status kehadiran tidak valid.' }),
  }
);

/**
 * Zod Schema untuk setiap baris kehadiran siswa
 */
export const barisKehadiranSchema = z.object({
  siswa_id: z
    .number({ required_error: 'ID Siswa wajib diisi.' })
    .int('ID Siswa harus bilangan bulat.')
    .positive('ID Siswa tidak valid.'),
  status: statusKehadiranEnum,
  catatan: z
    .string()
    .max(255, 'Catatan siswa maksimal 255 karakter.')
    .optional()
    .nullable(),
});

/**
 * Zod Schema lengkap untuk validasi SimpanPresensiPayload
 */
export const simpanPresensiSchema = z
  .object({
    kelasId: z
      .number({ required_error: 'ID Kelas wajib diisi.' })
      .int('ID Kelas harus bilangan bulat.')
      .positive('ID Kelas tidak valid.'),
    tanggal: z
      .string({ required_error: 'Tanggal wajib diisi.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD.'),
    versi: z
      .number({ required_error: 'Versi dokumen presensi wajib diisi.' })
      .int('Versi harus bilangan bulat.')
      .min(1, 'Versi dokumen presensi minimal 1.'),
    baris: z
      .array(barisKehadiranSchema, {
        required_error: 'Data baris kehadiran wajib disertakan.',
      })
      .min(0),
    selesaikan: z.boolean({
      required_error: 'Status penyelesaian presensi wajib ditentukan.',
    }),
    alasan: z
      .string()
      .max(500, 'Alasan maksimal 500 karakter.')
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Larangan tanggal masa depan menurut zona waktu Asia/Jakarta (WIB)
    const todayWib = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
    }).format(new Date());

    if (data.tanggal > todayWib) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Presensi tidak dapat dicatat untuk tanggal di masa depan.',
        path: ['tanggal'],
      });
    }

    // Jika difinalisasi / diselesaikan, tolak jika ada siswa yang masih berstatus 'belum_diisi'
    if (data.selesaikan) {
      const adaBelumDiisi = data.baris.some((b) => b.status === 'belum_diisi');
      if (adaBelumDiisi) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Seluruh siswa wajib memiliki status kehadiran sebelum presensi diselesaikan.',
          path: ['baris'],
        });
      }
    }

    // Untuk tanggal lampau, alasan koreksi wajib minimal 10 karakter
    if (data.tanggal < todayWib) {
      if (!data.alasan || data.alasan.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Alasan koreksi wajib diisi minimal 10 karakter untuk perubahan tanggal lampau.',
          path: ['alasan'],
        });
      }
    }
  });

/**
 * Server Action untuk menyimpan absensi (draf atau finalisasi).
 * Kompatibel dengan signature React 19 `useActionState`:
 * (prevState: PresensiState, payload: SimpanPresensiPayload) => Promise<PresensiState>
 */
export async function simpanPresensiAction(
  prevState: PresensiState,
  payload: SimpanPresensiPayload
): Promise<PresensiState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: 'error',
        message: 'Sesi Anda telah berakhir. Silakan login kembali.',
      };
    }

    // 1. Validasi payload menggunakan Zod
    const parseResult = simpanPresensiSchema.safeParse(payload);
    if (!parseResult.success) {
      const errors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const key = issue.path.join('.') || 'payload';
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      });

      return {
        status: 'error',
        message: parseResult.error.issues[0]?.message || 'Validasi data presensi gagal.',
        errors,
      };
    }

    const valid = parseResult.data;

    // 2. Eksekusi Stored Procedure / RPC 'simpan_presensi' di database PostgreSQL
    const { data, error } = await supabase.rpc('simpan_presensi', {
      p_kelas_id: valid.kelasId,
      p_tanggal: valid.tanggal,
      p_versi: valid.versi,
      p_baris: valid.baris.map((b) => ({
        siswa_id: b.siswa_id,
        status: b.status,
        catatan: b.catatan?.trim() || null,
      })),
      p_selesaikan: Boolean(valid.selesaikan),
      p_alasan: valid.alasan?.trim() || null,
    });

    if (error) {
      // 3. Tangani Optimistic Concurrency Control (KONFLIK_VERSI)
      const isConflict =
        error.message?.includes('KONFLIK_VERSI') ||
        error.code === 'P0001' ||
        error.details?.includes('KONFLIK_VERSI') ||
        error.hint?.includes('KONFLIK_VERSI');

      if (isConflict) {
        return {
          status: 'conflict',
          message:
            'Data absensi telah diubah oleh pengguna lain. Silakan muat ulang halaman untuk memperbarui data sebelum menyimpan.',
        };
      }

      return {
        status: 'error',
        message: error.message || 'Gagal menyimpan data presensi ke server.',
      };
    }

    // 4. Invalidate cache Next.js
    revalidatePath('/admin/presensi');
    revalidatePath(`/admin/presensi/${valid.kelasId}/${valid.tanggal}`);
    revalidatePath('/admin/rekap');

    return {
      status: 'success',
      message: valid.selesaikan
        ? 'Presensi berhasil diselesaikan dan difinalisasi.'
        : 'Draf presensi berhasil disimpan.',
      data,
    };
  } catch (err: any) {
    return {
      status: 'error',
      message: err?.message || 'Terjadi kesalahan sistem yang tidak terduga.',
    };
  }
}

/**
 * Helper Action untuk mengambil data sesi presensi aktif pada tanggal tertentu
 */
export async function getPresensiSession(kelasId: number, tanggal: string) {
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from('presensi')
    .select(`
      id,
      kelas_id,
      tanggal,
      status,
      dicatat_oleh,
      versi,
      selesai_pada,
      kehadiran_siswa (
        id,
        siswa_id,
        status,
        catatan,
        diubah_oleh
      )
    `)
    .eq('kelas_id', kelasId)
    .eq('tanggal', tanggal)
    .maybeSingle();

  if (error) {
    console.error('Error fetching presensi session:', error);
    return null;
  }

  return session;
}

/**
 * Helper Action untuk mengambil daftar siswa aktif (roster) di kelas pada tanggal tertentu
 */
export async function getPresensiRoster(kelasId: number, tanggal: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('anggota_kelas')
    .select(`
      siswa_id,
      siswa:siswa_id (
        id,
        kode_siswa,
        nama,
        jenis_kelamin,
        aktif
      )
    `)
    .eq('kelas_id', kelasId)
    .lte('mulai_pada', tanggal)
    .or(`selesai_pada.is.null,selesai_pada.gte.${tanggal}`);

  if (error) {
    console.error('Error fetching presensi roster:', error);
    return [];
  }

  return (data || [])
    .map((row: any) => {
      const s = Array.isArray(row.siswa) ? row.siswa[0] : row.siswa;
      return {
        siswa_id: row.siswa_id as number,
        kode_siswa: (s?.kode_siswa as string) || `SIS-${row.siswa_id}`,
        nama: (s?.nama as string) || 'Tanpa Nama',
        jenis_kelamin: ((s?.jenis_kelamin as string) || 'L') as 'L' | 'P',
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
}

/**
 * Helper Action untuk mengambil data detail presensi lengkap (sesi + roster terpadu)
 */
export async function getPresensiDetail(kelasId: number, tanggal: string) {
  const [session, roster] = await Promise.all([
    getPresensiSession(kelasId, tanggal),
    getPresensiRoster(kelasId, tanggal),
  ]);

  const attendanceMap = new Map<number, { status: StatusKehadiran; catatan?: string }>();
  if (session?.kehadiran_siswa) {
    (session.kehadiran_siswa as any[]).forEach((row) => {
      attendanceMap.set(row.siswa_id, {
        status: row.status as StatusKehadiran,
        catatan: row.catatan || undefined,
      });
    });
  }

  const baris = roster.map((siswa) => {
    const existing = attendanceMap.get(siswa.siswa_id);
    return {
      ...siswa,
      status: existing?.status || ('belum_diisi' as StatusKehadiran),
      catatan: existing?.catatan || '',
    };
  });

  return {
    session,
    roster,
    baris,
    versi: session?.versi ?? 1,
    status: session?.status ?? 'draf',
  };
}
