import { setupSystem } from './actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    
  if (count && count > 0) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-sunken px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-paper p-8 shadow-card border border-line">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-ink-deep font-heading">
            Setup Website Pertama
          </h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Selamat datang! Buat akun super-admin pertama Anda.
          </p>
        </div>
        <form className="mt-8 space-y-6" action={setupSystem}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="nama_sekolah" className="sr-only">Nama Sekolah</label>
              <input id="nama_sekolah" name="nama_sekolah" type="text" required className="relative block w-full rounded-md border-0 py-1.5 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 px-3" placeholder="Nama Sekolah" />
            </div>
            <div>
              <label htmlFor="nama" className="sr-only">Nama Admin</label>
              <input id="nama" name="nama" type="text" required className="relative block w-full rounded-md border-0 py-1.5 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 px-3" placeholder="Nama Admin" />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required className="relative block w-full rounded-md border-0 py-1.5 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 px-3" placeholder="Email" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Kata Sandi</label>
              <input id="password" name="password" type="password" required minLength={6} className="relative block w-full rounded-md border-0 py-1.5 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:z-10 focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6 px-3" placeholder="Kata Sandi (min. 6 karakter)" />
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-brand px-3 py-1.5 text-sm font-semibold leading-6 text-on-brand hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              Selesaikan Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
