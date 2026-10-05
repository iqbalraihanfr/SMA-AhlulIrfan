import { createClient } from '@/lib/supabase/server'
import { loadRekap } from '@/lib/rekap'
import { buatCsv } from '@/lib/rekap-format'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Silakan masuk kembali.' }, { status: 401 })
  try {
    const { baris, filter, error } = await loadRekap(Object.fromEntries(new URL(request.url).searchParams))
    if (error || !filter) return Response.json({ error: error || 'Filter tidak valid.' }, { status: 400 })
    return new Response(buatCsv(baris), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="rekap-presensi-${filter.mulai}-${filter.selesai}.csv"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Ekspor rekap gagal:', error)
    return Response.json({ error: 'Ekspor belum berhasil. Periksa izin dan konfigurasi rekap.' }, { status: 500 })
  }
}
