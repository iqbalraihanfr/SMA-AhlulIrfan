'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type LoginFormState = {
  error?: string | null
}

export async function loginUser(
  prevStateOrFormData?: LoginFormState | FormData,
  maybeFormData?: FormData
): Promise<LoginFormState> {
  const formData =
    maybeFormData instanceof FormData
      ? maybeFormData
      : prevStateOrFormData instanceof FormData
      ? prevStateOrFormData
      : null

  if (!formData) {
    return { error: 'Data formulir tidak valid.' }
  }

  const supabase = await createClient()

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return { error: 'Email atau kata sandi salah. Silakan coba lagi.' }
    }
    return { error: error.message || 'Gagal masuk. Periksa kembali kredensial Anda.' }
  }

  redirect('/admin')
}
