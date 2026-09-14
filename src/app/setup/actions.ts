'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function setupSystem(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Check if any user exists
  const { count, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    
  if (countError) throw new Error(countError.message)
  if (count && count > 0) {
    redirect('/login')
  }

  // 2. Create the Auth User
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nama = formData.get('nama') as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw new Error(authError.message)
  if (!authData.user) throw new Error('Failed to create auth user')

  // 3. Insert into public.users with super-admin role
  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    nama,
    email,
    peran: 'super-admin'
  })

  if (userError) throw new Error(userError.message)

  // 4. Set up site settings
  const nama_sekolah = formData.get('nama_sekolah') as string
  
  const { error: settingsError } = await supabase.from('pengaturan_situs').insert({
    nama_sekolah,
    fakta_terverifikasi: false
  })

  if (settingsError) throw new Error(settingsError.message)

  // Done!
  redirect('/admin')
}
