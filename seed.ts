import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
function loadEnv() {
  const possiblePaths = [
    path.join(process.cwd(), 'web', '.env.local'),
    path.join(process.cwd(), '.env.local'),
    path.join(__dirname, '.env.local'),
  ]

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=')
          if (idx !== -1) {
            const key = trimmed.substring(0, idx).trim()
            const val = trimmed.substring(idx + 1).trim()
            if (!process.env[key]) {
              process.env[key] = val
            }
          }
        }
      }
      break
    }
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Kredensial Supabase tidak ditemukan di .env.local')
  process.exit(1)
}

const isServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log(`📡 Menghubungkan ke Supabase: ${supabaseUrl}`)
console.log(`🔑 Menggunakan kunci: ${isServiceRole ? 'SERVICE_ROLE (Akses Admin)' : 'ANON_KEY (Akses Publik)'}`)

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

// Cari direktori aset sekolah
function findAssetsDir(): string {
  const candidates = [
    path.join(process.cwd(), 'laravel-archive', 'database', 'seeders', 'assets'),
    path.join(process.cwd(), '..', 'database', 'seeders', 'assets'),
    path.join(process.cwd(), 'storage', 'app', 'public'),
    path.join(process.cwd(), '..', 'storage', 'app', 'public'),
  ]

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c
    }
  }
  return candidates[0]
}

const assetsDir = findAssetsDir()
const guruAssetsDir = path.join(assetsDir, 'guru')
const galeriAssetsDir = path.join(assetsDir, 'galeri')

async function uploadFile(bucket: string, storagePath: string, localFilePath: string, contentType = 'image/webp') {
  if (!fs.existsSync(localFilePath)) {
    console.warn(`⚠️ Berkas lokal tidak ditemukan: ${localFilePath}`)
    return null
  }

  const fileBuffer = fs.readFileSync(localFilePath)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    console.error(`❌ Gagal mengunggah ${storagePath}:`, error.message)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  console.log(`✅ Terunggah: ${storagePath} -> ${publicUrlData.publicUrl}`)
  return publicUrlData.publicUrl
}

async function main() {
  console.log('\n--- 1. MEMBUAT / MEMERIKSA BUCKET STORAGE ---')
  const { error: bucketError } = await supabase.storage.createBucket('images', {
    public: true,
  })
  if (bucketError && !bucketError.message.includes('already exists') && !bucketError.message.includes('duplicate')) {
    console.warn(`ℹ️ Info bucket: ${bucketError.message}`)
  } else {
    console.log('✅ Bucket "images" siap dan bersifat publik.')
  }

  console.log('\n--- 2. MENGUNGGAH ASET GAMBAR ---')
  const uploadedUrls: Record<string, string> = {}

  // 1. Logo
  const logoPath = path.join(assetsDir, 'logo-sma.webp')
  const fallbackLogoPath = path.join(assetsDir, '..', '..', '..', 'public', 'branding', 'logo.png')
  const actualLogoPath = fs.existsSync(logoPath) ? logoPath : (fs.existsSync(fallbackLogoPath) ? fallbackLogoPath : '')
  
  if (actualLogoPath) {
    const logoUrl = await uploadFile('images', 'logo-sma.webp', actualLogoPath, 'image/webp')
    if (logoUrl) uploadedUrls['logo'] = logoUrl
  }

  // 2. Foto Guru
  if (fs.existsSync(guruAssetsDir)) {
    const guruFiles = fs.readdirSync(guruAssetsDir).filter((f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
    for (const file of guruFiles) {
      const fullPath = path.join(guruAssetsDir, file)
      const url = await uploadFile('images', `guru/${file}`, fullPath, 'image/webp')
      if (url) uploadedUrls[`guru/${file}`] = url
    }
  }

  // 3. Foto Galeri
  if (fs.existsSync(galeriAssetsDir)) {
    const galeriFiles = fs.readdirSync(galeriAssetsDir).filter((f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
    for (const file of galeriFiles) {
      const fullPath = path.join(galeriAssetsDir, file)
      const url = await uploadFile('images', `galeri/${file}`, fullPath, 'image/webp')
      if (url) uploadedUrls[`galeri/${file}`] = url
    }
  }

  // Fallback public URLs jika upload storage terhalang RLS anon
  const getPublicImageUrl = (subpath: string) => {
    return uploadedUrls[subpath] || `${supabaseUrl}/storage/v1/object/public/images/${subpath}`
  }

  console.log('\n--- 3. SEEDING TABEL DATABASE ---')

  // A. Pengaturan Situs
  console.log('🌱 Menyemai pengaturan_situs...')
  const pengaturanPayload = {
    nama_sekolah: 'SMA Ahlul Irfan Bangsalsari',
    nama_yayasan: 'Yayasan Ahlul Irfan Al-Kholily',
    semboyan: 'Berilmu, Berakhlak Mulia, Berprestasi, dan Berdaya Saing Global',
    alamat: 'Jl. Mawar Gg. Al-Kholily, Langkap, Bangsalsari, Jember, Jawa Timur 68154',
    telepon: '081234567890',
    whatsapp: '081234567890',
    email: 'sma.ahlulirfan@gmail.com',
    fakta_terverifikasi: true,
    logo_url: getPublicImageUrl('logo-sma.webp'),
  }

  const { error: errPengaturan } = await supabase.from('pengaturan_situs').upsert(
    [{ id: 1, ...pengaturanPayload }],
    { onConflict: 'id' }
  )
  if (errPengaturan) console.error('Galat pengaturan_situs:', errPengaturan.message)
  else console.log('✅ pengaturan_situs tersimpan.')

  // B. Guru & Tendik
  console.log('🌱 Menyemai guru & tendik...')
  const daftarGuru = [
    { nama: 'Fathur Rohman, S.P', jk: 'L', jabatan: 'Kepala Sekolah', mapel: null, file: 'fathur-rohman.webp', kat: 'pendidik', urut: 1 },
    { nama: 'Nur Rochman Hidayat, S.Pd.', jk: 'L', jabatan: 'Wakil Kepala Sekolah', mapel: 'Sejarah', file: 'nur-rochman-hidayat.webp', kat: 'pendidik', urut: 2 },
    { nama: 'Hilmi Fathiyatul Baroroh, S.Pd., Gr', jk: 'P', jabatan: 'Waka Kurikulum', mapel: 'Fisika', file: null, kat: 'pendidik', urut: 3 },
    { nama: 'Yeni Sri Astutik, S.Pd., Gr', jk: 'P', jabatan: 'Waka Kesiswaan', mapel: 'Biologi', file: 'yeni-sri-astutik.webp', kat: 'pendidik', urut: 4 },
    { nama: 'Anis Novi Rahayu, S.Pd., Gr', jk: 'P', jabatan: 'Waka Sarpras', mapel: 'Bahasa Indonesia', file: null, kat: 'pendidik', urut: 5 },
    { nama: 'Noviani, S.Pd., Gr', jk: 'P', jabatan: 'Bendahara', mapel: 'Bahasa Inggris', file: 'noviani.webp', kat: 'pendidik', urut: 6 },
    { nama: 'Ahmad Saini, S.Pd., Gr', jk: 'L', jabatan: 'Operator Sekolah', mapel: 'Ekonomi', file: 'ahmad-saini.webp', kat: 'pendidik', urut: 7 },
    { nama: 'Sofiatul Lailiyah, S.Pd., Gr', jk: 'P', jabatan: 'Bimbingan dan Konseling', mapel: null, file: 'sofiatul-lailiyah.webp', kat: 'pendidik', urut: 8 },
    { nama: 'Wiwindari Uswatul J, S.Pd., Gr', jk: 'P', jabatan: null, mapel: 'Geografi', file: 'wiwindari-uswatul-j.webp', kat: 'pendidik', urut: 9 },
    { nama: 'Nuruz Zakiya, M.Pd.', jk: 'P', jabatan: null, mapel: 'PKN', file: 'nuruz-zakiya.webp', kat: 'pendidik', urut: 10 },
    { nama: 'Siti Habibah, S.Pd.', jk: 'P', jabatan: null, mapel: 'Matematika', file: 'siti-habibah.webp', kat: 'pendidik', urut: 11 },
    { nama: 'Firda Nurul Azizah, S.Ag', jk: 'P', jabatan: null, mapel: 'PAI', file: 'firda-nurul-azizah.webp', kat: 'pendidik', urut: 12 },
    { nama: 'Ika Nur Hasanah, S.Pd.', jk: 'P', jabatan: null, mapel: 'Bahasa Indonesia', file: 'ika-nur-hasanah.webp', kat: 'pendidik', urut: 13 },
    { nama: 'Rofiyatun', jk: 'P', jabatan: 'Kepala TU', mapel: null, file: 'rofiyatun.webp', kat: 'tenaga_kependidikan', urut: 14 },
    { nama: 'Anik Purwanti', jk: 'P', jabatan: 'Staf TU', mapel: null, file: 'anik-purwanti.webp', kat: 'tenaga_kependidikan', urut: 15 },
    { nama: 'Muflihatul Jannah', jk: 'P', jabatan: 'Staf TU', mapel: null, file: 'muflihatul-jannah.webp', kat: 'tenaga_kependidikan', urut: 16 },
  ]

  for (const g of daftarGuru) {
    const { data: existing } = await supabase.from('guru').select('id').eq('nama', g.nama).limit(1)
    const payload = {
      nama: g.nama,
      kategori: g.kat,
      jenis_kelamin: g.jk,
      jabatan: g.jabatan,
      mata_pelajaran: g.mapel,
      urutan: g.urut,
      aktif: true,
      image_url: g.file ? getPublicImageUrl(`guru/${g.file}`) : null,
    }
    let errGuru = null
    if (existing && existing.length > 0) {
      const res = await supabase.from('guru').update(payload).eq('id', existing[0].id)
      errGuru = res.error
    } else {
      const res = await supabase.from('guru').insert(payload)
      errGuru = res.error
    }
    if (errGuru) console.error(`Galat guru ${g.nama}:`, errGuru.message)
  }
  console.log(`✅ ${daftarGuru.length} guru & tendik diproses.`)

  // C. Konten Halaman (Sambutan, Kurikulum, Sejarah, Visi Misi)
  console.log('🌱 Menyemai konten_halaman...')
  const halamanList = [
    {
      kunci: 'sambutan_kepsek',
      judul: 'Sambutan Kepala Sekolah',
      isi: `<p class="arab">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
<p>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
<p>Alhamdulillahirabbil 'alamin, segala puji bagi Allah SWT atas limpahan rahmat, taufik, dan hidayah-Nya sehingga Website Resmi SMA Ahlul Irfan Bangsalsari dapat menjadi media informasi, komunikasi, dan pelayanan bagi seluruh warga sekolah serta masyarakat luas.</p>
<p>Selamat datang di Website SMA Ahlul Irfan Bangsalsari.</p>
<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan yang berada di bawah naungan Pondok Pesantren Ahlul Irfan Al-Kholily. Kami berkomitmen untuk menyelenggarakan pendidikan yang mampu menyeimbangkan keunggulan akademik, pembentukan karakter Islami, serta pengembangan potensi peserta didik sehingga lahir generasi yang beriman, berilmu, berakhlakul karimah, mandiri, dan siap menghadapi tantangan zaman.</p>
<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>`,
      terbit: true,
    },
    {
      kunci: 'kurikulum',
      judul: 'Kurikulum',
      isi: `<p>SMA Ahlul Irfan Bangsalsari menerapkan Kurikulum Merdeka sebagai dasar penyelenggaraan pendidikan yang dipadukan dengan pendidikan karakter Islami. Kurikulum ini dirancang untuk membentuk peserta didik yang memiliki kompetensi akademik, berakhlakul karimah, berwawasan kebangsaan, serta mampu menghadapi tantangan perkembangan ilmu pengetahuan dan teknologi.</p>
<p>Proses pembelajaran dilaksanakan secara aktif, kreatif, inovatif, dan menyenangkan dengan memberikan ruang bagi peserta didik untuk mengembangkan potensi, minat, dan bakat sesuai Profil Pelajar Pancasila.</p>`,
      terbit: true,
    },
    {
      kunci: 'sejarah',
      judul: 'Sejarah',
      isi: `<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan menengah atas swasta yang berlokasi di Desa Langkap, Kecamatan Bangsalsari, Kabupaten Jember, Jawa Timur. Sekolah ini pertama kali didirikan pada tanggal 3 November 2003 berdasarkan Surat Keputusan Nomor 421/1334/463.41.6/2003 dengan nama SMA 06 Ma'arif Bangsalsari.</p>
<p>Seiring perkembangan zaman serta adanya perubahan dalam pengelolaan lembaga pendidikan, pada tahun 2022 sekolah resmi berganti nama menjadi SMA Ahlul Irfan Bangsalsari di bawah naungan Yayasan Ahlul Irfan Al-Kholily.</p>`,
      terbit: true,
    },
    {
      kunci: 'visi_misi',
      judul: 'Visi dan Misi',
      isi: `<h3>Visi</h3>
<blockquote><p>Terwujudnya Peserta Didik yang Unggul dalam Keilmuan dan Keimanan, Berakhlakul Karimah, serta Berkarakter Pancasila.</p></blockquote>
<h3>Misi</h3>
<ol>
<li>Menyelenggarakan pembelajaran yang berkualitas, berpusat pada peserta didik, serta mengembangkan kemampuan literasi dan numerasi.</li>
<li>Menanamkan nilai-nilai keimanan, ketakwaan, serta akhlakul karimah melalui integrasi pendidikan formal dan kepesantrenan.</li>
<li>Mengembangkan potensi peserta didik sesuai minat dan bakat melalui kegiatan akademik dan non-akademik.</li>
</ol>`,
      terbit: true,
    },
  ]

  for (const h of halamanList) {
    const { error: errHalaman } = await supabase.from('konten_halaman').upsert(
      h,
      { onConflict: 'kunci' }
    )
    if (errHalaman) console.error(`Galat konten_halaman ${h.kunci}:`, errHalaman.message)
  }
  console.log(`✅ ${halamanList.length} naskah halaman diproses.`)

  // D. Ekstrakurikuler
  console.log('🌱 Menyemai ekstrakurikuler...')
  const ekskulList = [
    { nama: 'Pramuka', slug: 'pramuka', urutan: 1 },
    { nama: 'Paskibra', slug: 'paskibra', urutan: 2 },
    { nama: 'Hadrah', slug: 'hadrah', urutan: 3 },
    { nama: 'Futsal', slug: 'futsal', urutan: 4 },
    { nama: 'Voli', slug: 'voli', urutan: 5 },
    { nama: 'Tata Boga', slug: 'tata-boga', urutan: 6 },
    { nama: 'Tata Rias', slug: 'tata-rias', urutan: 7 },
  ]

  for (const e of ekskulList) {
    const { error: errEkskul } = await supabase.from('ekstrakurikuler').upsert(
      e,
      { onConflict: 'slug' }
    )
    if (errEkskul) console.error(`Galat ekstrakurikuler ${e.nama}:`, errEkskul.message)
  }
  console.log(`✅ ${ekskulList.length} ekstrakurikuler diproses.`)

  // E. Album Galeri
  console.log('🌱 Menyemai album...')
  const albumList = [
    { judul: 'Gedung & Fasilitas Sekolah', slug: 'gedung-fasilitas', urutan: 1, file: 'gedung-yayasan.webp' },
    { judul: 'Kegiatan Belajar Santri', slug: 'kegiatan-belajar-santri', urutan: 2, file: 'santri-putra-mengaji.webp' },
    { judul: 'Pembinaan Karakter Santri', slug: 'pembinaan-karakter', urutan: 3, file: 'pembinaan-santri-putra.webp' },
    { judul: 'Laboratorium Terpadu', slug: 'laboratorium-terpadu', urutan: 4, file: 'ruang-laboratorium.webp' },
  ]

  for (const a of albumList) {
    const { error: errAlbum } = await supabase.from('album').upsert(
      {
        judul: a.judul,
        slug: a.slug,
        urutan: a.urutan,
        image_url: getPublicImageUrl(`galeri/${a.file}`),
      },
      { onConflict: 'slug' }
    )
    if (errAlbum) console.error(`Galat album ${a.judul}:`, errAlbum.message)
  }
  console.log(`✅ ${albumList.length} album diproses.`)

  // F. Berita Terbaru
  console.log('🌱 Menyemai berita...')
  const beritaList = [
    {
      judul: 'Penerimaan Peserta Didik Baru (PPDB) SMA Ahlul Irfan Tahun Ajaran 2026/2027',
      slug: 'ppdb-sma-ahlul-irfan-2026-2027',
      ringkasan: 'Pendaftaran peserta didik baru SMA Ahlul Irfan Bangsalsari tahun ajaran 2026/2027 telah resmi dibuka.',
      isi: '<p>SMA Ahlul Irfan Bangsalsari membuka pendaftaran peserta didik baru untuk tahun ajaran 2026/2027 dengan program unggulan keterpaduan sains dan kurikulum pesantren.</p>',
      status: 'terbit',
      diterbitkan_pada: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      file: 'gedung-yayasan.webp',
    },
    {
      judul: 'Pembinaan Karakter Santri dan Siswa Menuju Generasi Berakhlakul Karimah',
      slug: 'pembinaan-karakter-santri-dan-siswa',
      ringkasan: 'Kegiatan pembinaan rutin untuk menanamkan kedisiplinan, adab, dan kepemimpinan Islami.',
      isi: '<p>Pembinaan karakter dilaksanakan terpadu antara kegiatan sekolah menengah atas dengan asrama pondok pesantren.</p>',
      status: 'terbit',
      diterbitkan_pada: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      file: 'pembinaan-santri-putra.webp',
    },
    {
      judul: 'Praktikum Sains di Laboratorium Terpadu SMA Ahlul Irfan',
      slug: 'praktikum-sains-laboratorium-terpadu',
      ringkasan: 'Meningkatkan pemahaman peserta didik melalui eksperimen langsung di ruang laboratorium yang lengkap.',
      isi: '<p>Pembelajaran sains diperkuat dengan praktikum aktif agar siswa memahami konsep secara mendalam dan aplikatif.</p>',
      status: 'terbit',
      diterbitkan_pada: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      file: 'ruang-laboratorium.webp',
    },
  ]

  for (const b of beritaList) {
    const { error: errBerita } = await supabase.from('berita').upsert(
      {
        judul: b.judul,
        slug: b.slug,
        ringkasan: b.ringkasan,
        isi: b.isi,
        status: b.status,
        diterbitkan_pada: b.diterbitkan_pada,
        image_url: getPublicImageUrl(`galeri/${b.file}`),
      },
      { onConflict: 'slug' }
    )
    if (errBerita) console.error(`Galat berita ${b.judul}:`, errBerita.message)
  }
  console.log(`✅ ${beritaList.length} berita diproses.`)

  console.log('\n🎉 Selesai! Seluruh proses seeding telah dieksekusi.')
}

main().catch((err) => {
  console.error('Fatal error saat seeding:', err)
  process.exit(1)
})
