import { createClient } from '@/lib/supabase/client'
import { optimalkanGambar, tipeGambarDapatDioptimalkan } from '@/lib/optimalkanGambar'

export async function unggahGambar(file: File, folder: string): Promise<string> {
  if (!tipeGambarDapatDioptimalkan(file.type)) throw new Error('Pilih foto JPG, PNG, atau WebP.')
  if (file.size > 20 * 1024 * 1024) throw new Error('Foto sumber maksimal 20 MB.')

  const { berkas } = await optimalkanGambar(file)
  if (berkas.size > 8 * 1024 * 1024) throw new Error('Foto masih melebihi 8 MB setelah kompresi. Pilih foto yang lebih kecil.')
  const supabase = createClient()
  const extension = berkas.type === 'image/jpeg' ? 'jpg' : berkas.type === 'image/png' ? 'png' : 'webp'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { data, error } = await supabase.storage.from('images').upload(path, berkas, { contentType: berkas.type })
  if (error) throw new Error(`Foto gagal diunggah: ${error.message}`)
  return supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
}
