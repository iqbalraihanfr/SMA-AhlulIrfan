import { createClient } from '@/lib/supabase/server'
import { rekapFilterSchema, type BarisRekap } from '@/lib/rekap-format'

export async function loadRekap(params: Record<string, string | undefined>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Sesi berakhir. Silakan masuk kembali.')
  const { data: profile, error: profileError } = await supabase.from('users').select('peran').eq('id', user.id).single()
  if (profileError || !['admin', 'super-admin', 'guru'].includes(profile?.peran)) throw new Error('Akun tidak memiliki izin melihat rekap.')

  const { data: tahunAjaran, error: tahunError } = await supabase.from('tahun_ajaran').select('id, nama, semester, aktif, mulai_pada, selesai_pada').order('aktif', { ascending: false }).order('mulai_pada', { ascending: false })
  if (tahunError) throw new Error(tahunError.message)
  const periode = params.tahun_ajaran_id ? tahunAjaran?.find((t) => String(t.id) === params.tahun_ajaran_id) : tahunAjaran?.[0]
  if (!periode) return { tahunAjaran: tahunAjaran ?? [], kelas: [], baris: [], filter: null, error: 'Pilih tahun ajaran yang tersedia.' }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())
  const selesai = today < periode.mulai_pada ? periode.mulai_pada : today > periode.selesai_pada ? periode.selesai_pada : today
  const result = rekapFilterSchema.safeParse({
    tahun_ajaran_id: periode.id, kelas_id: params.kelas_id,
    mulai: params.mulai ?? periode.mulai_pada, selesai: params.selesai ?? selesai,
  })
  const { data: kelas, error: kelasError } = await supabase.from('kelas').select('id, nama').eq('tahun_ajaran_id', periode.id).order('nama')
  if (kelasError) throw new Error(kelasError.message)
  if (!result.success) return { tahunAjaran: tahunAjaran ?? [], kelas: kelas ?? [], baris: [], filter: null, error: result.error.issues[0]?.message || 'Filter tidak valid.' }
  const filter = result.data
  if (filter.kelas_id && !kelas?.some((k) => k.id === filter.kelas_id)) throw new Error('Kelas tidak tersedia untuk akun atau periode ini.')
  const baris: BarisRekap[] = []
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.rpc('rekap_presensi', {
      p_tahun_ajaran_id: filter.tahun_ajaran_id, p_kelas_id: filter.kelas_id,
      p_mulai: filter.mulai, p_selesai: filter.selesai,
    }).order('kelas_id').order('siswa_id').range(offset, offset + 999)
    if (error) throw new Error(error.message)
    const rows = (data ?? []) as BarisRekap[]
    baris.push(...rows)
    if (rows.length < 1000) break
  }
  return { tahunAjaran: tahunAjaran ?? [], kelas: kelas ?? [], baris, filter, error: null }
}
