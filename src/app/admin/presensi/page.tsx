import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Kartu, Tombol, EmptyState } from '@/components/Ui';
import { PresensiDateFilter } from './components/PresensiDateFilter';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  searchParams: Promise<{ tanggal?: string }>;
}

function formatTanggalLengkap(tglString: string): string {
  try {
    const d = new Date(tglString + 'T00:00:00+07:00');
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(d);
  } catch {
    return tglString;
  }
}

export const metadata = {
  title: 'Presensi Siswa Harian | Panel Admin SMA Ahlul Irfan',
};

export default async function AdminPresensiDashboardPage({ searchParams }: Props) {
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

  const todayWib = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
  const resolvedParams = await searchParams;
  const tanggalDipilih =
    resolvedParams.tanggal && /^\d{4}-\d{2}-\d{2}$/.test(resolvedParams.tanggal)
      ? resolvedParams.tanggal
      : todayWib;

  const adalahHariIni = tanggalDipilih === todayWib;

  // 1. Ambil tahun ajaran aktif
  const { data: tahunAjaranAktif } = await supabase
    .from('tahun_ajaran')
    .select('id, nama, semester, mulai_pada, selesai_pada, aktif')
    .eq('aktif', true)
    .maybeSingle();

  // 2. Ambil seluruh kelas aktif beserta data guru wali kelas
  const { data: kelasListRaw } = await supabase
    .from('kelas')
    .select(`
      id,
      tahun_ajaran_id,
      nama,
      tingkat,
      wali_kelas_id,
      aktif,
      guru:wali_kelas_id ( id, nama )
    `)
    .eq('aktif', true)
    .order('tingkat', { ascending: true })
    .order('nama', { ascending: true });

  const kelasList = kelasListRaw || [];

  // 3. Ambil sesi presensi untuk tanggal yang dipilih
  const { data: presensiListRaw } = await supabase
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
    .eq('tanggal', tanggalDipilih);

  const presensiList = presensiListRaw || [];
  const presensiIds = presensiList.map((p) => p.id);

  // 4. Ambil ringkasan baris kehadiran untuk sesi-sesi pada tanggal ini
  let kehadiranRows: Array<{ presensi_id: number; status: string }> = [];
  if (presensiIds.length > 0) {
    const { data: baris } = await supabase
      .from('kehadiran_siswa')
      .select('presensi_id, status')
      .in('presensi_id', presensiIds);
    kehadiranRows = baris || [];
  }

  // 5. Hitung jumlah anggota siswa aktif per kelas
  const { data: anggotaKelasRaw } = await supabase
    .from('anggota_kelas')
    .select('kelas_id, siswa_id')
    .lte('mulai_pada', tanggalDipilih)
    .or(`selesai_pada.is.null,selesai_pada.gte.${tanggalDipilih}`);

  const anggotaCountMap = new Map<number, number>();
  (anggotaKelasRaw || []).forEach((row) => {
    anggotaCountMap.set(row.kelas_id, (anggotaCountMap.get(row.kelas_id) || 0) + 1);
  });

  // Susun data gabungan kelas + status presensi
  const kelasWithStatus = kelasList.map((kelas) => {
    const session = presensiList.find((p) => p.kelas_id === kelas.id);
    const totalSiswa = anggotaCountMap.get(kelas.id) || 0;

    let statusPresensi: 'belum_diisi' | 'draf' | 'selesai' = 'belum_diisi';
    const breakdown = {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpa: 0,
      terlambat: 0,
      belum_diisi: 0,
    };

    if (session) {
      statusPresensi = session.status === 'selesai' ? 'selesai' : 'draf';
      const rows = kehadiranRows.filter((r) => r.presensi_id === session.id);
      rows.forEach((r) => {
        if (r.status in breakdown) {
          breakdown[r.status as keyof typeof breakdown]++;
        }
      });
    }

    const waliKelasNama = Array.isArray(kelas.guru)
      ? kelas.guru[0]?.nama
      : (kelas.guru as any)?.nama || 'Belum ditentukan';

    const isWaliKelasUser = Boolean(userGuruId && kelas.wali_kelas_id === userGuruId);

    return {
      ...kelas,
      waliKelasNama,
      isWaliKelasUser,
      session,
      statusPresensi,
      totalSiswa,
      breakdown,
    };
  });

  // Kelas wali guru yang login (jika akun guru)
  const kelasWaliGuru = kelasWithStatus.find((k) => k.isWaliKelasUser);

  // Metrik ringkasan untuk Admin
  const totalKelas = kelasWithStatus.length;
  const totalSelesai = kelasWithStatus.filter((k) => k.statusPresensi === 'selesai').length;
  const totalDraf = kelasWithStatus.filter((k) => k.statusPresensi === 'draf').length;
  const totalBelumDiisi = kelasWithStatus.filter((k) => k.statusPresensi === 'belum_diisi').length;

  return (
    <div className="space-y-6">
      {/* Header Utama */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Presensi Siswa Harian
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Pencatatan kehadiran harian per kelas (WIB) — {formatTanggalLengkap(tanggalDipilih)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PresensiDateFilter
            tanggalDipilih={tanggalDipilih}
            tanggalHariIni={todayWib}
          />
          <Link href="/admin/rekap" className="w-full sm:w-auto">
            <Tombol variasi="garis" type="button" className="w-full justify-center sm:w-auto min-h-[44px]">
              Rekap Kehadiran
            </Tombol>
          </Link>
        </div>
      </div>

      {/* Tahun Ajaran Alert bila belum aktif */}
      {!tahunAjaranAktif && (
        <div className="flex items-center gap-3 rounded-lg border border-line bg-paper-sunken p-4 text-sm text-ink-muted">
          <AlertCircle className="size-5 text-highlight shrink-0" />
          <span>
            Perhatian: Belum ada tahun ajaran yang ditandai aktif. Silakan hubungi admin akademik untuk mengaktifkan periode ajaran.
          </span>
        </div>
      )}

      {/* Khusus Tampilan Guru: Sorotan Kelas Perwalian */}
      {isGuru && (
        <div className="rounded-xl border border-brand/30 bg-brand-soft p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-on-brand">
                <Sparkles className="size-3.5" />
                Tugas Wali Kelas Anda
              </span>
              <h2 className="font-heading text-xl font-bold text-ink">
                {kelasWaliGuru ? `Kelas ${kelasWaliGuru.nama}` : 'Belum Ditugaskan Kelas'}
              </h2>
              <p className="text-sm text-ink-muted">
                {kelasWaliGuru
                  ? `Tingkat ${kelasWaliGuru.tingkat} • ${kelasWaliGuru.totalSiswa} Siswa terdaftar`
                  : 'Akun Anda belum dipasangkan dengan kelas perwalian aktif. Hubungi Super Admin jika terdapat kekeliruan penugasan.'}
              </p>
            </div>

            {kelasWaliGuru && (
              <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    kelasWaliGuru.statusPresensi === 'selesai'
                      ? 'bg-paper text-success border border-success/30'
                      : kelasWaliGuru.statusPresensi === 'draf'
                      ? 'bg-paper text-highlight border border-highlight/30'
                      : 'bg-paper text-ink-muted border border-line'
                  }`}
                >
                  {kelasWaliGuru.statusPresensi === 'selesai'
                    ? '✓ Selesai'
                    : kelasWaliGuru.statusPresensi === 'draf'
                    ? '✎ Masih Draf'
                    : '○ Belum Diisi'}
                </span>
              </div>
            )}
          </div>

          {kelasWaliGuru && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-brand/20 pt-4">
              <p className="text-xs text-ink-muted">
                {adalahHariIni
                  ? 'Gunakan tombol di samping untuk mulai menandai atau memperbarui absensi siswa hari ini.'
                  : 'Catatan: Wali kelas hanya memiliki wewenang untuk mengisi absensi pada tanggal hari ini (WIB).'}
              </p>

              <Link href={`/admin/presensi/${kelasWaliGuru.id}/${tanggalDipilih}`} className="w-full sm:w-auto shrink-0">
                <Tombol variasi="utama" className="w-full justify-center sm:w-auto min-h-[44px] gap-2 shadow-card">
                  {kelasWaliGuru.statusPresensi === 'selesai' ? 'Tinjau / Edit Presensi' : 'Isi Presensi Sekarang'}
                  <ArrowRight className="size-4" />
                </Tombol>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Kartu Metrik Ringkasan untuk Admin */}
      {!isGuru && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          <Kartu className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between text-ink-muted">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider">Total Kelas</span>
              <Users className="size-4 text-brand shrink-0" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{totalKelas}</p>
            <p className="mt-1 text-xs text-ink-faint">Kelas aktif terdaftar</p>
          </Kartu>

          <Kartu className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between text-success">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider text-ink-muted">Sudah Selesai</span>
              <CheckCircle2 className="size-4 shrink-0" />
            </div>
            <p className="mt-2 text-2xl font-bold text-success sm:text-3xl">{totalSelesai}</p>
            <p className="mt-1 text-xs text-ink-faint">
              {totalKelas > 0 ? `${Math.round((totalSelesai / totalKelas) * 100)}% selesai` : '0%'}
            </p>
          </Kartu>

          <Kartu className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between text-highlight">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider text-ink-muted">Tersimpan Draf</span>
              <Clock className="size-4 shrink-0" />
            </div>
            <p className="mt-2 text-2xl font-bold text-highlight sm:text-3xl">{totalDraf}</p>
            <p className="mt-1 text-xs text-ink-faint">Belum difinalisasi</p>
          </Kartu>

          <Kartu className="p-3.5 sm:p-5">
            <div className="flex items-center justify-between text-ink-muted">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-normal sm:tracking-wider">Belum Diisi</span>
              <AlertCircle className="size-4 shrink-0" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{totalBelumDiisi}</p>
            <p className="mt-1 text-xs text-ink-faint">Perlu tindakan</p>
          </Kartu>
        </div>
      )}

      {/* Bagian Daftar Semua Kelas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-ink">
            {isGuru ? 'Daftar Kelas Lainnya' : 'Status Presensi Seluruh Kelas'}
          </h2>
          <span className="text-xs text-ink-muted">
            Menampilkan {kelasWithStatus.length} kelas
          </span>
        </div>

        {kelasWithStatus.length === 0 ? (
          <EmptyState
            judul="Belum Ada Kelas Aktif"
            pesan="Data kelas belum dibuat pada tahun ajaran ini. Silakan tambahkan kelas terlebih dahulu melalui menu Data Akademik."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kelasWithStatus.map((kelas) => {
              const statusBadge = {
                selesai: {
                  label: 'Selesai',
                  bg: 'bg-brand-soft text-brand border-brand/20',
                  icon: CheckCircle2,
                },
                draf: {
                  label: 'Draf',
                  bg: 'bg-highlight-soft text-highlight border-highlight/30',
                  icon: Clock,
                },
                belum_diisi: {
                  label: 'Belum Diisi',
                  bg: 'bg-paper-sunken text-ink-muted border-line',
                  icon: AlertCircle,
                },
              }[kelas.statusPresensi];

              const Icon = statusBadge.icon;

              return (
                <div
                  key={kelas.id}
                  className={`flex flex-col justify-between rounded-xl border bg-paper p-5 shadow-card transition hover:border-line-strong hover:shadow-lift ${
                    kelas.isWaliKelasUser ? 'ring-2 ring-brand/30' : 'border-line'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-paper-sunken px-2 py-0.5 font-mono text-xs font-semibold text-ink-muted">
                            Kls {kelas.tingkat}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-ink">
                            {kelas.nama}
                          </h3>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                          <GraduationCap className="size-3.5" />
                          <span>Wali: {kelas.waliKelasNama}</span>
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge.bg}`}
                      >
                        <Icon className="size-3" />
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Ringkasan Jumlah Siswa & Kehadiran */}
                    <div className="mt-4 rounded-lg bg-paper-raised p-3 text-xs">
                      <div className="flex items-center justify-between border-b border-line pb-2 font-medium text-ink">
                        <span>Total Roster</span>
                        <span>{kelas.totalSiswa} Siswa</span>
                      </div>

                      {kelas.statusPresensi !== 'belum_diisi' ? (
                        <div className="mt-2 grid grid-cols-5 gap-1 text-center">
                          <div className="rounded bg-brand-soft p-1">
                            <span className="block font-bold text-brand">{kelas.breakdown.hadir}</span>
                            <span className="text-[10px] text-ink-muted">Hadir</span>
                          </div>
                          <div className="rounded bg-paper p-1">
                            <span className="block font-bold text-ink">{kelas.breakdown.sakit}</span>
                            <span className="text-[10px] text-ink-muted">Sakit</span>
                          </div>
                          <div className="rounded bg-paper p-1">
                            <span className="block font-bold text-ink">{kelas.breakdown.izin}</span>
                            <span className="text-[10px] text-ink-muted">Izin</span>
                          </div>
                          <div className="rounded bg-paper p-1">
                            <span className="block font-bold text-danger">{kelas.breakdown.alpa}</span>
                            <span className="text-[10px] text-ink-muted">Alpa</span>
                          </div>
                          <div className="rounded bg-paper p-1">
                            <span className="block font-bold text-highlight">{kelas.breakdown.terlambat}</span>
                            <span className="text-[10px] text-ink-muted">Telat</span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-center text-ink-faint italic">
                          Belum ada data kehadiran tercatat
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Tindakan */}
                  <div className="mt-5 pt-3 border-t border-line">
                    <Link
                      href={`/admin/presensi/${kelas.id}/${tanggalDipilih}`}
                      className="block"
                    >
                      <Tombol
                        variasi={kelas.statusPresensi === 'selesai' ? 'garis' : 'utama'}
                        className="w-full justify-center min-h-[44px]"
                      >
                        <CalendarCheck className="mr-2 size-4" />
                        {kelas.statusPresensi === 'selesai'
                          ? 'Tinjau / Koreksi'
                          : kelas.statusPresensi === 'draf'
                          ? 'Lanjutkan Draf'
                          : 'Isi Presensi'}
                      </Tombol>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
