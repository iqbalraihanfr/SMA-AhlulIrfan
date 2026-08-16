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

5 commit, **semuanya masih lokal — belum pernah di-push**. Remote `origin/main` masih kosong.

```
80877ca fix(konten): purifier tidak lagi membuang heading, kutipan, dan kelas arab
fca5158 feat(admin): panel lengkap 9 bagian, kerangka sidebar, pemulihan sandi tanpa SMTP
332d9d8 fix(cli): pengguna:buat dapat dijalankan tanpa TTY dan saat config di-cache
9a8c05f feat(admin): panel admin jadi Inertia + React, tambah larastan dan editor TipTap
ab23ace feat: situs profil SMA Ahlul Irfan — fondasi, situs publik, admin berita
```

**Push adalah pekerjaan nomor satu.** Semua kerja masih ada di satu laptop.

### Sudah jalan dan teruji

**Situs publik, 15 rute:** `/`, `/profil`, `/profil/struktur-organisasi`, `/kurikulum`, `/guru`, `/e-learning`, `/ekstrakurikuler`, `/prestasi`, `/tata-tertib`, `/organisasi-siswa`, `/berita`, `/berita/{slug}`, `/galeri`, `/galeri/{slug}`, `/kontak`.

**Panel admin, 9 bagian:** Dasbor, Berita, Halaman, Guru & Tendik, Struktur Organisasi, Ekstrakurikuler, Galeri, Pengaturan Situs, Akun Pengguna.

**Verifikasi:** 65 test lolos, phpstan level 5 nol error, tsc bersih, pint bersih.

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

## 5. Koreksi penting yang belum dieksekusi

**Situs pesantren berwarna BIRU `#1e3a8a`, bukan hijau.**

Warna SMA sekarang `#0d4a5c` (biru-teal) dipilih dengan alasan "supaya beda dari hijau pesantren". Alasan itu salah — diambil dari contoh ilustratif di `PP_ahlulirfan/docs/DESIGN_SWAP_PLAYBOOK.md` yang barisnya sendiri menyatakan nilai aslinya berbeda. Akibatnya **dua situs sekarang berada di keluarga warna yang sama dan berisiko tertukar.**

Tiga arah desain pengganti sudah disusun, semuanya menjauh dari biru dan sudah diverifikasi kontrasnya:

| Arah | brand | highlight | Catatan |
|---|---|---|---|
| A · Hijau Santri | `#14532d` | `#b45309` | Tetap utuh tanpa foto bagus. Paling aman |
| B · Marun Akademik | `#6b1f2a` | `#a16207` | Paling formal, paling jauh dari nuansa pesantren |
| C · Tembakau Jember | `#2f3d2c` | `#8a6a1c` | Paling berkarakter, **tapi wajib ada foto bagus** |

**Pemilik proyek belum memilih.** Jangan menerapkan salah satunya tanpa persetujuan.

---

## 6. Yang belum selesai, urut prioritas

| # | Pekerjaan | Kenapa | Perkiraan |
|---|---|---|---|
| 1 | **Push ke GitHub** | 5 commit masih di satu laptop | 5 menit |
| 2 | Halaman error 404/403/500 | Sekarang halaman bawaan Laravel berbahasa Inggris | 1 jam |
| 3 | `og:image` | Tautan di grup WA wali murid muncul tanpa gambar — itu kanal utama audiens | 1 jam |
| 4 | `sitemap.xml`, `robots.txt`, JSON-LD `EducationalOrganization` | Google belum bisa mengenali ini sebagai sekolah. Tulis tangan, **jangan pasang paket** — rutenya cuma ~30 | 2 jam |
| 5 | Audit keamanan, performa, maintainability | **Belum pernah dijalankan.** Percobaan sebelumnya gagal kena batas kuota | 3 jam |
| 6 | Deploy ke BiznetGio | Lihat bagian Deploy di `AGENTS-SMA.md` | 3–4 jam |
| 7 | Bagan organisasi bergaris penghubung | Diminta pemilik: sekarang hanya kotak tanpa garis, tidak terbaca sebagai hierarki. CSS murni, jangan paket JS | 3 jam |
| 8 | Rombak UX editor berita | Diminta pemilik: "riweh". Perlu dua kolom (isi + sidebar metadata), seret-lepas gambar, caption menempel pada gambarnya | 4 jam |
| 9 | Date picker yang layak | Diminta pemilik. `PP_ahlulirfan` memakai `react-day-picker` — periksa dan pertimbangkan reuse | 2 jam |
| 10 | Kompresi gambar otomatis | Diminta pemilik. **Jangan pakai `spatie/laravel-image-optimizer`** — butuh binary CLI yang tidak ada di shared hosting. Pakai kompresi sisi klien sebelum unggah + kualitas WebP di konversi medialibrary | 2 jam |
| 11 | Terapkan arah desain terpilih | Menunggu keputusan pemilik | 4–10 jam |
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

**Menyusul:** logo, foto gedung dan kegiatan, foto guru, minimal satu berita, NPSN, akreditasi, koordinat peta, izin tertulis publikasi foto siswa.

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
