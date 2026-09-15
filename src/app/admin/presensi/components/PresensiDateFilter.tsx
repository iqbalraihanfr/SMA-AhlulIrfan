'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  tanggalDipilih: string;
  tanggalHariIni: string;
}

export function PresensiDateFilter({ tanggalDipilih, tanggalHariIni }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function gantiTanggal(baru: string) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tanggal', baru);
      router.push(`/admin/presensi?${params.toString()}`);
    });
  }

  function geserHari(delta: number) {
    const d = new Date(tanggalDipilih + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    gantiTanggal(`${yyyy}-${mm}-${dd}`);
  }

  const adalahHariIni = tanggalDipilih === tanggalHariIni;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center rounded-lg border border-line bg-paper shadow-card">
        <button
          type="button"
          onClick={() => geserHari(-1)}
          title="Hari sebelumnya"
          aria-label="Hari sebelumnya"
          disabled={isPending}
          className="p-2 text-ink-muted transition hover:bg-paper-sunken hover:text-ink disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2 border-x border-line px-3 py-1.5">
          <Calendar className="size-4 text-brand" />
          <input
            type="date"
            value={tanggalDipilih}
            onChange={(e) => {
              if (e.target.value) {
                gantiTanggal(e.target.value);
              }
            }}
            disabled={isPending}
            className="border-0 bg-transparent p-0 text-sm font-medium text-ink focus:ring-0"
            aria-label="Pilih tanggal presensi"
          />
        </div>

        <button
          type="button"
          onClick={() => geserHari(1)}
          title="Hari berikutnya"
          aria-label="Hari berikutnya"
          disabled={isPending}
          className="p-2 text-ink-muted transition hover:bg-paper-sunken hover:text-ink disabled:opacity-50"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {!adalahHariIni && (
        <button
          type="button"
          onClick={() => gantiTanggal(tanggalHariIni)}
          disabled={isPending}
          className="rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand-soft disabled:opacity-50"
        >
          Kembali ke Hari Ini
        </button>
      )}

      {isPending && (
        <span className="text-xs text-ink-muted animate-pulse">Memuat...</span>
      )}
    </div>
  );
}
