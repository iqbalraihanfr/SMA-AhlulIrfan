import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { error } = await supabase.from('pengaturan_situs').select('id').limit(1)
  if (error) {
    console.error("Error connecting to DB:", error.message)
    process.exitCode = 1
  } else {
    console.log("Success! Found tables.")
    for (const table of ['users', 'tahun_ajaran', 'kelas', 'siswa', 'anggota_kelas', 'presensi', 'kehadiran_siswa', 'riwayat_presensi']) {
      const { count, error: accessError, status } = await supabase.from(table).select('id', { head: true, count: 'exact' })
      // HEAD responses have no JSON error body; use HTTP status for denied reads.
      if ((count ?? 0) > 0 || (accessError && accessError.code !== '42501' && ![401, 403].includes(status))) {
        console.error(`FAIL: akses anonim ${table}: ${accessError?.message || `${count} baris terbuka`}`)
        process.exitCode = 1
      }
    }
    if (!process.exitCode) console.log('PASS: data privat tidak dapat dibaca secara anonim.')
  }
}

await check()
