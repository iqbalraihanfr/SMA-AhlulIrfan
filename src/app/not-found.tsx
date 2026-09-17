import Link from 'next/link'
import { ArrowLeft, Home, Newspaper, PhoneCall } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Halaman Tidak Ditemukan | SMA Ahlul Irfan',
  description: 'Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main
      id="konten"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-center"
    >
      <div className="mx-auto max-w-md">
        <span
          aria-hidden="true"
          className="inline-block rounded-full bg-brand-soft px-3 py-1 font-mono text-sm font-bold text-brand"
        >
          404 ERROR
        </span>

        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink-deep sm:text-4xl">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mt-3 text-base text-ink-muted leading-relaxed">
          Mohon maaf, halaman yang Anda tuju tidak ditemukan, sudah dihapus, atau tautan yang dimasukkan kurang tepat.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Home className="size-4" aria-hidden="true" />
            Kembali ke Beranda
          </Link>

          <Link
            href="/berita"
            className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <Newspaper className="size-4 text-ink-muted" aria-hidden="true" />
            Berita Sekolah
          </Link>
        </div>

        <div className="mt-10 border-t border-line pt-6 text-sm text-ink-muted">
          <span>Butuh bantuan informasi? </span>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-1 font-medium text-brand underline underline-offset-4 hover:text-brand-strong"
          >
            <PhoneCall className="size-3.5" aria-hidden="true" />
            Hubungi kami di halaman kontak
          </Link>
        </div>
      </div>
    </main>
  )
}
