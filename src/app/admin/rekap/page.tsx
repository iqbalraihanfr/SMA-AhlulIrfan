import Link from 'next/link';
import { PageHeader, Kartu, Tombol, Select, Input, Label } from '@/components/Ui';
import { loadRekap } from '@/lib/rekap';

export const metadata = { title: 'Rekap Presensi Siswa | Admin SMA Ahlul Irfan' };

export default async function RekapPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { tahunAjaran, kelas, baris, filter, error } = await loadRekap(params);
  const query = filter ? new URLSearchParams({ tahun_ajaran_id: String(filter.tahun_ajaran_id), kelas_id: filter.kelas_id ? String(filter.kelas_id) : '', mulai: filter.mulai, selesai: filter.selesai }).toString() : '';
  return (
    <div className="space-y-6">
      <PageHeader judul="Rekapitulasi Presensi Siswa" keterangan="Rekap berdasarkan presensi yang sudah diselesaikan. Siswa terlambat tetap dihitung hadir." />
      <Kartu>
        <form method="GET" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><Label htmlFor="periode">Tahun ajaran</Label><Select id="periode" name="tahun_ajaran_id" defaultValue={params.tahun_ajaran_id || tahunAjaran[0]?.id}>
              {tahunAjaran.map((t) => <option key={t.id} value={t.id}>{t.nama} ({t.semester}){t.aktif ? ' — Aktif' : ''}</option>)}
            </Select></div>
            <div><Label htmlFor="kelas">Kelas</Label><Select id="kelas" name="kelas_id" defaultValue={params.kelas_id || ''}>
              <option value="">Semua kelas</option>{kelas.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </Select></div>
            <div><Label htmlFor="mulai">Tanggal awal</Label><Input id="mulai" name="mulai" type="date" defaultValue={params.mulai || filter?.mulai} required /></div>
            <div><Label htmlFor="selesai">Tanggal akhir</Label><Input id="selesai" name="selesai" type="date" defaultValue={params.selesai || filter?.selesai} required /></div>
          </div>
          <div className="flex flex-wrap gap-3"><Tombol disabled={!tahunAjaran.length}>Terapkan filter</Tombol>
            {filter && <a href={`/admin/rekap/export?${query}`} className="inline-flex min-h-[44px] items-center rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-paper-sunken">Unduh CSV</a>}
          </div>
        </form>
      </Kartu>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      {!error && <Kartu className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="pb-4 text-left text-ink-muted">{baris.length} siswa. Persentase = (hadir + terlambat) ÷ total presensi selesai.</caption>
          <thead><tr>{['Kelas', 'Kode siswa', 'Nama', 'Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat', 'Total', 'Kehadiran'].map((label) => <th key={label} scope="col" className="whitespace-nowrap border-b border-line px-3 py-3">{label}</th>)}</tr></thead>
          <tbody>{baris.map((r) => <tr key={`${r.kelas_id}-${r.siswa_id}`} className="border-b border-line">
            {[r.kelas, r.kode_siswa, r.nama, r.hadir, r.sakit, r.izin, r.alpa, r.terlambat, r.total, r.total ? `${r.persentase}%` : '—'].map((value, i) => <td key={i} className="whitespace-nowrap px-3 py-3">{value}</td>)}
          </tr>)}</tbody>
        </table>
        {!baris.length && <p className="py-6 text-sm text-ink-muted">Belum ada roster siswa pada kelas dan periode ini.</p>}
      </Kartu>}
      <Link href="/admin/presensi" className="inline-flex min-h-[44px] items-center text-sm text-brand underline underline-offset-4">Kembali ke presensi harian</Link>
    </div>
  );
}
