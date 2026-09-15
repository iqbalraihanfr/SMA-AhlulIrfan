'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser, type LoginFormState } from './actions'

const initialState: LoginFormState = { error: '' }

export default function LoginFormClient() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className="mt-8 space-y-6" action={formAction}>
      {state?.error ? (
        <div
          className="rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            Alamat Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 px-3 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              placeholder="nama@sekolah.sch.id"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">
              Kata Sandi
            </label>
            <a
              href="#" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi Administrator secara langsung."); }}
              
              
              className="text-xs font-medium text-ink-muted hover:text-brand hover:underline underline-offset-4 transition-colors"
            >
              Lupa Kata Sandi?
            </a>
          </div>
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-ink-deep ring-1 ring-inset ring-line-strong placeholder:text-ink-faint focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6"
              placeholder="Kata Sandi"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink focus:outline-none"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full justify-center rounded-md bg-brand px-3 py-2 text-sm font-semibold leading-6 text-on-brand hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Memproses…' : 'Masuk'}
        </button>
      </div>
    </form>
  )
}
