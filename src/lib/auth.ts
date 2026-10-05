import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Sesi berakhir. Silakan masuk kembali.')

  const { data: profile, error: profileError } = await supabase
    .from('users').select('peran').eq('id', user.id).single()
  if (profileError || !profile || !['admin', 'super-admin'].includes(profile.peran)) {
    throw new Error('Hanya admin sekolah yang dapat mengelola konten ini.')
  }
  return { supabase, user }
}
