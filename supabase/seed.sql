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

drop policy if exists "Allow seeder insert to presensi" on public.presensi;
create policy "Allow seeder insert to presensi" on public.presensi for all using (true) with check (true);

drop policy if exists "Allow seeder insert to kehadiran_siswa" on public.kehadiran_siswa;
create policy "Allow seeder insert to kehadiran_siswa" on public.kehadiran_siswa for all using (true) with check (true);

drop policy if exists "Allow seeder insert to riwayat_presensi" on public.riwayat_presensi;
create policy "Allow seeder insert to riwayat_presensi" on public.riwayat_presensi for all using (true) with check (true);

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users for select to authenticated using (auth.uid() = id);

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
-- Bersihkan data absensi, kelas, dan tahun ajaran sebelum menghapus guru
-- untuk menghindari error 23503 foreign key constraint (kelas_wali_kelas_id_fkey)
delete from public.riwayat_presensi;
delete from public.kehadiran_siswa;
delete from public.presensi;
delete from public.anggota_kelas;
delete from public.siswa;
delete from public.kelas;
delete from public.tahun_ajaran;
delete from public.struktur_organisasi;
update public.users set guru_id = null;

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

-- 10.3. Siswa (Data Riil Peserta Didik SMA Ahlul Irfan)
insert into public.siswa (id, kode_siswa, nama, jenis_kelamin, aktif) values
-- KELAS X A (X-A - Putra)
(1, '0112298884', 'AFIQ LENTERA QOLBI', 'L', true),
(2, '0115943488', 'AHMAD HIDAYAT', 'L', true),
(3, '0112502037', 'AHMAD RAFI PRATAMA', 'L', true),
(4, '0109152043', 'ALDI FIRMANSAH', 'L', true),
(5, '0108400703', 'ANDRIAN', 'L', true),
(6, '0117708282', 'ANDRIYAN RISQI PRATAMA', 'L', true),
(7, '0106104287', 'Dimas Feriansyah', 'L', true),
(8, '0117053076', 'FACHRI SYAKIR', 'L', true),
(9, '0114442607', 'Fathir Putra Alamsyah', 'L', true),
(10, '0107318309', 'Febri Annuri', 'L', true),
(11, '0106350708', 'FITRA FATHURROZI FAISAL', 'L', true),
(12, '0106849738', 'Hasbullah Khoirul Azam', 'L', true),
(13, '0104256896', 'ICHWAN MAHBUBI', 'L', true),
(14, '0105385177', 'IQBAL MAULANA HAKIKI', 'L', true),
(15, '3106915415', 'Kandar Alfarizi', 'L', true),
(16, '0115777118', 'KENZIE ARDIANSYAH PRASETYO', 'L', true),
(17, '0102663794', 'M. ALFIN ADITIA', 'L', true),
(18, '3111254731', 'M.ALIFAN', 'L', true),
(19, '0093180578', 'Maulana Rizqi Alan Mubarok', 'L', true),
(20, '0096997526', 'MOCH. ALI MURTADHO', 'L', true),
(21, '0104283605', 'MOCH. NURUDDIN', 'L', true),
(22, '0096504181', 'MOCH. TORIK ATO''ILLAH', 'L', true),
(23, '0102389118', 'MOH FADHIL SAPUTRA', 'L', true),
(24, '3108941235', 'MOH RISKI HAIKAL', 'L', true),
(25, '0102566029', 'MOHAMMAD FAHMI ADITYA', 'L', true),
(26, '0109813061', 'MOHAMMAD IKBAL HIDAYATULLAH', 'L', true),
(27, '0113937839', 'MOHAMMAD JAILANI', 'L', true),
(28, '0111833791', 'MUHAMMAD FAHMI ZAINUR ROCHMAN', 'L', true),
(29, '0116576335', 'Muhammad Faqih', 'L', true),
(30, '3116448579', 'MUHAMMAD RIDWAN', 'L', true),
(31, '0104308707', 'MUHAMMAD ROYYAN', 'L', true),
(32, '0108611017', 'Muhammad Royyan Walidi', 'L', true),
(33, '0103086803', 'MUHAMMAD USAID FARELA', 'L', true),
(34, '0108718111', 'MUHAMMAD WILDAN MAULANA JUNAIDI', 'L', true),
-- KELAS X B (X-B - Putri)
(35, '0114520351', 'ADELIYA NURIL JANNAH', 'P', true),
(36, '0118623856', 'AISAH ROMANIA', 'P', true),
(37, '0106145576', 'Alyatul Hasanah', 'P', true),
(38, '0109154981', 'AMILATUL HASANAH', 'P', true),
(39, '0104735223', 'ANI', 'P', true),
(40, '0109583087', 'BALQIS QOSIDATUN NIDA', 'P', true),
(41, '0105021057', 'CITRA AYU LESTARI', 'P', true),
(42, '0111727940', 'DECA MAULIDATUR ROHMA', 'P', true),
(43, '0104669900', 'ELI ANA SALSABILA', 'P', true),
(44, '0115535860', 'Elok Anggraeni', 'P', true),
(45, '3119316693', 'FAIQOTUL WARDANIYAH', 'P', true),
(46, '0114448790', 'FINA HUMAIDAH', 'P', true),
(47, '0112359798', 'INDAH NUR LAILATUL JANNAH', 'P', true),
(48, '3101605482', 'INDRI YULIANI', 'P', true),
(49, '0106231020', 'Kamilina Sinta', 'P', true),
(50, '3100848108', 'MASRUROH', 'P', true),
(51, '0104005221', 'MAULIDATUN NAFISAH', 'P', true),
(52, '0117861009', 'NABILA HAIRUL NISAK', 'P', true),
(53, '0106929917', 'Nihayatus Zuhriyatul  Husna', 'P', true),
(54, '0117142708', 'Riska Afrilia Jaki', 'P', true),
(55, '0105361918', 'SELA SAFITRI', 'P', true),
(56, '0106311943', 'Siti Hafizatul A', 'P', true),
(57, '3117139608', 'VIVIN QURROTUL AINI', 'P', true),
(58, '0106962696', 'WIDA DASSOLEHA', 'P', true),
-- KELAS XI A (XI-IPA - Putra)
(59, '3102748437', 'ACHMAD IRFAN', 'L', true),
(60, '0089685505', 'Achmad Said Surya Rachman', 'L', true),
(61, '0068457630', 'ADIT MAULANA', 'L', true),
(62, '0102985938', 'Aditya Reza Syah Putra', 'L', true),
(63, '3103170598', 'Ahmad Fendi', 'L', true),
(64, '0082866857', 'Ahmad Hamdan Lutfi', 'L', true),
(65, '0086413621', 'AHMAD YOGA EKA BUDIMAN', 'L', true),
(66, '0094133616', 'AKHLUL KHOIRI', 'L', true),
(67, '0085996741', 'ALAIKAS SALAM', 'L', true),
(68, '0107232665', 'ANGGA PRATAMA', 'L', true),
(69, '0092030165', 'AUFAL MAROM', 'L', true),
(70, '0098775285', 'BIMA SETIAWAN PRAYUGO', 'L', true),
(71, '0093250693', 'Dimas Adi Prayoga', 'L', true),
(72, '0093381947', 'FAHMI HIDAYAT', 'L', true),
(73, '3073768890', 'Fathul Hidayat', 'L', true),
(74, '0095229668', 'FERIANTO', 'L', true),
(75, '0109350782', 'FIRAZ PRAYOGA', 'L', true),
(76, '0109776220', 'HAMDANI BAYU SAPUTRA', 'L', true),
(77, '0067652918', 'Haris Mahasibi', 'L', true),
(78, '0102749183', 'HASAN BASRI', 'L', true),
(79, '0102354711', 'HUSEN TURMUDZI', 'L', true),
(80, '3091848087', 'KOSWANTO EVENDI', 'L', true),
(81, '3085363401', 'MOCH. HILMAN LUTHFI ALI FADLI', 'L', true),
(82, '0106398771', 'MOH NAZRIL ILHAM', 'L', true),
(83, '0109244010', 'MOHAMMAD NURUL', 'L', true),
(84, '3105688071', 'Muhamad Irfan Afandi', 'L', true),
(85, '0072902555', 'Muhammad Jailani', 'L', true),
(86, '0099052138', 'MUHAMMAD LUTFI ALI', 'L', true),
(87, '0091187229', 'MUHAMMAD SAIFUL RIZAL', 'L', true),
(88, '0062951940', 'Muhammad Wildan Chanif', 'L', true),
(89, '0096635287', 'MUHIBBIN', 'L', true),
(90, '0053200173', 'ZAINUL ABIDIN', 'L', true),
-- KELAS XI B (XI-IPS - Putri)
(91, '0108981737', 'AMILIYAWATI', 'P', true),
(92, '0082260448', 'Ayu Andira', 'P', true),
(93, '3094450967', 'FIFI ZAHROTUL MAGFIROH', 'P', true),
(94, '0098254368', 'LUTFIA AGUSTIN', 'P', true),
(95, '0087810874', 'NABILA', 'P', true),
(96, '0095425123', 'Novitasari', 'P', true),
(97, '0092634230', 'PUTRI YASMIN', 'P', true),
(98, '3107117614', 'Qonita Faradisal Haq', 'P', true),
(99, '0081819560', 'RAHMA RANI SEPTIANA', 'P', true),
(100, '0091350306', 'SITI KHOFIFATUL AZIZAH', 'P', true),
(101, '0099532385', 'Siti Maisaroh', 'P', true),
(102, '0106949073', 'SYAILUR ROHMAH', 'P', true),
(103, '0091617606', 'ULFATUS SA''ADAH', 'P', true),
(104, '0095081874', 'UMI AYNI DAROJATUR ROHMAH', 'P', true),
(105, '0091009655', 'UTIYA WAHYU NINGSIH', 'P', true),
-- KELAS XII A (XII-IPA - Putra)
(106, '0091775331', 'ABDUL MANAP', 'L', true),
(107, '0096316690', 'Ahmad Habibi', 'L', true),
(108, '0092303370', 'Ahmad Nabil Ubaidillah Ali', 'L', true),
(109, '0084406646', 'HOIRUL ROSIQIN', 'L', true),
(110, '0084479924', 'Mas Adid Dharoin', 'L', true),
(111, '0088465111', 'MASFI AGUS SHOLIHIN', 'L', true),
(112, '0086585867', 'MOCH. RIZKY', 'L', true),
(113, '0088856074', 'MOCH. ZAINURROHMAN', 'L', true),
(114, '0097061302', 'MOH JAMIL', 'L', true),
(115, '0093000330', 'MOH. ALFIN ZAIKI', 'L', true),
(116, '0088573571', 'MUHAMAD RIDUAN', 'L', true),
(117, '3089325238', 'MUHAMMAD ABI HAFASH', 'L', true),
(118, '0081288451', 'Muhammad Alam Faris Syakirin', 'L', true),
(119, '3088990958', 'Muhammad Ario Maulana Hasbi', 'L', true),
(120, '0091614076', 'MUHAMMAD DIKI SAPUTRA RAMADANI', 'L', true),
(121, '0081659416', 'Muhammad Fahry Abdillah', 'L', true),
(122, '3081851701', 'Muhammad Fausi', 'L', true),
(123, '0093780187', 'MUHAMMAD FEBRI', 'L', true),
(124, '0094427393', 'MUHAMMAD RIVAL EFENDI', 'L', true),
(125, '0087912625', 'NASIHUL WAFA', 'L', true),
(126, '0082347526', 'NUR ISMAIL', 'L', true),
(127, '0084757612', 'RENDI', 'L', true),
(128, '0098478307', 'WENDY ADI PURNOMO', 'L', true),
-- KELAS XII B (XII-IPS - Putri)
(129, '0098072107', 'Alfia Alwiati', 'P', true),
(130, '0085683339', 'ALMA', 'P', true),
(131, '0081015938', 'ANDINI SASKIA RISMA S.', 'P', true),
(132, '3098609946', 'AULIA ROBBANIYA', 'P', true),
(133, '0096672089', 'AZIZATUL MUNAWAROH', 'P', true),
(134, '0098638225', 'DINAIN FADILAH', 'P', true),
(135, '0091529146', 'ELOK FAIQOTUL HIMMAH', 'P', true),
(136, '0089034272', 'Keysa Ayu Zubaidiyah', 'P', true),
(137, '0097551206', 'LUTFIATUL KOMARIYAH', 'P', true),
(138, '0083371017', 'MUSYAFIA', 'P', true),
(139, '0098703897', 'NAZLAH AYATILLAHIL MASRUROH', 'P', true),
(140, '0091464531', 'NILA KHOIRUNAILIN', 'P', true),
(141, '0094410245', 'PRIASTITA WAHYU M', 'P', true),
(142, '0092558904', 'PRISILIA WAHYU M', 'P', true),
(143, '3067568716', 'QURROTUL A''YUNI', 'P', true),
(144, '0098768384', 'Salimatus Zahrina', 'P', true),
(145, '0094787275', 'Salsabila Zahrani', 'P', true),
(146, '3080063328', 'Silvia Azkiyatul Hasbiyah', 'P', true),
(147, '0099664286', 'SITI MUNALISA', 'P', true),
(148, '0093917684', 'SITI ZAHRO MUNIBAH', 'P', true),
(149, '0078358816', 'VINKA ALIA FAURINA', 'P', true),
(150, '0085187136', 'Widya Ramadani', 'P', true),
(151, '0093167413', 'YETIK NAYLATUZZAHRO', 'P', true)
on conflict (kode_siswa) do update set
  nama = excluded.nama,
  jenis_kelamin = excluded.jenis_kelamin,
  aktif = excluded.aktif;

-- 10.4. Anggota Kelas (Daftarkan siswa ke masing-masing rombel)
-- KELAS X A (X-A - ID: 1)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 1, id, '2026-07-15'::date, null
from public.siswa
where id between 1 and 34
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 1 and ak.siswa_id = public.siswa.id
);

-- KELAS X B (X-B - ID: 2)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 2, id, '2026-07-15'::date, null
from public.siswa
where id between 35 and 58
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 2 and ak.siswa_id = public.siswa.id
);

-- KELAS XI A (XI-IPA - ID: 3)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 3, id, '2026-07-15'::date, null
from public.siswa
where id between 59 and 90
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 3 and ak.siswa_id = public.siswa.id
);

-- KELAS XI B (XI-IPS - ID: 4)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 4, id, '2026-07-15'::date, null
from public.siswa
where id between 91 and 105
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 4 and ak.siswa_id = public.siswa.id
);

-- KELAS XII A (XII-IPA - ID: 5)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 5, id, '2026-07-15'::date, null
from public.siswa
where id between 106 and 128
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 5 and ak.siswa_id = public.siswa.id
);

-- KELAS XII B (XII-IPS - ID: 6)
insert into public.anggota_kelas (kelas_id, siswa_id, mulai_pada, selesai_pada)
select 6, id, '2026-07-15'::date, null
from public.siswa
where id between 129 and 151
and not exists (
  select 1 from public.anggota_kelas ak where ak.kelas_id = 6 and ak.siswa_id = public.siswa.id
);

-- Reset sequence generator untuk ID autoincrement
select setval(pg_get_serial_sequence('public.tahun_ajaran', 'id'), coalesce((select max(id) from public.tahun_ajaran), 1));
select setval(pg_get_serial_sequence('public.kelas', 'id'), coalesce((select max(id) from public.kelas), 1));
select setval(pg_get_serial_sequence('public.siswa', 'id'), coalesce((select max(id) from public.siswa), 1));
select setval(pg_get_serial_sequence('public.anggota_kelas', 'id'), coalesce((select max(id) from public.anggota_kelas), 1));


