-- ==============================================================================
-- SEED DATA UNTUK SMA AHLUL IRFAN BANGSALSARI
-- Jalankan skrip ini di Supabase SQL Editor (https://supabase.com/dashboard/project/vsfmwdjpcjhgulntvhal/sql)
-- ==============================================================================

-- 1. Pastikan Storage Bucket 'images' ada dan bisa diunggah
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do update set public = true;

drop policy if exists "Anyone can read images" on storage.objects;
create policy "Anyone can read images" on storage.objects for select using (bucket_id = 'images');

drop policy if exists "Allow upload to images" on storage.objects;
create policy "Allow upload to images" on storage.objects for insert with check (bucket_id = 'images');

drop policy if exists "Allow update to images" on storage.objects;
create policy "Allow update to images" on storage.objects for update using (bucket_id = 'images');

-- 2. Kebijakan RLS agar seeder / admin bisa mengisi data
drop policy if exists "Allow seeder insert to pengaturan_situs" on public.pengaturan_situs;
create policy "Allow seeder insert to pengaturan_situs" on public.pengaturan_situs for all using (true) with check (true);

drop policy if exists "Allow seeder insert to guru" on public.guru;
create policy "Allow seeder insert to guru" on public.guru for all using (true) with check (true);

drop policy if exists "Allow seeder insert to konten_halaman" on public.konten_halaman;
create policy "Allow seeder insert to konten_halaman" on public.konten_halaman for all using (true) with check (true);

drop policy if exists "Allow seeder insert to ekstrakurikuler" on public.ekstrakurikuler;
create policy "Allow seeder insert to ekstrakurikuler" on public.ekstrakurikuler for all using (true) with check (true);

drop policy if exists "Allow seeder insert to album" on public.album;
create policy "Allow seeder insert to album" on public.album for all using (true) with check (true);

drop policy if exists "Allow seeder insert to berita" on public.berita;
create policy "Allow seeder insert to berita" on public.berita for all using (true) with check (true);

-- 3. Pengaturan Situs
delete from public.pengaturan_situs;
insert into public.pengaturan_situs (
  id,
  nama_sekolah,
  nama_yayasan,
  semboyan,
  alamat,
  telepon,
  whatsapp,
  email,
  fakta_terverifikasi,
  logo_url
) values (
  1,
  'SMA Ahlul Irfan Bangsalsari',
  'Yayasan Ahlul Irfan Al-Kholily',
  'Berilmu, Berakhlak Mulia, Berprestasi, dan Berdaya Saing Global',
  'Jl. Mawar Gg. Al-Kholily, Langkap, Bangsalsari, Jember, Jawa Timur 68154',
  '081234567890',
  '081234567890',
  'sma.ahlulirfan@gmail.com',
  true,
  'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/logo-sma.webp'
);

-- 4. Guru & Tenaga Kependidikan
delete from public.guru;
insert into public.guru (nama, kategori, jenis_kelamin, jabatan, mata_pelajaran, urutan, aktif, image_url) values
('Fathur Rohman, S.P', 'pendidik', 'L', 'Kepala Sekolah', null, 1, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/fathur-rohman.webp'),
('Nur Rochman Hidayat, S.Pd.', 'pendidik', 'L', 'Wakil Kepala Sekolah', 'Sejarah', 2, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/nur-rochman-hidayat.webp'),
('Hilmi Fathiyatul Baroroh, S.Pd., Gr', 'pendidik', 'P', 'Waka Kurikulum', 'Fisika', 3, true, null),
('Yeni Sri Astutik, S.Pd., Gr', 'pendidik', 'P', 'Waka Kesiswaan', 'Biologi', 4, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/yeni-sri-astutik.webp'),
('Anis Novi Rahayu, S.Pd., Gr', 'pendidik', 'P', 'Waka Sarpras', 'Bahasa Indonesia', 5, true, null),
('Noviani, S.Pd., Gr', 'pendidik', 'P', 'Bendahara', 'Bahasa Inggris', 6, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/noviani.webp'),
('Ahmad Saini, S.Pd., Gr', 'pendidik', 'L', 'Operator Sekolah', 'Ekonomi', 7, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/ahmad-saini.webp'),
('Sofiatul Lailiyah, S.Pd., Gr', 'pendidik', 'P', 'Bimbingan dan Konseling', null, 8, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/sofiatul-lailiyah.webp'),
('Wiwindari Uswatul J, S.Pd., Gr', 'pendidik', 'P', null, 'Geografi', 9, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/wiwindari-uswatul-j.webp'),
('Nuruz Zakiya, M.Pd.', 'pendidik', 'P', null, 'PKN', 10, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/nuruz-zakiya.webp'),
('Siti Habibah, S.Pd.', 'pendidik', 'P', null, 'Matematika', 11, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/siti-habibah.webp'),
('Firda Nurul Azizah, S.Ag', 'pendidik', 'P', null, 'PAI', 12, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/firda-nurul-azizah.webp'),
('Ika Nur Hasanah, S.Pd.', 'pendidik', 'P', null, 'Bahasa Indonesia', 13, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/ika-nur-hasanah.webp'),
('Rofiyatun', 'tenaga_kependidikan', 'P', 'Kepala TU', null, 14, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/rofiyatun.webp'),
('Anik Purwanti', 'tenaga_kependidikan', 'P', 'Staf TU', null, 15, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/anik-purwanti.webp'),
('Muflihatul Jannah', 'tenaga_kependidikan', 'P', 'Staf TU', null, 16, true, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/guru/muflihatul-jannah.webp');

-- 5. Konten Halaman
insert into public.konten_halaman (kunci, judul, isi, terbit) values
(
  'sambutan_kepsek',
  'Sambutan Kepala Sekolah',
  '<p class="arab">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
<p>Assalamu''alaikum Warahmatullahi Wabarakatuh</p>
<p>Alhamdulillahirabbil ''alamin, segala puji bagi Allah SWT atas limpahan rahmat, taufik, dan hidayah-Nya sehingga Website Resmi SMA Ahlul Irfan Bangsalsari dapat menjadi media informasi, komunikasi, dan pelayanan bagi seluruh warga sekolah serta masyarakat luas.</p>
<p>Selamat datang di Website SMA Ahlul Irfan Bangsalsari.</p>
<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan yang berada di bawah naungan Pondok Pesantren Ahlul Irfan Al-Kholily. Kami berkomitmen untuk menyelenggarakan pendidikan yang mampu menyeimbangkan keunggulan akademik, pembentukan karakter Islami, serta pengembangan potensi peserta didik sehingga lahir generasi yang beriman, berilmu, berakhlakul karimah, mandiri, dan siap menghadapi tantangan zaman.</p>
<p>Wassalamu''alaikum Warahmatullahi Wabarakatuh.</p>',
  true
),
(
  'kurikulum',
  'Kurikulum',
  '<p>SMA Ahlul Irfan Bangsalsari menerapkan Kurikulum Merdeka sebagai dasar penyelenggaraan pendidikan yang dipadukan dengan pendidikan karakter Islami. Kurikulum ini dirancang untuk membentuk peserta didik yang memiliki kompetensi akademik, berakhlakul karimah, berwawasan kebangsaan, serta mampu menghadapi tantangan perkembangan ilmu pengetahuan dan teknologi.</p>
<p>Proses pembelajaran dilaksanakan secara aktif, kreatif, inovatif, dan menyenangkan dengan memberikan ruang bagi peserta didik untuk mengembangkan potensi, minat, dan bakat sesuai Profil Pelajar Pancasila.</p>',
  true
),
(
  'sejarah',
  'Sejarah',
  '<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan menengah atas swasta yang berlokasi di Desa Langkap, Kecamatan Bangsalsari, Kabupaten Jember, Jawa Timur. Sekolah ini pertama kali didirikan pada tanggal 3 November 2003 berdasarkan Surat Keputusan Nomor 421/1334/463.41.6/2003 dengan nama SMA 06 Ma''arif Bangsalsari.</p>
<p>Seiring perkembangan zaman serta adanya perubahan dalam pengelolaan lembaga pendidikan, pada tahun 2022 sekolah resmi berganti nama menjadi SMA Ahlul Irfan Bangsalsari di bawah naungan Yayasan Ahlul Irfan Al-Kholily.</p>',
  true
),
(
  'visi_misi',
  'Visi dan Misi',
  '<h3>Visi</h3>
<blockquote><p>Terwujudnya Peserta Didik yang Unggul dalam Keilmuan dan Keimanan, Berakhlakul Karimah, serta Berkarakter Pancasila.</p></blockquote>
<h3>Misi</h3>
<ol>
<li>Menyelenggarakan pembelajaran yang berkualitas, berpusat pada peserta didik, serta mengembangkan kemampuan literasi dan numerasi.</li>
<li>Menanamkan nilai-nilai keimanan, ketakwaan, serta akhlakul karimah melalui integrasi pendidikan formal dan kepesantrenan.</li>
<li>Mengembangkan potensi peserta didik sesuai minat dan bakat melalui kegiatan akademik dan non-akademik.</li>
</ol>',
  true
)
on conflict (kunci) do update set
  judul = excluded.judul,
  isi = excluded.isi,
  terbit = excluded.terbit;

-- 6. Ekstrakurikuler
insert into public.ekstrakurikuler (nama, slug, urutan) values
('Pramuka', 'pramuka', 1),
('Paskibra', 'paskibra', 2),
('Hadrah', 'hadrah', 3),
('Futsal', 'futsal', 4),
('Voli', 'voli', 5),
('Tata Boga', 'tata-boga', 6),
('Tata Rias', 'tata-rias', 7)
on conflict (slug) do update set
  nama = excluded.nama,
  urutan = excluded.urutan;

-- 7. Album Galeri
insert into public.album (judul, slug, urutan, image_url) values
('Gedung & Fasilitas Sekolah', 'gedung-fasilitas', 1, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/gedung-yayasan.webp'),
('Kegiatan Belajar Santri', 'kegiatan-belajar-santri', 2, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/santri-putra-mengaji.webp'),
('Pembinaan Karakter Santri', 'pembinaan-karakter', 3, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/pembinaan-santri-putra.webp'),
('Laboratorium Terpadu', 'laboratorium-terpadu', 4, 'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/ruang-laboratorium.webp')
on conflict (slug) do update set
  judul = excluded.judul,
  urutan = excluded.urutan,
  image_url = excluded.image_url;

-- 8. Berita
insert into public.berita (judul, slug, ringkasan, isi, status, diterbitkan_pada, image_url) values
(
  'Penerimaan Peserta Didik Baru (PPDB) SMA Ahlul Irfan Tahun Ajaran 2026/2027',
  'ppdb-sma-ahlul-irfan-2026-2027',
  'Pendaftaran peserta didik baru SMA Ahlul Irfan Bangsalsari tahun ajaran 2026/2027 telah resmi dibuka.',
  '<p>SMA Ahlul Irfan Bangsalsari membuka pendaftaran peserta didik baru untuk tahun ajaran 2026/2027 dengan program unggulan keterpaduan sains dan kurikulum pesantren.</p>',
  'terbit',
  now() - interval '2 days',
  'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/gedung-yayasan.webp'
),
(
  'Pembinaan Karakter Santri dan Siswa Menuju Generasi Berakhlakul Karimah',
  'pembinaan-karakter-santri-dan-siswa',
  'Kegiatan pembinaan rutin untuk menanamkan kedisiplinan, adab, dan kepemimpinan Islami.',
  '<p>Pembinaan karakter dilaksanakan terpadu antara kegiatan sekolah menengah atas dengan asrama pondok pesantren.</p>',
  'terbit',
  now() - interval '5 days',
  'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/pembinaan-santri-putra.webp'
),
(
  'Praktikum Sains di Laboratorium Terpadu SMA Ahlul Irfan',
  'praktikum-sains-laboratorium-terpadu',
  'Meningkatkan pemahaman peserta didik melalui eksperimen langsung di ruang laboratorium yang lengkap.',
  '<p>Pembelajaran sains diperkuat dengan praktikum aktif agar siswa memahami konsep secara mendalam dan aplikatif.</p>',
  'terbit',
  now() - interval '10 days',
  'https://vsfmwdjpcjhgulntvhal.supabase.co/storage/v1/object/public/images/galeri/ruang-laboratorium.webp'
)
on conflict (slug) do update set
  judul = excluded.judul,
  ringkasan = excluded.ringkasan,
  isi = excluded.isi,
  status = excluded.status,
  diterbitkan_pada = excluded.diterbitkan_pada,
  image_url = excluded.image_url;
