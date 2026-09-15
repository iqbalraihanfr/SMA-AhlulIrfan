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
          className="flex size-11 items-center justify-center text-ink-muted transition hover:bg-paper-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex min-h-[44px] items-center gap-2 border-x border-line px-3 py-1.5">
          <Calendar className="size-4 text-brand shrink-0" />
          <input
            type="date"
            value={tanggalDipilih}
            onChange={(e) => {
              if (e.target.value) {
                gantiTanggal(e.target.value);
              }
            }}
            disabled={isPending}
            className="border-0 bg-transparent p-0 text-sm font-medium text-ink focus:ring-0 cursor-pointer"
            aria-label="Pilih tanggal presensi"
          />
        </div>

        <button
          type="button"
          onClick={() => geserHari(1)}
          title="Hari berikutnya"
          aria-label="Hari berikutnya"
          disabled={isPending}
          className="flex size-11 items-center justify-center text-ink-muted transition hover:bg-paper-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {!adalahHariIni && (
        <button
          type="button"
          onClick={() => gantiTanggal(tanggalHariIni)}
          disabled={isPending}
          className="flex min-h-[44px] items-center rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50"
        >
          Kembali ke Hari Ini
        </button>
      )}

      {isPending && (
        <span className="text-xs text-ink-muted animate-pulse" role="status" aria-live="polite">Memuat...</span>
      )}
    </div>
  );
}
