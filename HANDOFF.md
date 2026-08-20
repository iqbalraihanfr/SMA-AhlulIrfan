# HANDOFF — SMA Ahlul Irfan Bangsalsari

Diserahkan 16 Agustus 2026. Dokumen ini untuk agen atau pengembang yang melanjutkan tanpa mengikuti percakapan sebelumnya.

---

## 1. Proyek ini apa

Situs profil SMA Islam swasta di bawah Yayasan Ahlul Irfan Al-Kholily, Desa Langkap, Kecamatan Bangsalsari, Kabupaten Jember. Dikerjakan sebagai bagian KKN, lalu **diserahterimakan ke yayasan**.

Fakta ini membentuk hampir semua keputusan teknis: yang mewarisi bukan pengembang. Karena itu proyek menghindari layanan berbayar dolar, menghindari akun pribadi yang tidak bisa dialihkan, dan mengutamakan yang gampang dirawat daripada yang canggih.

**Audiens:** calon siswa dan orang tua, mayoritas memakai ponsel dengan kuota terbatas.
**Skala nyata:** ~1000 pengunjung total, 5–10 akun admin. Sangat kecil — jangan optimasi prematur.
**Produksi:** shared hosting cPanel BiznetGio. Tanpa Redis, tanpa daemon queue, tanpa root, hanya PHP + MySQL + cron + SSH.

---

## 2. Keadaan sekarang

Repo sudah terhubung dan sinkron lewat `origin/main`. Riwayat yang semula hanya
berada di satu laptop telah dipublikasikan ke GitHub; perubahan berikutnya harus
tetap didorong setelah seluruh gerbang mutu bersih.

### Sudah jalan dan teruji

**Situs publik, 15 rute:** `/`, `/profil`, `/profil/struktur-organisasi`, `/kurikulum`, `/guru`, `/e-learning`, `/ekstrakurikuler`, `/prestasi`, `/tata-tertib`, `/organisasi-siswa`, `/berita`, `/berita/{slug}`, `/galeri`, `/galeri/{slug}`, `/kontak`.

**Panel admin, 9 bagian:** Dasbor, Berita, Halaman, Guru & Tendik, Struktur Organisasi, Ekstrakurikuler, Galeri, Pengaturan Situs, Akun Pengguna.

**Verifikasi terakhir:** lihat entri terbaru `CHANGELOG.md`. Gerbang tetap terdiri
atas PHPUnit, Pint, PHPStan level 5, TypeScript, dan build Vite.

### Menjalankan

```bash
alias pa='/Applications/MAMP/bin/php/php8.4.1/bin/php artisan'
pa dev          # server + Vite sekaligus, buka http://localhost:8000
```

Akun uji lokal (SQLite, tidak masuk git):

| Email | Peran | Sandi |
|---|---|---|
| `super@sma.test` | Super Admin | `sandi-sementara-2026` |
| `tu@sma.test` | Admin Sekolah | `sandi-sementara-2026` |

Kalau hilang setelah `migrate:fresh`:

```bash
ADMIN_PASSWORD='sandi-sementara-2026' pa pengguna:buat \
  --nama="Iqbal Raihan" --email=super@sma.test --peran=super-admin
```

---

## 3. Jebakan yang sudah pernah menggigit

Semua ini sudah terjadi dan sudah diperbaiki. Jangan mengulanginya.

**Daftar putih purifier harus cocok dengan tombol editor.** Bawaan paket tidak mengizinkan `h2/h3/blockquote`, jadi editor TipTap berbohong: admin menekan tombol Sub-judul, melihatnya bekerja, menyimpan, lalu hilang diam-diam di situs. `SanitasiHtmlTest` menjaga ini. **Menambah tombol baru di `EditorTeks.tsx` tanpa menambahnya ke `config/purifier.php` akan menggagalkan test — itu memang tujuannya.** Setelah mengubah daftar putih, hapus `storage/app/purifier/*`.

**`[x-cloak]` butuh aturan CSS.** `x-cloak` hanyalah atribut kosong yang dihapus Alpine; yang menyembunyikan adalah CSS di `resources/css/app.css`. Tanpa itu semua dropdown tampil terbuka sampai Alpine boot.

**Urutan konversi medialibrary.** Tulis `->nonQueued()->fit(...)`, bukan sebaliknya. Anotasi `@mixin` di paketnya membuat urutan terbalik terlihat salah bagi PHPStan.

**`env()` mengembalikan null setelah `config:cache`.** Untuk membaca variabel lingkungan di luar `config/`, pakai `getenv()`. Ini pernah membuat pembuatan akun pertama gagal senyap di produksi.

**Nama controller bertabrakan.** Ada `App\Http\Controllers\HalamanController` (publik) dan `App\Http\Controllers\Admin\HalamanController`. Di `routes/web.php` yang admin diberi alias `AdminHalamanController`.

**Test memakai SQLite in-memory** (`phpunit.xml`), jadi database dev tidak tersentuh saat menjalankan test.

**Perintah `npm`/`npx` mungkin ditulis ulang oleh hook shell.** Kalau `npm run build` mengeluarkan galat aneh seperti `Missing script: run`, panggil binernya langsung: `./node_modules/.bin/vite build`.

**Media medialibrary bersifat polimorfik.** Endpoint hapus foto galeri memeriksa `model_type` dan `model_id`; tanpa itu URL karangan bisa menghapus media milik model lain.

**Gambar isi berita mempunyai fase tertunda.** Upload editor langsung terikat ke
berita agar ownership dapat diperiksa, tetapi baru berstatus `dipakai` setelah
HTML berhasil tersimpan. Jangan menghapus media `tertunda` saat tab lain
menyimpan berita. Scheduler harian memulihkan gambar yang sudah direferensikan
dan menghapus upload tertunda berumur lebih dari 24 jam; cron cPanel
`php artisan schedule:run` wajib tetap aktif.

---

## 4. Keputusan yang sudah dikunci

Detail lengkap ada di `PRD-SMA.md` (ADR-1 sampai ADR-14). Ringkasnya, **jangan diperdebatkan ulang tanpa alasan baru**:

| Keputusan | Alasan singkat |
|---|---|
| Laravel + Blade, bukan Next.js | Shared hosting; biaya storage media dan tata kelola pembayaran |
| MySQL, **bukan** Supabase/Firebase | Skala ~1000 pengunjung tidak butuh itu. Keduanya menghidupkan tagihan dolar via kartu pribadi yang tidak bisa dialihkan ke yayasan. Firebase adalah Google Cloud, jadi tidak menghindari apa pun |
| Hosting BiznetGio, bukan Hostinger | Invoice rupiah atas nama yayasan; Hostinger melonjak $2,75→$16,99 saat perpanjangan, dan satu paket berisi klien lain tidak bisa diserahterimakan |
| Admin manual, bukan Filament | Pilihan pemilik proyek |
| Admin Inertia+React, publik Blade | Pilihan pemilik proyek untuk nilai belajar; batas dijaga ketat |
| Pemulihan sandi lewat super admin, bukan penyedia identitas | Menghapus SMTP dari jalur kritis peluncuran |
| medialibrary, bukan tabel media sendiri | Jangan pernah menulis sendiri penanganan upload |

---

## 5. Arah visual yang dipilih

**Hijau Santri dipilih dan diterapkan pada 20 Agustus 2026.**

Situs pesantren berwarna biru `#1e3a8a`, sehingga arah hijau membuat identitas
SMA mudah dibedakan. Warna brand `#14532d` dipasangkan dengan highlight
`#b45309`; implementasinya tetap memakai token semantik di
`resources/css/app.css`, bukan nilai warna langsung di Blade atau TSX.

UI publik telah dirombak menjadi institusional-modern dengan pola informasi
sekolah negeri rujukan, tetapi tetap ringan: Blade + Alpine untuk publik dan
Inertia + React hanya untuk admin. Jangan mengganti stack atau menaruh Inertia
secara global hanya untuk perubahan visual berikutnya.

---

## 6. Yang belum selesai, urut prioritas

Pekerjaan lama nomor 1–4 (push awal, halaman error, `og:image`, dan SEO teknis)
selesai pada 17 Agustus 2026. Rinciannya ada di `CHANGELOG.md`.

| # | Pekerjaan | Kenapa | Perkiraan |
|---|---|---|---|
| 5 | Audit keamanan, performa, maintainability | **Belum pernah dijalankan.** Percobaan sebelumnya gagal kena batas kuota | 3 jam |
| 6 | Deploy ke BiznetGio | Lihat bagian Deploy di `AGENTS-SMA.md` | 3–4 jam |
| 7 | Bagan organisasi bergaris penghubung | **Selesai 20 Agustus 2026.** Konektor CSS murni, hierarki semantik, mode daftar sampai tablet, dan bagan desktop | — |
| 8 | Rombak UX editor berita | **Selesai 20 Agustus 2026.** Dua kolom, drag/drop dan paste gambar, alt wajib, serta caption yang melekat pada gambar | — |
| 9 | Date picker yang layak | **Selesai 20 Agustus 2026.** Kontrol tanggal+jam native, aksi Sekarang/Kosongkan, dan zona waktu WIB; tidak menambah paket | — |
| 10 | Kompresi gambar otomatis | **Selesai 20 Agustus 2026.** Raster diperkecil ke WebP di browser sebelum seluruh jalur unggah; varian Media Library memakai WebP kualitas 75 tanpa optimizer CLI | — |
| 11 | Terapkan arah desain terpilih | **Selesai 20 Agustus 2026** — Hijau Santri | — |
| 12 | Panduan CMS + dokumen serah terima | Sekolah harus bisa jalan tanpa kita | 3 jam |

---

## 7. Yang ditunggu dari sekolah

Ini di luar kendali pengembang. Daftar lengkap dan siap diteruskan ada di `naskah/README.md`.

**Memblokir peluncuran:**
- Alamat lengkap, telepon, WhatsApp. Halaman `/kontak` tidak boleh disembunyikan maupun terbit setengah isi
- Naskah **Prestasi Siswa** dan **Tata Tertib** — di `WEBSITE.docx` keduanya cuma judul kosong

**Dua konflik nama yang belum terjawab.** Bagan organisasi dan tabel Data Guru tidak cocok. Ini nama orang — jangan dipilih sepihak:

| Jabatan | Tabel | Bagan |
|---|---|---|
| Wakil Kepala Sekolah | **Nur** Rochman Hidayat, S.Pd. | **Fathur** Rochman Hidayat, S.Pd. |
| Kepala TU | Rofi**y**atun | Rofiatun |

Seeder memakai versi tabel sementara, dan menandainya dengan komentar.

**Menyusul:** foto gedung dan kegiatan, dua foto pendidik yang belum tersedia,
minimal satu berita, NPSN, akreditasi, serta koordinat peta. Izin publikasi foto
siswa dikonfirmasi sudah diperoleh oleh pemilik proyek pada 20 Agustus 2026;
bukti izinnya tetap harus disimpan bersama dokumen serah-terima. Logo dan 14 foto guru/tendik yang namanya dapat
dipastikan sudah masuk melalui `MediaSekolahSeeder`; satu foto tanpa nama tidak
digunakan agar identitas orang tidak ditebak.

---

## 8. Peta berkas

```
AGENTS.md                  pintu masuk, enam aturan mutlak
HANDOFF.md                 berkas ini
AGENTS-SMA.md              aturan kerja lengkap
PRD-SMA.md                 lingkup + 14 ADR
CHANGELOG.md               riwayat perubahan (WAJIB diisi)
docs/KONTEN-SEKOLAH.md     naskah sekolah tanpa NUPTK
naskah/README.md           daftar kebutuhan dari sekolah

resources/css/app.css      SATU-SATUNYA sumber kebenaran visual
resources/views/           situs publik (Blade)
resources/js/Pages/        panel admin (React), nama berkas = argumen Inertia::render()
app/Http/Controllers/      publik; Admin/ untuk panel
database/seeders/KontenSekolahSeeder.php   konten nyata sekolah
```

Rujukan yang boleh dibaca tapi **tidak boleh diubah**: `/Users/iqbalrei/Projects/KKN/PP_ahlulirfan` — situs pesantren, repo berbeda.
