# PRD — Website SMA Ahlul Irfan Bangsalsari

> Sumber kebenaran **scope**. Aturan kerja teknis ada di `AGENTS-SMA.md`.
> Kalau ada yang tidak tertulis di sini sebagai P0, jangan dibangun tanpa bertanya.

| | |
|---|---|
| Lembaga | SMA Ahlul Irfan Bangsalsari, di bawah Yayasan Ahlul Irfan Al-Kholily, Jember |
| Situs kembar | Pondok Pesantren Ahlul Irfan Al-Kholily — `/Users/iqbalrei/Projects/KKN/PP_ahlulirfan` |
| Sprint | 15–17 Agustus 2026 (3 hari) |
| Bahasa | Seluruh UI, label admin, dan konten dalam Bahasa Indonesia |

---

## 1. Latar Belakang

SMA Ahlul Irfan Bangsalsari belum punya kehadiran daring resmi. Calon siswa dan orang tua yang membandingkan sekolah mencari informasi lewat ponsel, dan saat ini tidak menemukan apa-apa selain sebutan di media sosial pihak ketiga. Yayasan sudah punya situs untuk unit pesantren; unit SMA belum.

Naskah sekolah sudah diterima (`WEBSITE.docx`, 6 halaman) dan ditranskrip ke `docs/KONTEN-SEKOLAH.md`: sejarah, visi-misi, kurikulum, sambutan kepala sekolah, bagan organisasi, **13 pendidik + 3 tenaga kependidikan**, dan 7 ekstrakurikuler.

Naskah itu **tidak selengkap yang dikira**. Empat bagian — Prestasi Siswa, Tata Tertib, Organisasi Siswa, dan E-Learning — hanya berupa judul kosong. Data kontak, NPSN, akreditasi, dan seluruh foto juga belum ada. Jadi hambatan proyek ini dua: waktu membangun **dan** naskah yang masih ditunggu. Yang kedua harus ditagih ke sekolah di hari pertama, bukan hari terakhir.

## 2. Rumusan Masalah

1. Calon siswa dan orang tua tidak punya sumber informasi resmi yang bisa dipercaya tentang SMA ini.
2. Sekolah tidak punya kanal untuk mengumumkan kegiatan dan prestasi tanpa bergantung pada media sosial pribadi.
3. Yayasan tidak punya arsip terstruktur atas profil, guru, dan kegiatan unit SMA.

## 3. Tujuan

1. Situs profil publik yang lengkap, cepat, dan enak dibaca di ponsel kelas menengah dengan kuota terbatas.
2. Panel admin yang bisa dipakai staf TU tanpa pelatihan teknis untuk memperbarui berita dan konten.
3. Diserahterimakan penuh ke yayasan: domain, hosting, kode, akun — semuanya atas nama lembaga.
4. Selesai dan bisa didemokan dalam 3 hari.

## 4. Non-Goals — di luar scope, JANGAN dikerjakan

- **Sistem** e-learning: materi pelajaran, kelas daring, unggah tugas, login siswa
- Presensi siswa atau guru
- Ujian atau kuis online
- PPDB online dengan pembayaran
- Login siswa atau orang tua
- Aplikasi mobile
- Forum, komentar, atau fitur sosial
- Multi-bahasa

Arsitektur tidak perlu menyiapkan jalan untuk hal-hal ini, tapi juga tidak boleh sengaja menghalanginya.

**Catatan E-Learning.** Sekolah mencantumkan "E-Learning" di daftar AKADEMIK mereka. Yang dibangun hanyalah **halaman informasi statis** yang menjelaskan rencana atau layanan e-learning sekolah. Bukan sistem. Tidak ada login siswa, tidak ada materi, tidak ada unggahan tugas, tidak ada tautan aktif ke platform mana pun sampai sekolah menentukannya. Perbedaan ini ditulis eksplisit supaya tidak ada yang menafsirkan keberadaan halaman itu sebagai izin membangun LMS.

## 5. Pengguna

| Pengguna | Kebutuhan | Perangkat |
|---|---|---|
| Calon siswa (SMP kelas 9) | Tahu ekstrakurikuler dan suasana sekolah | Ponsel, kuota terbatas |
| Orang tua | Kurikulum, guru, legalitas, kontak, biaya | Ponsel |
| Guru & alumni | Berita kegiatan, galeri | Ponsel |
| Staf TU (admin) | Menerbitkan berita, ganti foto, ubah kontak | Laptop; kadang ponsel |
| Pengurus yayasan | Bukti kerja, bahan laporan | Laptop |

## 6. User Stories — urut prioritas

1. Sebagai orang tua, saya ingin melihat kurikulum dan daftar guru agar yakin sekolah ini serius.
2. Sebagai calon siswa, saya ingin melihat ekstrakurikuler dan foto kegiatan agar bisa membayangkan diri di sana.
3. Sebagai orang tua, saya ingin menemukan nomor WhatsApp dan alamat agar bisa langsung bertanya.
4. Sebagai staf TU, saya ingin menerbitkan berita tanpa menghubungi siapa pun.
5. Sebagai staf TU, saya ingin mengganti foto dan teks kontak sendiri.
6. Sebagai pengurus, saya ingin situs tetap hidup dan bisa dibayar dalam rupiah atas nama yayasan.

## 7. Arsitektur Informasi

Mengikuti pengelompokan yang dipakai sekolah di `WEBSITE.docx`.

| Kelompok navigasi | Route | Halaman | Naskah |
|---|---|---|---|
| — | `/` | Beranda | ✅ |
| Profil | `/profil` | Sejarah, visi-misi | ✅ |
| Profil | `/profil/struktur-organisasi` | Bagan organisasi | ✅ |
| Akademik | `/kurikulum` | Kurikulum dan program pembelajaran | ✅ |
| Akademik | `/guru` | Pendidik dan tenaga kependidikan | ✅ |
| Akademik | `/e-learning` | Halaman informasi statis | ⚠️ belum ada |
| Kesiswaan | `/ekstrakurikuler` | Tujuh ekstrakurikuler | ✅ (pembina & jadwal belum) |
| Kesiswaan | `/prestasi` | Prestasi siswa | ⚠️ belum ada |
| Kesiswaan | `/tata-tertib` | Tata tertib sekolah | ⚠️ belum ada |
| Kesiswaan | `/organisasi-siswa` | OSIS | ⚠️ belum ada |
| — | `/berita`, `/berita/{slug}` | Berita | ⚠️ belum ada |
| — | `/galeri` | Album foto | ⚠️ belum ada |
| — | `/kontak` | Alamat, peta, telepon, WhatsApp | ⚠️ belum ada |

Sambutan Kepala Sekolah menjadi section di beranda, bukan route tersendiri. `/galeri` dan `/kontak` tidak disebut sekolah tapi tetap dibangun — kontak wajib (P0-6) dan galeri sudah punya tabel.

**Halaman yang naskahnya belum ada disembunyikan dari navigasi, bukan diterbitkan kosong.** Halaman setengah isi lebih merusak kepercayaan calon orang tua daripada halaman yang belum ada.

**Kecuali `/kontak`.** Halaman ini tidak boleh disembunyikan dan tidak boleh terbit kosong — situs sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya. Alamat, telepon, dan WhatsApp adalah **syarat mutlak rilis**: kalau data ini belum ada pada hari rilis, yang ditunda adalah rilisnya, bukan halamannya. Ini satu-satunya kekurangan naskah yang memblokir peluncuran.

### Route admin

`/login`, `/lupa-password`, `/reset-password`, dan `/admin/*` (dasbor, berita, guru, ekstrakurikuler, galeri, media, pengaturan). Tidak ada registrasi publik.

### Urutan section Beranda

Hero → Sambutan Kepala Sekolah → Highlight Kurikulum → Grid Ekstrakurikuler → Grid Guru → Berita Terbaru → Teaser Galeri → CTA Kontak/WhatsApp

Urutan ini **dikunci**. Tim desain bebas menentukan tampilan tiap section, tapi tidak mengubah urutan atau daftar halaman — inilah yang mencegah swap grand design jadi mahal.

## 8. Kebutuhan Fungsional

### P0 — Wajib, tanpa ini tidak serah terima

| ID | Kebutuhan |
|---|---|
| P0-1 | Halaman publik di Bagian 7 tampil benar di 390px dan 1280px |
| P0-2 | Semua halaman terbit terisi konten nyata sekolah; yang naskahnya belum ada disembunyikan dari navigasi |
| P0-11 | Halaman Struktur Organisasi, dirender sebagai HTML/CSS responsif — bukan gambar |
| P0-12 | Halaman Prestasi Siswa |
| P0-13 | Halaman Tata Tertib Sekolah |
| P0-14 | **NUPTK, NIK, dan identitas kependudukan tidak ada di repo, skema, maupun keluaran mana pun** — diverifikasi lewat perintah grep di Definisi Selesai |
| P0-3 | Login admin, logout, dan reset password lewat email berfungsi |
| P0-4 | Admin berita: buat, ubah, hapus, draft/terbit |
| P0-5 | Upload gambar dengan `alt` wajib; varian ukuran dibuat saat upload |
| P0-6 | Pengaturan situs bisa diubah admin: nama, alamat, telepon, WhatsApp, sosial media |
| P0-7 | Empty state yang dirancang untuk berita, galeri, guru, ekstrakurikuler — tidak pernah halaman kosong atau error |
| P0-8 | Metadata SEO: title, description, canonical, Open Graph, sitemap, robots |
| P0-9 | Terpasang di hosting produksi dengan HTTPS dan domain aktif |
| P0-10 | Backup database dan media berhasil diuji restore sekali |

### P1 — Sebaiknya ada, kerjakan jika waktu cukup

| ID | Kebutuhan |
|---|---|
| P1-1 | Admin CRUD untuk guru, ekstrakurikuler, dan galeri |
| P1-2 | Editor rich text untuk isi berita |
| P1-3 | Lightbox galeri |
| P1-4 | JSON-LD `EducationalOrganization` |
| P1-5 | Peta lokasi tersemat di halaman kontak |
| P1-6 | Pencarian atau filter berita |
| P1-7 | Halaman Organisasi Siswa (OSIS) |
| P1-8 | Halaman E-Learning — informasi statis, bukan sistem |

### P2 — JANGAN dibangun, tapi jangan dihalangi arsitekturnya

Statistik pengunjung, penjadwalan terbit otomatis, log aktivitas admin, unduhan dokumen.

## 9. Kebutuhan Non-Fungsional

- **Mobile-first.** Mayoritas pengunjung memakai ponsel; 390px lebih penting dari 1280px.
- Lighthouse produksi: Performance ≥ 90, Accessibility / Best Practices / SEO ≥ 95.
- LCP ≤ 2,5 detik pada koneksi 4G Indonesia.
- Fokus keyboard terlihat; `alt` wajib; hormati `prefers-reduced-motion`.
- Seluruh teks antarmuka dan label admin dalam Bahasa Indonesia.
- Situs harus tetap bisa dijalankan lokal tanpa database produksi.
- Biaya operasional tahunan terbayar dalam rupiah atas nama yayasan.

## 10. Keputusan Teknis (ADR ringkas)

**ADR-1 — Laravel + Blade, bukan Next.js.**
Situs kembar (pesantren) memakai Next.js + Supabase di Vercel. SMA sengaja tidak mengikutinya. Alasannya **bukan** kekhawatiran Supabase pause — itu sudah teratasi otomatis di pesantren karena cron hariannya menembak database tiap hari. Alasan sebenarnya dua: (a) Supabase free hanya menyediakan 1GB storage sementara situs sekolah punya galeri foto, sehingga naik ke Pro (~Rp 400rb/bln) tinggal soal waktu; (b) tagihan itu berdenominasi dolar lewat kartu kredit pribadi yang akan terus menempel pasca-KKN, dan yayasan tidak bisa mengambil alihnya. Shared hosting Rp 30–100rb/bln dengan invoice rupiah atas nama yayasan menyelesaikan keduanya sekaligus. Konsekuensinya diterima sadar: lihat Risiko R-1.

**ADR-2 — Admin ditulis tangan dengan Blade, bukan Filament.**
Filament akan menghemat sekitar 1,5 hari dan sudah dipertimbangkan. Ditolak karena tidak ingin menambah dependency admin besar. Konsekuensinya: scope admin dipotong sesuai urutan korban di Bagian 13.

**ADR-3 — Autentikasi memakai `laravel/breeze`.**
Breeze dibekukan sejak Laravel 12 dan tidak lagi menerima fitur baru. Tetap dipilih karena Breeze murni *scaffolding* — ia menyalin controller dan view ke dalam proyek, lalu paketnya tidak lagi berperan saat runtime. Statusnya nyaris tidak berdampak. Registrasi publik dimatikan. Alternatif terawat jika kelak bermasalah: `laravel/fortify` dengan view Blade sendiri.

**ADR-4 — MySQL di produksi, SQLite di lokal.**
Menggantikan gagasan "content adapter dua implementasi". `php artisan migrate --seed` di atas SQLite sudah memenuhi syarat "jalan tanpa database produksi" tanpa perlu lapisan abstraksi apa pun.

**ADR-6 — Hosting BiznetGio, atas nama yayasan.**
Hostinger lebih murah dan satu paketnya menampung puluhan situs — secara ekonomi menang untuk kebutuhan pribadi. Justru itu alasan penolakannya di sini: situs sekolah yang menumpang di paket berisi klien lain **tidak akan pernah bisa diserahterimakan**, sehingga pemilik akun terjebak membayar dalam dolar seumur hidup untuk website milik orang lain. Ditambah lonjakan perpanjangan Hostinger dari sekitar $2,75 ke $16,99 per bulan saat termin promo habis. BiznetGio dipilih karena invoice rupiah PT/NPWP sehingga sekolah bisa membayar langsung, support Bahasa 24/7, data center Jakarta, serta domain, SSL, dan backup harian sudah termasuk. Paket Hostinger untuk keperluan pribadi, bila diinginkan, dibeli terpisah dan tidak dicampur dengan situs klien.

**ADR-7 — Bagan organisasi jadi tabel sendiri, dirender HTML.**
Gambar bagan 1,1MB dari docx tidak dipakai sebagai konten: tidak terbaca di 390px, tidak bisa dicari, dan gagal syarat aksesibilitas Bagian 9.

Gagasan awal "turunkan bagan dari tabel `guru` lewat kolom `atasan_id`" **ditolak setelah bagannya diperiksa.** Bagan memuat tiga simpul yang bukan orang (Wali Kelas, Guru Mapel, Siswa-Siswi) dan satu orang di luar daftar pegawai (Komite Sekolah — Asmiatul Hosani, A. Akun.). Memaksakannya ke tabel `guru` berarti menyisipkan baris palsu ke daftar guru.

Solusinya tabel `struktur_organisasi` tersendiri dengan `guru_id` opsional: simpul yang merujuk pegawai nyata mengambil namanya dari tabel `guru` lewat relasi, simpul kelompok dan Komite berdiri dengan label sendiri. Nama tetap punya satu sumber kebenaran, tapi bentuk bagan bebas berbeda dari daftar kepegawaian.

**ADR-13 — Pemulihan kata sandi lewat super admin, bukan penyedia identitas.**
Supabase Auth, Firebase Auth, dan Google Sign-In semuanya dipertimbangkan dan ditolak. Supabase menghidupkan kembali ketergantungan yang baru dilepas di ADR-1; Firebase adalah Google Cloud sehingga tidak menghindari hal yang ingin dihindari; Google Sign-In menuntut satu aset lagi (project OAuth) yang harus diserahterimakan atas nama sekolah.

Penggunanya 2–5 orang staf yang bisa dihubungi langsung. Jadi jalur pemulihannya: **super admin mengatur kata sandi baru dari panel Akun Pengguna**, lalu menyampaikannya langsung. Bila super admin sendiri terkunci, jaring pengamannya `php artisan pengguna:sandi` lewat SSH — akses yang memang sudah disyaratkan paket hosting.

Dampak terpenting: **SMTP berhenti menjadi penghambat peluncuran.** Risiko R-4 turun dari "memblokir" menjadi "pelengkap". Google Sign-In tetap bisa ditambahkan kelak sebagai pelengkap, bukan pengganti, dan tanpa tekanan waktu.

**ADR-14 — Panel admin mengikuti struktur panel yayasan, dengan warna SMA.**
Sidebar gelap tetap selebar 16rem, nav mobile terpisah, dan header sambutan — sama seperti `PP_ahlulirfan`. Warnanya memakai token SMA (`--brand-strong`), bukan menyalin palet pesantren, agar staf yang mengelola dua situs mengenali polanya tanpa tertukar situsnya.

**ADR-11 — Panel admin memakai Inertia + React; situs publik tetap Blade.**
Diambil atas permintaan pemilik proyek untuk nilai belajar dan portofolio, dengan konsekuensi yang disadari: dua paradigma render permanen dalam satu repo, dan penerus proyek harus paham keduanya. Batasnya dijaga ketat — middleware `inertia` hanya dipasang pada grup rute admin, dan entry Vite dipisah agar pengunjung situs publik tidak ikut mengunduh React (±46KB Alpine untuk publik, ±720KB React+TipTap untuk admin).

Keputusan ini membuka kembali reuse yang sebelumnya ditutup di ADR-5: editor TipTap situs pesantren kini bisa diadaptasi, walau ditulis ulang tanpa shadcn, lucide, dan dialog media Supabase yang tidak ada di sini.

**ADR-12 — `larastan` dipasang sejak awal, bukan setelah rilis.**
Pada pemasangan pertama ia langsung menemukan enam kesalahan tipe nyata di model — di antaranya perbandingan enum yang selalu bernilai salah — yang tidak terdeteksi 36 test karena jalur kodenya belum pernah dieksekusi. Level 5 dipilih sebagai titik jujur untuk proyek sprint. Naikkan bertahap setelah rilis.

**ADR-9 — `spatie/laravel-medialibrary` menggantikan tabel media buatan sendiri.**
Rencana awal memakai `intervention/image` dengan tabel `media` yang ditulis tangan. Diganti setelah menghitung ulang: medialibrary menangani unggah, varian ukuran, dan penyimpanan sekaligus, sehingga memenuhi Aturan #8 (jangan pernah menulis sendiri penanganan upload) dan memangkas sekitar empat jam kerja admin. Konversi berjalan sinkron karena shared hosting tidak punya daemon queue — cukup untuk situs sekecil ini.

**ADR-10 — Dua peran saja: `super-admin` dan `admin`.**
Izin dipecah per area konten, bukan per operasi (lihat/buat/ubah/hapus). Dengan hanya dua peran, pemecahan per operasi akan menjadi kerumitan tanpa pemakai. `super-admin` melewati seluruh pemeriksaan lewat `Gate::before` dan sengaja tidak diberi daftar izin eksplisit, agar tidak ada dua sumber kebenaran yang bisa berbeda saat izin baru ditambahkan.

**ADR-8 — Naskah sumber tidak masuk git.**
`WEBSITE.docx` memuat NUPTK 13 orang. Diblokir `.gitignore` sebelum commit pertama; naskahnya ditranskrip ke `docs/KONTEN-SEKOLAH.md` tanpa kolom itu. Menghapus file dari riwayat git setelah ter-commit menuntut penulisan ulang riwayat, dan setelah ter-push praktis mustahil ditarik.

**ADR-5 — Reuse dari pesantren terbatas pada lapisan presentasi.**
Yang diambil: nilai token, markup HTML dan kelas Tailwind, struktur dokumen, gaya penulisan. Yang tidak bisa diambil: komponen React, `lib/data.ts`, admin TipTap-React, migrasi Supabase, dan seluruh test.

## 11. Model Konten

Tanpa kecuali: **tidak ada kolom NUPTK, NIK, atau identitas kependudukan lain** di tabel mana pun.

| Tabel | Kolom inti |
|---|---|
| `berita` | judul, slug, ringkasan, isi, gambar_sampul_id, status (draft/terbit), diterbitkan_pada |
| `guru` | nama, kategori (`pendidik`\|`tenaga_kependidikan`), jenis_kelamin, jabatan, mata_pelajaran (nullable), foto_id (nullable), urutan |
| `struktur_organisasi` | label, guru_id (nullable), atasan_id (nullable, self-ref), tipe (`orang`\|`kelompok`\|`penasihat`), urutan |
| `ekstrakurikuler` | nama, deskripsi, pembina (nullable), jadwal (nullable), gambar_id (nullable), urutan |
| `album` | judul, slug, deskripsi, urutan |
| `media` | disediakan `spatie/laravel-medialibrary`, polimorfik. Foto galeri menempel ke `album`, sampul ke `berita`, foto ke `guru`, logo ke `pengaturan_situs`. `alt` disimpan sebagai custom property dan wajib terisi |
| `konten_halaman` | kunci, judul, isi, gambar_id, terbit (boolean) |
| `pengaturan_situs` | nama_sekolah, alamat, telepon, whatsapp, email, koordinat_peta, sosial |
| `users` | nama, email, password — bawaan Laravel, tidak pernah dibaca publik |

**`konten_halaman`** menopang semua halaman berbasis prosa lewat kunci: `sejarah`, `visi_misi`, `sambutan_kepsek`, `kurikulum`, `prestasi`, `tata_tertib`, `organisasi_siswa`, `e_learning`. Kolom `terbit` inilah yang menyembunyikan halaman dari navigasi selama naskahnya belum datang. Prosa panjang tidak ditaruh di `pengaturan_situs`, dan **tidak pernah** ditulis keras di Blade.

**`struktur_organisasi`** memisahkan bentuk bagan dari daftar kepegawaian (alasannya di ADR-7). `tipe` menentukan cara render: `orang` mengambil nama dari relasi `guru`, `kelompok` adalah simpul tanpa nama (Wali Kelas, Guru Mapel, Siswa-Siswi), `penasihat` digambar di samping induknya alih-alih di bawah (Komite Sekolah). Nama pegawai tetap punya satu sumber kebenaran di `guru`.

**`guru.kategori`** memisahkan 13 pendidik dari 3 tenaga kependidikan supaya halaman `/guru` merender dua kelompok, bukan satu daftar campur.

## 12. Strategi Grand Design

Grand design belum ada. Situs rilis dengan tema provisional dan diganti nanti tanpa refactor.

Prosedurnya **jangan ditulis ulang** — pakai `PP_ahlulirfan/docs/DESIGN_SWAP_PLAYBOOK.md` apa adanya. Yang berlaku di sini: kunci **nama** token sekarang, ganti **nilai**-nya saat desain tiba. Panel admin berada di luar lingkup grand design; jangan buang waktu men-theme-nya.

## 13. Fase Pengerjaan

**Hari 0 — sebelum menulis kode apa pun:** tagih ke sekolah naskah Prestasi, Tata Tertib, Organisasi Siswa, E-Learning, data kontak, NPSN, akreditasi, logo, dan foto. Konfirmasi juga dua konflik nama di `docs/KONTEN-SEKOLAH.md`. Semua ini punya waktu tunggu di luar kendali kita, jadi ditagih paling awal — bukan saat halaman siap diisi.

| Hari | Target |
|---|---|
| 1 | Scaffold Laravel + Breeze + Tailwind v4; port token dari `globals.css` pesantren; migrasi, model, factory, seeder; layout publik (navbar, footer) |
| 2 | Seluruh halaman publik dan section beranda memakai data seeder; bagan organisasi; responsif 390/1280 |
| 3 | Admin CRUD + upload; deploy BiznetGio; QA |

### Perkiraan jujur

Scope bertambah tiga halaman P0 setelah komitmen 3 hari diambil. Penjumlahan sebenarnya:

| Pekerjaan | Perkiraan |
|---|---|
| Scaffold, token, skema, seeder | 0,5 hari |
| Situs publik, halaman inti | 1 hari |
| Tiga halaman P0 baru + bagan organisasi | 0,5 hari |
| Admin tulis tangan, 6 tipe konten | 1,5–2 hari |
| Deploy BiznetGio + QA | 0,5 hari |
| **Total** | **4–4,5 hari** |

Sprint 3 hari akan meleset sekitar 1–1,5 hari. Ini bukan pesimisme, melainkan penjumlahan angka yang sudah disepakati sebelumnya ditambah scope yang baru masuk dari `WEBSITE.docx`.

### Urutan korban jika waktu meleset

Dipakai dari atas ke bawah, tanpa diskusi ulang:

1. Editor rich text → sementara textarea polos
2. Lightbox galeri
3. Halaman Organisasi Siswa dan E-Learning (P1, naskahnya memang belum ada)
4. Bagan organisasi → sementara daftar bertingkat tanpa garis penghubung
5. Admin galeri/album → konten lewat seeder
6. Admin guru, ekstrakurikuler, prestasi, tata tertib → konten lewat seeder

**Tidak boleh dikorbankan:** situs publik, autentikasi, upload media, dan admin berita — berita satu-satunya konten yang benar-benar perlu diperbarui rutin setelah serah terima.

Kalau keenam korban dipakai, 3 hari tercapai dengan admin yang hanya mengelola berita. Itu keluaran jujur dan tetap layak diserahterimakan.

## 14. Metrik Keberhasilan

- Sembilan halaman publik terbit dengan konten nyata sebelum akhir sprint.
- Staf TU berhasil menerbitkan satu berita sendiri tanpa dibantu, dalam sekali coba.
- Lighthouse mobile produksi memenuhi ambang Bagian 9.
- Domain dan hosting terdaftar atas nama yayasan, bukan pribadi.
- Restore backup berhasil diuji minimal satu kali sebelum serah terima.

## 15. Pertanyaan Terbuka

1. **Konflik nama di naskah sekolah.** Bagan organisasi menulis Wakil Kepala Sekolah "**Fathur** Rochman Hidayat", tabel Data Guru menulis "**Nur** Rochman Hidayat". Kepala TU "Rofiatun" vs "Rofiyatun". Ini nama orang — harus dikonfirmasi ke sekolah, tidak boleh dipilih sepihak.
2. **Empat naskah yang belum ada:** Prestasi Siswa (P0), Tata Tertib (P0), Organisasi Siswa (P1), E-Learning (P1). Ditambah pembina dan jadwal tiap ekstrakurikuler.
3. **Data kontak dan identitas:** alamat lengkap, telepon, WhatsApp, email, koordinat peta, NPSN, status akreditasi.
4. **Aset:** logo sekolah, foto guru, foto gedung dan kegiatan, minimal satu berita untuk mengisi halaman Berita saat rilis.
5. Platform e-learning apa yang sebenarnya dipakai atau direncanakan sekolah?
6. Nasib situs pesantren — tetap di Vercel + Supabase, atau menyusul ke Laravel? **Harus diputuskan sebelum serah terima.**
7. Domain final `.sch.id` — apakah SK pendirian (`421/1334/463.41.6/2003`) dan surat permohonan kepala sekolah sudah siap untuk verifikasi PANDI?
8. Siapa dua orang di pihak sekolah yang akan memegang akun admin?
9. **Terjawab.** Izin publikasi foto siswa dikonfirmasi sudah diperoleh oleh pemilik proyek
   pada 20 Agustus 2026. Bukti persetujuannya tetap disimpan bersama dokumen
   serah-terima sekolah.
10. Siapa yang membayar perpanjangan domain dan hosting tahun kedua?

## 16. Risiko

| ID | Risiko | Mitigasi |
|---|---|---|
| R-1 | **Dua stack untuk satu yayasan.** Pesantren Next.js+Supabase, SMA Laravel+MySQL. Penerus harus paham dua stack, dua prosedur backup, dua tagihan | Putuskan Pertanyaan Terbuka #1 sebelum serah terima, bukan sesudah. Catat perbedaan keduanya secara eksplisit di dokumen serah terima |
| R-2 | Admin tulis tangan menghabiskan ~1,5–2 hari dari sprint 3 hari | Urutan korban di Bagian 13 sudah disepakati di muka |
| R-3 | Paket hosting tanpa SSH membuat deploy Laravel menyiksa | Verifikasi SSH atau cPanel Terminal, PHP Selector 8.2+, ekstensi `gd`/`mbstring`/`zip`/`bcmath`/`pdo_mysql`/`fileinfo`, Git, dan document root bisa diarahkan ke subfolder — **sebelum membayar** |
| R-8 | **NUPTK 13 orang bocor ke riwayat git lewat `WEBSITE.docx`** | `.gitignore` memblokir `*.docx` sebelum commit pertama; naskah ditranskrip tanpa NUPTK; diverifikasi lewat grep di Definisi Selesai. Repo belum punya commit apa pun saat aturan ini dipasang — jendela ini tertutup pada commit pertama |
| R-9 | Tiga halaman P0 baru belum punya naskah sama sekali | Tagih ke sekolah di Hari 0. Bila belum ada saat rilis, halaman disembunyikan dari navigasi lewat `konten_halaman.terbit` — bukan diterbitkan kosong |
| R-10 | Konflik nama Wakil Kepala Sekolah dan Kepala TU antara bagan dan tabel | Konfirmasi ke sekolah sebelum seeder final. Menerbitkan nama orang yang salah lebih merusak daripada menunda halaman |
| R-4 | ~~Reset password mati kalau SMTP belum dikonfigurasi~~ **Selesai** | Pemulihan kata sandi kini lewat super admin di panel, dengan `php artisan pengguna:sandi` sebagai jaring pengaman SSH (ADR-13). SMTP tinggal pelengkap, bukan syarat rilis |
| R-5 | Domain didaftarkan atas nama pribadi | Daftarkan atas nama yayasan sejak awal; memindahkan kepemilikan `.sch.id` belakangan jauh lebih repot |
| R-6 | Foto siswa terbit tanpa izin | Izin dikonfirmasi sudah diperoleh pada 20 Agustus 2026. Simpan buktinya bersama dokumen serah-terima dan pastikan unggahan baru tetap termasuk dalam cakupan persetujuan |
| R-7 | Grand design terlambat melewati jadwal rilis | Situs tetap rilis dengan tema provisional; swap dilakukan setelahnya — arsitektur token memang dibuat untuk itu |
