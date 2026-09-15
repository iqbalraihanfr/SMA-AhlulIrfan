import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PresensiFormClient, type SiswaRosterItem } from './PresensiFormClient';
import type { StatusKehadiran } from '@/types/absensi';

type Props = {
  params: Promise<{
    kelasId: string;
    tanggal: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kelasId, tanggal } = await params;
  return {
    title: `Isi Presensi Kelas ${kelasId} (${tanggal}) | Admin SMA Ahlul Irfan`,
  };
}

export default async function PresensiClassDatePage({ params }: Props) {
  const { kelasId: rawKelasId, tanggal } = await params;
  const kelasId = Number(rawKelasId);

  // Validasi parameter URL
  if (isNaN(kelasId) || !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('peran, guru_id')
    .eq('id', user.id)
    .single();

  if (!profile) {
    throw new Error('Profil akun tidak ditemukan. Hubungi super-admin.');
  }

  const userRole = profile.peran;
  const userGuruId = profile.guru_id;
  const isGuru = userRole === 'guru';

  // 1. Ambil data kelas beserta wali kelas
  const { data: kelas, error: kelasError } = await supabase
    .from('kelas')
    .select(`
      id,
      nama,
      tingkat,
      wali_kelas_id,
      aktif,
      guru:wali_kelas_id ( id, nama )
    `)
    .eq('id', kelasId)
    .single();

  if (kelasError || !kelas) {
    notFound();
  }

  const isWaliKelas = Boolean(userGuruId && kelas.wali_kelas_id === userGuruId);

  // Kebijakan Otorisasi: Jika akun Guru, hanya boleh mengakses kelas perwaliannya sendiri
  if (isGuru && !isWaliKelas) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-line bg-paper p-8 text-center shadow-card">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mt-4 font-heading text-xl font-bold text-ink">Akses Tidak Diizinkan</h2>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">
          Anda tidak terdaftar sebagai wali kelas untuk <strong>Kelas {kelas.nama}</strong>. Anda hanya diperbolehkan mengisi presensi untuk kelas yang Anda ampu.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/presensi"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Kembali ke Halaman Presensi
          </Link>
        </div>
      </div>
    );
  }

  // Waktu Asia/Jakarta (WIB)
  const todayWib = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const isPastDate = tanggal < todayWib;
  const isFutureDate = tanggal > todayWib;
  const isReadOnly = isFutureDate || (isGuru && isPastDate);

  // 2. Ambil sesi presensi yang sudah ada (jika ada)
  const { data: session } = await supabase
    .from('presensi')
    .select(`
      id,
      kelas_id,
      tanggal,
      status,
      versi,
      selesai_pada,
      dicatat_oleh
    `)
    .eq('kelas_id', kelasId)
    .eq('tanggal', tanggal)
    .maybeSingle();

  // 3. Ambil baris kehadiran dari database jika sesi sudah dibuat
  const barisKehadiranMap = new Map<number, { status: StatusKehadiran; catatan?: string }>();
  if (session) {
    const { data: existingRows } = await supabase
      .from('kehadiran_siswa')
      .select('siswa_id, status, catatan')
      .eq('presensi_id', session.id);

    (existingRows || []).forEach((row) => {
      barisKehadiranMap.set(row.siswa_id, {
        status: row.status as StatusKehadiran,
        catatan: row.catatan || undefined,
      });
    });
  }

  // 4. Ambil anggota kelas aktif pada tanggal ini
  const { data: anggotaKelasRaw } = await supabase
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

  // Susun roster siswa lengkap dan urutkan berdasarkan nama
  const initialBaris: SiswaRosterItem[] = (anggotaKelasRaw || [])
    .map((row: any) => {
      const siswaData = Array.isArray(row.siswa) ? row.siswa[0] : row.siswa;
      const existing = barisKehadiranMap.get(row.siswa_id);

      return {
        siswa_id: row.siswa_id,
        kode_siswa: siswaData?.kode_siswa || `SIS-${row.siswa_id}`,
        nama: siswaData?.nama || 'Tanpa Nama',
        jenis_kelamin: (siswaData?.jenis_kelamin || 'L') as 'L' | 'P',
        status: existing?.status || 'belum_diisi',
        catatan: existing?.catatan || '',
      };
    })
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  const waliKelasNama = Array.isArray(kelas.guru)
    ? kelas.guru[0]?.nama
    : (kelas.guru as any)?.nama || 'Belum ditentukan';

  const tanggalFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(tanggal + 'T00:00:00+07:00'));

  return (
    <PresensiFormClient
      kelas={{
        id: kelas.id,
        nama: kelas.nama,
        tingkat: kelas.tingkat,
        waliKelasNama,
      }}
      tanggal={tanggal}
      tanggalFormatted={tanggalFormatted}
      session={
        session
          ? {
              id: session.id,
              versi: session.versi,
              status: session.status as 'draf' | 'selesai',
              selesai_pada: session.selesai_pada,
            }
          : null
      }
      initialBaris={initialBaris}
      isGuru={isGuru}
      isPastDate={isPastDate}
      isFutureDate={isFutureDate}
      isReadOnly={isReadOnly}
    />
  );
}
