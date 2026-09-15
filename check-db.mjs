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
  }
}

await check()
