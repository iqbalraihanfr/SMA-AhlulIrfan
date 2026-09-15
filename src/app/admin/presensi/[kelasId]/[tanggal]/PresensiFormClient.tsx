'use client';

import {
  useState,
  useEffect,
  useOptimistic,
  useTransition,
  useActionState,
} from 'react';
import Link from 'next/link';
import {
  CheckCheck,
  Save,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Tombol, Kartu, Label, Textarea } from '@/components/Ui';
import { simpanPresensiAction } from '@/lib/presensi/actions';
import type {
  StatusKehadiran,
  PresensiState,
  SimpanPresensiPayload,
} from '@/types/absensi';

export interface SiswaRosterItem {
  siswa_id: number;
  kode_siswa: string;
  nama: string;
  jenis_kelamin: 'L' | 'P';
  status: StatusKehadiran;
  catatan?: string;
}

interface Props {
  kelas: {
    id: number;
    nama: string;
    tingkat: number;
    waliKelasNama: string;
  };
  tanggal: string;
  tanggalFormatted: string;
  session: {
    id: number;
    versi: number;
    status: 'draf' | 'selesai';
    selesai_pada?: string | null;
  } | null;
  initialBaris: SiswaRosterItem[];
  isGuru: boolean;
  isPastDate: boolean;
  isFutureDate: boolean;
  isReadOnly: boolean;
}

type OptimisticAction =
  | { type: 'TANDAI_SEMUA_HADIR' }
  | { type: 'UBAH_STATUS'; siswaId: number; status: StatusKehadiran }
  | { type: 'UBAH_CATATAN'; siswaId: number; catatan: string };

const initialPresensiState: PresensiState = {
  status: 'idle',
};

export function PresensiFormClient({
  kelas,
  tanggal,
  tanggalFormatted,
  session,
  initialBaris,
  isGuru,
  isPastDate,
  isFutureDate,
  isReadOnly,
}: Props) {
  // State data baris kehadiran siswa
  const [barisList, setBarisList] = useState<SiswaRosterItem[]>(initialBaris);
  const [currentVersi, setCurrentVersi] = useState<number>(session?.versi ?? 1);
  const [isCompleted, setIsCompleted] = useState<boolean>(session?.status === 'selesai');
  const [alasan, setAlasan] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [activeNoteSiswaId, setActiveNoteSiswaId] = useState<number | null>(null);
  const [showConfirmSelesai, setShowConfirmSelesai] = useState<boolean>(false);

  // Tangani tombol Escape untuk menutup dialog konfirmasi modal
  useEffect(() => {
    if (!showConfirmSelesai) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConfirmSelesai(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showConfirmSelesai]);

  // Transisi untuk update optimis & saving
  const [isSaving, startSaveTransition] = useTransition();

  // React 19 useOptimistic untuk perubahan instan di layar
  const [optimisticBaris, setOptimisticBaris] = useOptimistic(
    barisList,
    (current: SiswaRosterItem[], action: OptimisticAction) => {
      switch (action.type) {
        case 'TANDAI_SEMUA_HADIR':
          return current.map((item) => ({
            ...item,
            status: 'hadir' as StatusKehadiran,
          }));
        case 'UBAH_STATUS':
          return current.map((item) =>
            item.siswa_id === action.siswaId ? { ...item, status: action.status } : item
          );
        case 'UBAH_CATATAN':
          return current.map((item) =>
            item.siswa_id === action.siswaId ? { ...item, catatan: action.catatan } : item
          );
        default:
          return current;
      }
    }
  );

  // React 19 useActionState untuk pemanggilan Server Action
  const [state, formAction, isPending] = useActionState(
    async (prevState: PresensiState, payload: SimpanPresensiPayload) => {
      const res = await simpanPresensiAction(prevState, payload);

      if (res.status === 'success') {
        setHasUnsavedChanges(false);
        setClientError(null);
        if (res.data?.versi) {
          setCurrentVersi(res.data.versi);
        } else {
          setCurrentVersi((v) => v + 1);
        }
        if (payload.selesaikan) {
          setIsCompleted(true);
        }
      }

      return res;
    },
    initialPresensiState
  );

  // 1. Aksi "Tandai Semua Hadir" menggunakan React 19 useOptimistic
  function handleTandaiSemuaHadir() {
    if (isReadOnly) return;
    setClientError(null);

    startSaveTransition(() => {
      // Perbarui UI secara instan sebelum Server Action selesai!
      setOptimisticBaris({ type: 'TANDAI_SEMUA_HADIR' });

      // Sinkronkan state baris lokal
      const updated = barisList.map((item) => ({
        ...item,
        status: 'hadir' as StatusKehadiran,
      }));
      setBarisList(updated);
      setHasUnsavedChanges(true);
    });
  }

  // 2. Ubah status per siswa secara reaktif
  function handleUbahStatus(siswaId: number, statusBaru: StatusKehadiran) {
    if (isReadOnly) return;
    setClientError(null);

    startSaveTransition(() => {
      setOptimisticBaris({ type: 'UBAH_STATUS', siswaId, status: statusBaru });

      const updated = barisList.map((item) =>
        item.siswa_id === siswaId ? { ...item, status: statusBaru } : item
      );
      setBarisList(updated);
      setHasUnsavedChanges(true);
    });
  }

  // 3. Ubah catatan per siswa
  function handleUbahCatatan(siswaId: number, catatanBaru: string) {
    if (isReadOnly) return;

    startSaveTransition(() => {
      setOptimisticBaris({ type: 'UBAH_CATATAN', siswaId, catatan: catatanBaru });

      const updated = barisList.map((item) =>
        item.siswa_id === siswaId ? { ...item, catatan: catatanBaru } : item
      );
      setBarisList(updated);
      setHasUnsavedChanges(true);
    });
  }

  // 4. Submit form Simpan Draf atau Selesaikan
  function eksekusiSimpan(selesaikan: boolean) {
    if (isReadOnly) return;

    // Validasi penyelesaian: Tidak boleh ada status 'belum_diisi'
    if (selesaikan) {
      const sisaBelumDiisi = optimisticBaris.filter((b) => b.status === 'belum_diisi');
      if (sisaBelumDiisi.length > 0) {
        setClientError(
          `Terdapat ${sisaBelumDiisi.length} siswa yang masih berstatus 'Belum diisi'. Seluruh siswa wajib memiliki status kehadiran sebelum absensi difinalisasi.`
        );
        setShowConfirmSelesai(false);
        return;
      }
    }

    // Validasi tanggal lampau: Alasan koreksi wajib minimal 10 karakter
    if (isPastDate && (!alasan || alasan.trim().length < 10)) {
      setClientError('Alasan koreksi wajib diisi minimal 10 karakter untuk perubahan tanggal lampau.');
      setShowConfirmSelesai(false);
      return;
    }

    setClientError(null);
    setShowConfirmSelesai(false);

    startSaveTransition(() => {
      const payload: SimpanPresensiPayload = {
        kelasId: kelas.id,
        tanggal,
        versi: currentVersi,
        baris: optimisticBaris.map((b) => ({
          siswa_id: b.siswa_id,
          status: b.status,
          catatan: b.catatan || undefined,
        })),
        selesaikan,
        alasan: isPastDate ? alasan.trim() : undefined,
      };

      formAction(payload);
    });
  }

  // Perhitungan statistik real-time dari data optimis
  const counts = {
    hadir: optimisticBaris.filter((b) => b.status === 'hadir').length,
    sakit: optimisticBaris.filter((b) => b.status === 'sakit').length,
    izin: optimisticBaris.filter((b) => b.status === 'izin').length,
    alpa: optimisticBaris.filter((b) => b.status === 'alpa').length,
    terlambat: optimisticBaris.filter((b) => b.status === 'terlambat').length,
    belum_diisi: optimisticBaris.filter((b) => b.status === 'belum_diisi').length,
  };

  const totalSiswa = optimisticBaris.length;
  const sedangProses = isPending || isSaving;

  return (
    <div className="relative pb-36 lg:pb-28">
      {/* Header Halaman Pengisian */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/presensi"
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted transition hover:text-brand"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke Daftar Presensi
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-paper-sunken px-2.5 py-1 font-mono text-xs font-bold text-ink">
              Kelas {kelas.nama} (Tingkat {kelas.tingkat})
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                isCompleted
                  ? 'bg-brand-soft text-brand border border-brand/20'
                  : 'bg-highlight-soft text-highlight border border-highlight/30'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
              {isCompleted ? 'Presensi Selesai' : 'Status Draf'}
            </span>

            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1 rounded-full bg-highlight-soft px-2.5 py-0.5 text-xs font-medium text-highlight">
                ● Perubahan belum disimpan
              </span>
            )}
          </div>

          <h1 className="mt-2 font-heading text-2xl font-bold text-ink sm:text-3xl">
            Pengisian Presensi Kelas
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {tanggalFormatted} • Wali Kelas: {kelas.waliKelasNama} • Total {totalSiswa} Siswa
          </p>
        </div>

        {/* Info Versi Dokumen */}
        <div className="flex items-center gap-2 self-start rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink-muted shadow-card">
          <span>Versi Dokumen:</span>
          <span className="font-mono font-bold text-ink">v{currentVersi}</span>
        </div>
      </div>

      {/* Banner Peringatan Mode Read-Only */}
      {isReadOnly && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-line bg-paper-sunken p-4 text-sm text-ink">
          <Info className="size-5 text-highlight shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Mode Hanya Lihat (Read-Only)</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {isFutureDate
                ? 'Absensi tidak dapat dicatat untuk tanggal di masa depan.'
                : isGuru
                ? 'Wali kelas hanya dapat mencatat dan mengedit kehadiran siswa untuk tanggal hari berjalan (WIB). Hubungi Admin jika diperlukan koreksi tanggal lampau.'
                : 'Form dalam keadaan terkunci.'}
            </p>
          </div>
        </div>
      )}

      {/* Banner Notifikasi Konflik Versi (Optimistic Lock Conflict 409) */}
      {state.status === 'conflict' && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-danger/30 bg-paper p-5 shadow-lift">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-6 text-danger shrink-0 mt-0.5" />
            <div>
              <h3 className="font-heading font-bold text-danger text-base">
                Terjadi Konflik Versi Dokumen
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                {state.message ||
                  'Data absensi telah diubah dan disimpan oleh pengguna lain sejak halaman ini dibuka. Untuk mencegah penimpaan data tanpa sengaja, silakan muat ulang halaman.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-danger px-4 py-2 text-xs font-semibold text-on-brand transition hover:opacity-90 shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          >
            <RotateCcw className="size-3.5" />
            Muat Ulang Halaman
          </button>
        </div>
      )}

      {/* Banner Pesan Error / Sukses dari Server Action */}
      {state.status === 'error' && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-danger/30 bg-paper p-4 text-sm text-danger shadow-card">
          <AlertCircle className="size-5 shrink-0" />
          <span>{state.message || 'Gagal menyimpan presensi.'}</span>
        </div>
      )}

      {state.status === 'success' && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-brand/30 bg-brand-soft p-4 text-sm text-brand shadow-card">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {clientError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-danger/30 bg-paper p-4 text-sm text-danger shadow-card">
          <AlertTriangle className="size-5 shrink-0" />
          <span>{clientError}</span>
        </div>
      )}

      {/* Input Wajib Alasan Koreksi untuk Tanggal Lampau (Khusus Admin) */}
      {isPastDate && !isReadOnly && (
        <Kartu className="mb-6 border-highlight/40 bg-highlight-soft/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-highlight shrink-0 mt-0.5" />
            <div className="w-full space-y-2">
              <Label htmlFor="alasan-koreksi" className="font-bold text-ink">
                Alasan Koreksi Tanggal Lampau <span className="text-danger">*</span>
              </Label>
              <p className="text-xs text-ink-muted">
                Karena Anda mengoreksi absensi pada tanggal yang telah lewat, sistem mewajibkan catatan alasan (minimal 10 karakter) untuk dicatat dalam log audit sekolah.
              </p>
              <Textarea
                id="alasan-koreksi"
                rows={2}
                placeholder="Contoh: Koreksi status siswa berdasarkan surat izin dokter susulan yang diserahkan wali murid..."
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                disabled={sedangProses}
                className="bg-paper"
              />
            </div>
          </div>
        </Kartu>
      )}

      {/* Kartu Ringkasan Kehadiran Roster */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        <div className="rounded-lg border border-brand/30 bg-brand-soft p-2.5 text-center">
          <span className="block text-xl font-bold text-brand">{counts.hadir}</span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Hadir (H)</span>
        </div>
        <div className="rounded-lg border border-line bg-paper p-2.5 text-center shadow-card">
          <span className="block text-xl font-bold text-ink">{counts.sakit}</span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Sakit (S)</span>
        </div>
        <div className="rounded-lg border border-line bg-paper p-2.5 text-center shadow-card">
          <span className="block text-xl font-bold text-highlight">{counts.izin}</span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Izin (I)</span>
        </div>
        <div className="rounded-lg border border-danger/20 bg-paper p-2.5 text-center shadow-card">
          <span className="block text-xl font-bold text-danger">{counts.alpa}</span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Alpa (A)</span>
        </div>
        <div className="rounded-lg border border-line bg-paper p-2.5 text-center shadow-card">
          <span className="block text-xl font-bold text-highlight">{counts.terlambat}</span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Telat (T)</span>
        </div>
        <div className={`rounded-lg border p-2.5 text-center ${counts.belum_diisi > 0 ? 'border-line-strong bg-paper-sunken' : 'border-line bg-paper'}`}>
          <span className={`block text-xl font-bold ${counts.belum_diisi > 0 ? 'text-danger' : 'text-ink-muted'}`}>
            {counts.belum_diisi}
          </span>
          <span className="block truncate text-[11px] font-semibold text-ink-muted">Belum Diisi</span>
        </div>
      </div>

      {/* Daftar Siswa - Mobile Cards (390px Optimized) & Desktop Grid */}
      <div className="space-y-3">
        {optimisticBaris.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-paper-raised p-8 text-center">
            <p className="font-heading font-semibold text-ink">Tidak ada siswa terdaftar</p>
            <p className="mt-1 text-sm text-ink-muted">
              Roster siswa aktif pada kelas ini belum ditemukan untuk tanggal terpilih.
            </p>
          </div>
        ) : (
          optimisticBaris.map((siswa, idx) => {
            const isNoteOpen = activeNoteSiswaId === siswa.siswa_id;
            const hasCatatan = Boolean(siswa.catatan && siswa.catatan.trim().length > 0);

            return (
              <div
                key={siswa.siswa_id}
                className={`rounded-xl border bg-paper p-4 shadow-card transition sm:p-5 ${
                  siswa.status === 'belum_diisi'
                    ? 'border-line-strong hover:border-line'
                    : 'border-line'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Identitas Siswa */}
                  <div className="flex items-start gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-paper-sunken font-mono text-xs font-bold text-ink-muted">
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-base font-bold text-ink">
                          {siswa.nama}
                        </span>
                        <span className="rounded bg-paper-sunken px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-muted">
                          {siswa.kode_siswa}
                        </span>
                        <span className="rounded bg-paper-sunken px-1.5 py-0.5 text-[11px] font-semibold text-ink-muted">
                          {siswa.jenis_kelamin === 'L' ? 'L' : 'P'}
                        </span>
                      </div>

                      {hasCatatan && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted italic">
                          <MessageSquare className="size-3 text-brand" />
                          <span>{siswa.catatan}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Kontrol Pilihan Status Kehadiran (Mobile 390px friendly touch targets) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pt-0">
                    {/* Hadir */}
                    <button
                      type="button"
                      onClick={() => handleUbahStatus(siswa.siswa_id, 'hadir')}
                      disabled={isReadOnly || sedangProses}
                      aria-pressed={siswa.status === 'hadir'}
                      aria-label={`Tandai ${siswa.nama} Hadir`}
                      className={`min-h-[44px] flex-1 sm:flex-none rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold transition shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                        siswa.status === 'hadir'
                          ? 'bg-brand text-on-brand'
                          : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      Hadir
                    </button>

                    {/* Sakit */}
                    <button
                      type="button"
                      onClick={() => handleUbahStatus(siswa.siswa_id, 'sakit')}
                      disabled={isReadOnly || sedangProses}
                      aria-pressed={siswa.status === 'sakit'}
                      aria-label={`Tandai ${siswa.nama} Sakit`}
                      className={`min-h-[44px] flex-1 sm:flex-none rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold transition shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                        siswa.status === 'sakit'
                          ? 'bg-paper-raised text-ink border border-line-strong ring-2 ring-line-strong'
                          : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      Sakit
                    </button>

                    {/* Izin */}
                    <button
                      type="button"
                      onClick={() => handleUbahStatus(siswa.siswa_id, 'izin')}
                      disabled={isReadOnly || sedangProses}
                      aria-pressed={siswa.status === 'izin'}
                      aria-label={`Tandai ${siswa.nama} Izin`}
                      className={`min-h-[44px] flex-1 sm:flex-none rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold transition shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                        siswa.status === 'izin'
                          ? 'bg-highlight text-on-highlight'
                          : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      Izin
                    </button>

                    {/* Alpa */}
                    <button
                      type="button"
                      onClick={() => handleUbahStatus(siswa.siswa_id, 'alpa')}
                      disabled={isReadOnly || sedangProses}
                      aria-pressed={siswa.status === 'alpa'}
                      aria-label={`Tandai ${siswa.nama} Alpa`}
                      className={`min-h-[44px] flex-1 sm:flex-none rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold transition shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                        siswa.status === 'alpa'
                          ? 'bg-danger text-on-brand'
                          : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      Alpa
                    </button>

                    {/* Terlambat */}
                    <button
                      type="button"
                      onClick={() => handleUbahStatus(siswa.siswa_id, 'terlambat')}
                      disabled={isReadOnly || sedangProses}
                      aria-pressed={siswa.status === 'terlambat'}
                      aria-label={`Tandai ${siswa.nama} Terlambat`}
                      className={`min-h-[44px] flex-1 sm:flex-none rounded-lg px-2.5 sm:px-3.5 py-2 text-xs font-bold transition shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
                        siswa.status === 'terlambat'
                          ? 'bg-amber-700 text-on-brand'
                          : 'border border-line bg-paper text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      Telat
                    </button>

                    {/* Toggle Tombol Catatan */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveNoteSiswaId(isNoteOpen ? null : siswa.siswa_id)
                      }
                      title="Tambah atau ubah catatan siswa"
                      aria-label={`Catatan untuk ${siswa.nama}`}
                      aria-expanded={isNoteOpen}
                      className={`flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        hasCatatan
                          ? 'border-brand bg-brand-soft text-brand'
                          : 'border-line bg-paper text-ink-muted hover:bg-paper-sunken'
                      }`}
                    >
                      <MessageSquare className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Input Catatan jika di-expand */}
                {isNoteOpen && (
                  <div className="mt-3 border-t border-line pt-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tulis catatan (contoh: surat izin terlampir, izin acara keluarga)..."
                        value={siswa.catatan || ''}
                        onChange={(e) => handleUbahCatatan(siswa.siswa_id, e.target.value)}
                        disabled={isReadOnly || sedangProses}
                        maxLength={255}
                        aria-label={`Catatan untuk ${siswa.nama}`}
                        className="min-h-[42px] w-full rounded-md border-line bg-paper-sunken px-3 py-2 text-base sm:text-xs text-ink shadow-card focus:border-brand focus:ring-brand"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveNoteSiswaId(null)}
                        className="min-h-[42px] shrink-0 rounded-md border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink-muted hover:bg-paper-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Dialog Konfirmasi Finalisasi Presensi */}
      {showConfirmSelesai && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-finalisasi-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/60 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-line bg-paper p-6 shadow-lift">
            <div className="flex items-center gap-3 text-ink">
              <CheckCircle2 className="size-6 text-brand" />
              <h3 id="modal-finalisasi-title" className="font-heading text-lg font-bold">
                Finalisasi Presensi Kelas?
              </h3>
            </div>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Anda akan menyelesaikan presensi untuk <strong>Kelas {kelas.nama}</strong> pada tanggal{' '}
              <strong>{tanggalFormatted}</strong>. Setelah diselesaikan, kehadiran ini akan dihitung dalam rekap resmi sekolah.
            </p>

            <div className="mt-4 rounded-lg bg-paper-sunken p-3 text-xs text-ink">
              <p className="font-semibold mb-1">Ringkasan Kehadiran:</p>
              <p>
                Hadir: {counts.hadir} • Sakit: {counts.sakit} • Izin: {counts.izin} • Alpa: {counts.alpa} • Telat: {counts.terlambat}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Tombol
                variasi="garis"
                type="button"
                onClick={() => setShowConfirmSelesai(false)}
                disabled={sedangProses}
                className="min-h-[44px]"
              >
                Batal
              </Tombol>
              <Tombol
                variasi="utama"
                type="button"
                onClick={() => eksekusiSimpan(true)}
                disabled={sedangProses}
                className="min-h-[44px]"
              >
                {sedangProses ? 'Menyimpan...' : 'Ya, Selesaikan'}
              </Tombol>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar (Mobile 390px & Desktop) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur shadow-lift sm:px-6 lg:left-64">
        <div className="mx-auto flex max-w-5xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Baris Ringkasan Cepat */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <span className="size-2 rounded-full bg-brand" />
              <span>H: <strong>{counts.hadir}</strong></span>
              <span>•</span>
              <span>S: <strong>{counts.sakit}</strong></span>
              <span>•</span>
              <span>I: <strong>{counts.izin}</strong></span>
              <span>•</span>
              <span>A: <strong className="text-danger">{counts.alpa}</strong></span>
              <span>•</span>
              <span>T: <strong>{counts.terlambat}</strong></span>
            </div>

            {counts.belum_diisi > 0 && (
              <span className="rounded-full bg-paper-sunken px-2 py-0.5 text-[11px] font-bold text-danger border border-line">
                {counts.belum_diisi} Belum Diisi
              </span>
            )}
          </div>

          {/* Tombol Aksi Utama */}
          <div className="grid grid-cols-3 gap-1.5 w-full sm:flex sm:w-auto sm:items-center sm:justify-end sm:gap-2">
            {/* Tombol React 19 Optimistic: "Tandai Semua Hadir" */}
            <Tombol
              variasi="garis"
              type="button"
              onClick={handleTandaiSemuaHadir}
              disabled={isReadOnly || sedangProses}
              title="Tandai semua siswa menjadi Hadir secara instan"
              className="min-h-[44px] justify-center px-2 sm:px-4 text-xs sm:text-sm shadow-card"
            >
              <CheckCheck className="size-4 shrink-0 sm:mr-1.5 text-brand" />
              <span className="truncate">Semua Hadir</span>
            </Tombol>

            {/* Simpan Draf */}
            <Tombol
              variasi="garis"
              type="button"
              onClick={() => eksekusiSimpan(false)}
              disabled={isReadOnly || sedangProses}
              className="min-h-[44px] justify-center px-2 sm:px-4 text-xs sm:text-sm"
            >
              <Save className="size-4 shrink-0 sm:mr-1.5" />
              <span className="truncate">
                {sedangProses ? (
                  'Simpan…'
                ) : (
                  <>
                    <span className="hidden sm:inline">Simpan </span>Draf
                  </>
                )}
              </span>
            </Tombol>

            {/* Selesaikan Presensi */}
            <Tombol
              variasi="utama"
              type="button"
              onClick={() => setShowConfirmSelesai(true)}
              disabled={isReadOnly || sedangProses}
              className="min-h-[44px] justify-center px-2 sm:px-4 text-xs sm:text-sm shadow-card"
            >
              <CheckCircle2 className="size-4 shrink-0 sm:mr-1.5" />
              <span className="truncate">
                <span className="sm:hidden">{isCompleted ? 'Perbarui' : 'Selesai'}</span>
                <span className="hidden sm:inline">{isCompleted ? 'Perbarui Selesai' : 'Selesaikan'}</span>
              </span>
            </Tombol>
          </div>
        </div>
      </div>
    </div>
  );
}
