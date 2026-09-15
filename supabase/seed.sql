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

drop policy if exists "Allow seeder insert to struktur_organisasi" on public.struktur_organisasi;
create policy "Allow seeder insert to struktur_organisasi" on public.struktur_organisasi for all using (true) with check (true);

drop policy if exists "Allow seeder insert to tahun_ajaran" on public.tahun_ajaran;
create policy "Allow seeder insert to tahun_ajaran" on public.tahun_ajaran for all using (true) with check (true);

drop policy if exists "Allow seeder insert to kelas" on public.kelas;
create policy "Allow seeder insert to kelas" on public.kelas for all using (true) with check (true);

drop policy if exists "Allow seeder insert to siswa" on public.siswa;
create policy "Allow seeder insert to siswa" on public.siswa for all using (true) with check (true);

drop policy if exists "Allow seeder insert to anggota_kelas" on public.anggota_kelas;
create policy "Allow seeder insert to anggota_kelas" on public.anggota_kelas for all using (true) with check (true);

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

-- 9. Struktur Organisasi
delete from public.struktur_organisasi;
with kepsek as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Kepala Sekolah', id, null, 'orang', 1, 0
  from public.guru where nama = 'Fathur Rohman, S.P' limit 1
  returning id
),
komite as (
  insert into public.struktur_organisasi (label, nama_luar, atasan_id, tipe, baris, urutan)
  select 'Komite Sekolah', 'Asmiatul Hosani, A. Akun.', id, 'penasihat', 1, 0
  from kepsek
),
wakil as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Wakil Kepala Sekolah', id, (select id from kepsek), 'orang', 1, 1
  from public.guru where nama = 'Nur Rochman Hidayat, S.Pd.' limit 1
  returning id
),
tu as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Kepala TU', id, (select id from kepsek), 'orang', 1, 2
  from public.guru where nama = 'Rofiyatun' limit 1
  returning id
),
operator as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Operator Sekolah', id, (select id from tu), 'orang', 1, 0
  from public.guru where nama = 'Ahmad Saini, S.Pd., Gr' limit 1
),
waka1 as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Waka Kurikulum', id, (select id from wakil), 'orang', 1, 0
  from public.guru where nama = 'Hilmi Fathiyatul Baroroh, S.Pd., Gr' limit 1
),
waka2 as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Waka Kesiswaan', id, (select id from wakil), 'orang', 1, 1
  from public.guru where nama = 'Yeni Sri Astutik, S.Pd., Gr' limit 1
),
waka3 as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Waka Sarpras', id, (select id from wakil), 'orang', 1, 2
  from public.guru where nama = 'Anis Novi Rahayu, S.Pd., Gr' limit 1
),
bendahara as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'Bendahara', id, (select id from wakil), 'orang', 1, 3
  from public.guru where nama = 'Noviani, S.Pd., Gr' limit 1
),
bk as (
  insert into public.struktur_organisasi (label, guru_id, atasan_id, tipe, baris, urutan)
  select 'BK (Bimbingan Konseling)', id, (select id from wakil), 'orang', 2, 0
  from public.guru where nama = 'Sofiatul Lailiyah, S.Pd., Gr' limit 1
),
wali_kelas as (
  insert into public.struktur_organisasi (label, atasan_id, tipe, baris, urutan)
  select 'Wali Kelas', id, 'kelompok', 2, 1
  from wakil
  returning id
),
guru_mapel as (
  insert into public.struktur_organisasi (label, atasan_id, tipe, baris, urutan)
  select 'Guru Mapel', id, 'kelompok', 2, 2
  from wakil
)
insert into public.struktur_organisasi (label, atasan_id, tipe, baris, urutan)
select 'Siswa - Siswi', id, 'kelompok', 1, 0
from wali_kelas;

-- ==============================================================================
-- 10. Data Akademik & Absensi (Tahun Ajaran, Kelas, Siswa, Anggota Kelas)
-- ==============================================================================

-- 10.1. Tahun Ajaran
insert into public.tahun_ajaran (id, nama, semester, mulai_pada, selesai_pada, aktif)
values (1, '2026/2027', 'ganjil', '2026-07-15', '2026-12-20', true)
on conflict (nama, semester) do update set
  mulai_pada = excluded.mulai_pada,
  selesai_pada = excluded.selesai_pada,
  aktif = excluded.aktif;

-- 10.2. Kelas
insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 1, 1, 'X-A', 10, (select id from public.guru where nama = 'Nur Rochman Hidayat, S.Pd.' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 2, 1, 'X-B', 10, (select id from public.guru where nama = 'Yeni Sri Astutik, S.Pd., Gr' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 3, 1, 'XI-IPA', 11, (select id from public.guru where nama = 'Hilmi Fathiyatul Baroroh, S.Pd., Gr' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 4, 1, 'XI-IPS', 11, (select id from public.guru where nama = 'Ahmad Saini, S.Pd., Gr' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 5, 1, 'XII-IPA', 12, (select id from public.guru where nama = 'Siti Habibah, S.Pd.' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

insert into public.kelas (id, tahun_ajaran_id, nama, tingkat, wali_kelas_id, aktif)
select 6, 1, 'XII-IPS', 12, (select id from public.guru where nama = 'Wiwindari Uswatul J, S.Pd., Gr' limit 1), true
on conflict (tahun_ajaran_id, nama) do update set
  tingkat = excluded.tingkat,
  wali_kelas_id = excluded.wali_kelas_id,
  aktif = excluded.aktif;

-- 10.3. Siswa (Data Fiktif untuk Pengujian Roster Absensi)
insert into public.siswa (id, kode_siswa, nama, jenis_kelamin, aktif) values
(1, 'AI-2026-001', 'Ahmad Fadilah', 'L', true),
(2, 'AI-2026-002', 'Aisyah Putri Maharani', 'P', true),
(3, 'AI-2026-003', 'Bagus Prasetyo', 'L', true),
(4, 'AI-2026-004', 'Dewi Lestari', 'P', true),
(5, 'AI-2026-005', 'Dimas Arya Pamungkas', 'L', true),
(6, 'AI-2026-006', 'Fatimah Zahra', 'P', true),
(7, 'AI-2026-007', 'Hafizh Maulana', 'L', true),
(8, 'AI-2026-008', 'Intan Permata Sari', 'P', true),
(9, 'AI-2026-009', 'Muhammad Rizky Ramadhan', 'L', true),
(10, 'AI-2026-010', 'Nabila Syakirah', 'P', true),
(11, 'AI-2026-011', 'Rian Hidayat', 'L', true),
(12, 'AI-2026-012', 'Siti Nur Aini', 'P', true)
on conflict (kode_siswa) do update set
  nama = excluded.nama,
  jenis_kelamin = excluded.jenis_kelamin,
  aktif = excluded.aktif;

-- 10.4. Anggota Kelas (Daftarkan siswa ke kelas X-A dan X-B)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 1, id, '2026-07-15'::date, null
from public.siswa
where id between 1 and 6
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 1 and ak.siswa_id = public.siswa.id
);

insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 2, id, '2026-07-15'::date, null
from public.siswa
where id between 7 and 12
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 2 and ak.siswa_id = public.siswa.id
);

-- Reset sequence generator untuk ID autoincrement
select setval(pg_get_serial_sequence('public.tahun_ajaran', 'id'), coalesce((select max(id) from public.tahun_ajaran), 1));
select setval(pg_get_serial_sequence('public.kelas', 'id'), coalesce((select max(id) from public.kelas), 1));
select setval(pg_get_serial_sequence('public.siswa', 'id'), coalesce((select max(id) from public.siswa), 1));
select setval(pg_get_serial_sequence('public.anggota_kelas', 'id'), coalesce((select max(id) from public.anggota_kelas), 1));


