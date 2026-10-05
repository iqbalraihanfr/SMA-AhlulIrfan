import { z } from 'zod'

import { tanggalSchema } from './konten'

export const rekapFilterSchema = z.object({
  tahun_ajaran_id: z.coerce.number().int().positive(),
  kelas_id: z.preprocess((value) => value || null, z.coerce.number().int().positive().nullable()),
  mulai: tanggalSchema,
  selesai: tanggalSchema,
}).refine((value) => value.selesai >= value.mulai && Date.parse(value.selesai) - Date.parse(value.mulai) <= 366 * 86400000,
  'Tanggal akhir harus setelah tanggal awal, dengan rentang maksimal satu tahun.')

export type BarisRekap = {
  kelas_id: number; siswa_id: number; kelas: string; kode_siswa: string; nama: string;
  hadir: number; sakit: number; izin: number; alpa: number; terlambat: number; total: number; persentase: number;
}

export function buatCsv(baris: BarisRekap[]): string {
  const cell = (value: string | number) => {
    let text = String(value)
    if (/^[\s\u0000-\u001f]*[=+\-@]|^[\t\r\n]/.test(text)) text = `'${text}`
    return `"${text.replaceAll('"', '""')}"`
  }
  const rows = [
    ['Kelas', 'Kode Siswa', 'Nama', 'Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat', 'Total', 'Kehadiran (%)'],
    ...baris.map((r) => [r.kelas, r.kode_siswa, r.nama, r.hadir, r.sakit, r.izin, r.alpa, r.terlambat, r.total, r.persentase]),
  ]
  return '\uFEFF' + rows.map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n'
}
