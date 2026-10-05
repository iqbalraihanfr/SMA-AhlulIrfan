import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'

const email = z.string().email().parse(process.argv[2])
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key || !publicKey) throw new Error('URL, anon key, dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local untuk membuat akun sekolah.')
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const { data: existing, error: lookupError } = await supabase.from('users').select('id').eq('email', email).maybeSingle()
if (lookupError) throw lookupError
if (existing) throw new Error('Akun ini sudah ada. Kata sandinya tidak diubah.')

const password = randomBytes(18).toString('base64url')
const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
if (error) throw error
const { error: profileError } = await supabase.from('users').insert({
  id: data.user.id, email, nama: 'Admin SMA Ahlul Irfan', peran: 'admin',
})
if (profileError) {
  const { error: rollbackError } = await supabase.auth.admin.deleteUser(data.user.id)
  if (rollbackError) throw new Error(`Profil gagal dibuat dan akun Auth perlu dibersihkan: ${data.user.id}`)
  throw profileError
}
const check = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } })
const { error: loginError } = await check.auth.signInWithPassword({ email, password })
const { data: profile, error: verifyError } = loginError ? { data: null, error: loginError }
  : await check.from('users').select('peran').eq('id', data.user.id).single()
if (verifyError || profile?.peran !== 'admin') {
  await check.auth.signOut()
  const { error: rollbackError } = await supabase.auth.admin.deleteUser(data.user.id)
  if (rollbackError) throw new Error(`Verifikasi gagal dan akun Auth perlu dibersihkan: ${data.user.id}`)
  throw new Error('Verifikasi login atau profil gagal; akun baru dibatalkan. Periksa konfigurasi Auth dan RLS.')
}
await check.auth.signOut()
console.log(JSON.stringify({ login: 'https://www.smaahlulirfan.sch.id/login', email, password, role: 'admin' }, null, 2))
