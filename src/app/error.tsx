'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Catat galat ke konsol untuk keperluan penelusuran masalah
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <main
      id="konten"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center"
    >
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertCircle className="size-8" aria-hidden="true" />
        </div>

        <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight text-ink-deep sm:text-3xl">
          Halaman belum bisa dimuat
        </h1>

        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          Maaf, ada kendala saat membuka halaman ini. Periksa koneksi Anda, lalu coba muat ulang.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Coba Muat Ulang
          </button>

          <Link
            href="/"
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Home className="size-4 text-ink-muted" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}
