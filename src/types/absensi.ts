export type StatusKehadiran = 'belum_diisi' | 'hadir' | 'sakit' | 'izin' | 'alpa' | 'terlambat';
export type StatusPresensi = 'draf' | 'selesai';
export type AksiRiwayat = 'buat_draf' | 'simpan_draf' | 'selesaikan' | 'ubah_status';

export interface TahunAjaran {
  id: number;
  nama: string;
  semester: 'ganjil' | 'genap';
  mulai_pada: string;
  selesai_pada: string;
  aktif: boolean;
}

export interface Kelas {
  id: number;
  tahun_ajaran_id: number;
  nama: string;
  tingkat: 10 | 11 | 12;
  wali_kelas_id?: number | null;
  aktif: boolean;
}

export interface Siswa {
  id: number;
  kode_siswa: string;
  nama: string;
  jenis_kelamin: 'L' | 'P';
  aktif: boolean;
}

export interface AnggotaKelas {
  id: number;
  kelas_id: number;
  siswa_id: number;
  mulai_pada: string;
  selesai_pada?: string | null;
}

export interface PresensiSession {
  id: number;
  kelas_id: number;
  tanggal: string;
  status: StatusPresensi;
  dicatat_oleh: string;
  versi: number;
  selesai_pada?: string | null;
}

export interface BarisKehadiran {
  id: number;
  presensi_id: number;
  siswa_id: number;
  status: StatusKehadiran;
  catatan?: string | null;
  diubah_oleh: string;
}

export type PresensiState = {
  status: 'idle' | 'success' | 'conflict' | 'error';
  message?: string;
  errors?: Record<string, string>;
  data?: any;
};

export type ActionFormState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
  message?: string;
};

export interface SimpanPresensiPayload {
  kelasId: number;
  tanggal: string;
  versi: number;
  baris: { siswa_id: number; status: StatusKehadiran; catatan?: string }[];
  selesaikan: boolean;
  alasan?: string;
}
