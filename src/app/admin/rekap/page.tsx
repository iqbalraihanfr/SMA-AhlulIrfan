import Link from 'next/link';
import { PageHeader, Kartu, Tombol, Select, Input, Label } from '@/components/Ui';
import { FileSpreadsheet, Filter, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Rekap Presensi Siswa | Admin SMA Ahlul Irfan',
};

export default function RekapPresensiPlaceholderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        judul="Rekapitulasi Presensi Siswa"
        keterangan="Pantau persentase kehadiran dan ekspor laporan presensi harian per kelas."
        aksi={
          <Link href="/admin/presensi">
            <Tombol variasi="garis">
              <ArrowLeft className="mr-2 size-4" />
              Kembali ke Presensi
            </Tombol>
          </Link>
        }
      />

      <Kartu className="space-y-4">
        <div className="flex items-center gap-2 border-b border-line pb-3 text-ink font-semibold text-sm">
          <Filter className="size-4 text-brand" />
          Filter Rekapitulasi
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="periode">Tahun Ajaran</Label>
            <Select id="periode" defaultValue="aktif" disabled>
              <option value="aktif">2026/2027 (Ganjil) - Aktif</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="kelas">Kelas</Label>
            <Select id="kelas" defaultValue="semua">
              <option value="semua">Semua Kelas</option>
              <option value="1">X-A</option>
              <option value="2">XI-IPA</option>
              <option value="3">XII-IPA</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="mulai">Tanggal Awal</Label>
            <Input id="mulai" type="date" defaultValue="2026-09-01" />
          </div>

          <div>
            <Label htmlFor="selesai">Tanggal Akhir</Label>
            <Input id="selesai" type="date" defaultValue="2026-09-15" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Tombol variasi="garis" type="button" disabled>
            Terapkan Filter
          </Tombol>
          <Tombol variasi="utama" type="button" disabled>
            <FileSpreadsheet className="mr-2 size-4" />
            Ekspor CSV (Segera Hadir)
          </Tombol>
        </div>
      </Kartu>

      <div className="rounded-lg border border-dashed border-line bg-paper-raised p-8 text-center sm:p-12">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <FileSpreadsheet className="size-6" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
          Modul Rekapitulasi & Ekspor CSV
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted leading-relaxed">
          Fitur penghitungan otomatis kehadiran (Hadir, Sakit, Izin, Alpa, Terlambat) serta ekspor file CSV
          berstandar UTF-8 sedang disiapkan. Anda dapat mengisi absensi kelas harian melalui menu Presensi.
        </p>
        <div className="mt-6">
          <Link href="/admin/presensi">
            <Tombol variasi="utama">
              Buka Pengisian Presensi
            </Tombol>
          </Link>
        </div>
      </div>
    </div>
  );
}
