import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'
import { existsSync } from 'node:fs'
import { test } from 'node:test'

// Node 24 strips TypeScript; resolve the same local paths used by Next.js.
registerHooks({ resolve(specifier, context, nextResolve) {
  const path = specifier.startsWith('@/') ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url)
    : specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier) ? new URL(`${specifier}.ts`, context.parentURL) : null
  return nextResolve(path && existsSync(path) ? path.href : specifier, context)
} })

const { tanggalSchema, beritaSchema, albumSchema, cleanHtml, buatSlug, jadwalPublikasi, nomorWhatsApp } = await import('../src/lib/konten.ts')
const { rekapFilterSchema, buatCsv } = await import('../src/lib/rekap-format.ts')
const { optimalkanGambar, hitungUkuranTarget } = await import('../src/lib/optimalkanGambar.ts')

test('school publishing and export preserve content while rejecting invalid input', async () => {
  assert.equal(tanggalSchema.safeParse('2024-02-29').success, true)
  for (const date of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-2-01']) assert.equal(tanggalSchema.safeParse(date).success, false)
  const news = { judul: 'Kegiatan Sekolah', isi: '<p>Berita</p>', status: 'terbit', diterbitkan_pada: '2026-10-05T08:30' }
  assert.equal(beritaSchema.safeParse(news).success, true)
  assert.equal(beritaSchema.safeParse({ ...news, status: 'draf' }).success, false)
  assert.equal(beritaSchema.safeParse({ ...news, diterbitkan_pada: '2026-10-05T24:00' }).success, false)
  assert.equal(beritaSchema.safeParse({ ...news, image_url: 'javascript:alert(1)' }).success, false)
  assert.equal(jadwalPublikasi('terbit', news.diterbitkan_pada), '2026-10-05T01:30:00.000Z')
  assert.equal(jadwalPublikasi('draft', ''), null)
  assert.equal(jadwalPublikasi('terbit', '', new Date('2026-10-05T01:00Z')), '2026-10-05T01:00:00.000Z')
  assert.equal(buatSlug('Kegiatan Café & Sekolah!'), 'kegiatan-cafe-sekolah')
  assert.equal(nomorWhatsApp('0812-3456-7890'), '6281234567890')
  const html = cleanHtml('<script>alert(1)</script><figure><img src="https://example.org/photo.jpg" onerror="alert(1)"><figcaption>Kegiatan siswa</figcaption></figure><a href="javascript:alert(1)">klik</a>')
  assert.match(html, /<figcaption>Kegiatan siswa<\/figcaption>/)
  assert.doesNotMatch(html, /script|onerror|javascript/)
  const album = { judul: 'Kegiatan', urutan: '0', foto_urls: ['https://example.org/a.jpg', 'https://example.org/b.jpg'] }
  assert.equal(albumSchema.safeParse(album).success, true)
  assert.equal(albumSchema.safeParse({ ...album, foto_urls: Array(51).fill(album.foto_urls[0]) }).success, false)
  assert.equal(rekapFilterSchema.safeParse({ tahun_ajaran_id: 1, mulai: '2026-10-05', selesai: '2026-10-01' }).success, false)
  assert.equal(rekapFilterSchema.safeParse({ tahun_ajaran_id: 1, mulai: '2026-10-01', selesai: '2026-10-05' }).success, true)
  const csv = buatCsv([{ kelas: 'X, A', kode_siswa: '=1+1', nama: 'Siswa "A"\nBaris', hadir: 1, sakit: 0, izin: 0, alpa: 0, terlambat: 1, total: 2, persentase: 100 }])
  assert.equal(csv.charCodeAt(0), 0xfeff)
  assert.match(csv, /"X, A","'=1\+1","Siswa ""A""\nBaris"/)
  assert.ok(csv.endsWith('\r\n'))
  assert.deepEqual(hitungUkuranTarget(6000, 4000), { lebar: 2560, tinggi: 1707 })
  const file = new File(['a'.repeat(1000)], 'foto.png', { type: 'image/png' })
  const compressed = await optimalkanGambar(file, async () => new Blob(['small'], { type: 'image/webp' }))
  assert.equal(compressed.berkas.name, 'foto.webp')
  assert.equal(compressed.berkas.type, 'image/webp')
  assert.equal(compressed.berkas.size, 5)
  const fallback = await optimalkanGambar(file, async () => { throw new Error('Decoder unavailable') })
  assert.equal(fallback.berkas, file)
  assert.equal(fallback.status, 'gagal')
  const pngFallback = await optimalkanGambar(file, async () => new Blob(['small'], { type: 'image/png' }))
  assert.equal(pngFallback.berkas, file)
})
