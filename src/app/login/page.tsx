import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import LoginFormClient from './LoginFormClient'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-sunken px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-paper p-8 shadow-card border border-line">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-ink-deep font-heading">
            Masuk ke Panel Admin
          </h2>
          <p className="mt-2 text-center text-sm text-ink-muted">
            Gunakan email dan kata sandi akun Anda
          </p>
        </div>
        <LoginFormClient />
      </div>
    </div>
  )
}
