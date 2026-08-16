# CHANGELOG

Riwayat perubahan situs SMA Ahlul Irfan Bangsalsari. Terbaru di atas.

## Aturan pengisian — wajib

**Tambahkan entri di sini sebelum menyatakan pekerjaan selesai.** Berlaku untuk siapa pun yang mengerjakan proyek ini, manusia maupun agen.

Alasannya bukan formalitas: situs ini akan diwariskan ke orang yang tidak mengikuti pengerjaannya. Riwayat git menyimpan *apa* yang berubah, berkas ini menyimpan **kenapa** — dan "kenapa" itulah yang hilang duluan.

Format tiap entri:

```markdown
## [tanggal] — judul singkat

**Dikerjakan:** siapa (mis. Claude Opus 5, Codex, Iqbal)

### Berubah
- Perubahan yang terlihat pengguna atau admin

### Diperbaiki
- Bug, beserta gejalanya. Sebutkan cara memastikannya benar-benar terjadi

### Diputuskan
- Keputusan yang mengikat pekerjaan berikutnya, dan alasannya.
  Kalau besar, tambahkan juga sebagai ADR di PRD-SMA.md

### Verifikasi
- Perintah yang dijalankan beserta hasilnya
```

Tiga hal yang harus ada, karena ini yang paling sering hilang:

1. **Sebutkan alasan, bukan cuma tindakan.** "Menambah kolom `baris`" tidak berguna. "Menambah kolom `baris` karena bagan sekolah punya satu deret yang menggantung di bawah keempat kotak Waka sekaligus, dan pohon `atasan_id` biasa tidak bisa menyatakan induk jamak" — itu berguna.
2. **Catat yang sengaja TIDAK dikerjakan** beserta alasannya. Tanpa ini, orang berikutnya akan mengerjakannya lalu menemukan alasan yang sama dengan susah payah.
3. **Sertakan hasil verifikasi.** Jangan menulis "sudah diuji" tanpa angka.

---

## 2026-08-16 — Purifier membuang heading, dan draft handoff

**Dikerjakan:** Claude Opus 5

### Diperbaiki
- **Daftar putih HTMLPurifier membuang `<h2>`, `<h3>`, `<blockquote>`, dan `class="arab"`.** Gejalanya halus dan berbahaya: editor TipTap memberi admin tombol "Sub-judul" dan "Kutipan", admin memakainya, melihatnya bekerja di editor, menyimpan — lalu tag itu diam-diam menjadi `<p>` biasa di situs publik. Kelas `arab` untuk basmalah di Sambutan Kepala Sekolah ikut hilang, dan `prosa.blade.php` selama ini menata `[&_h3]`, `[&_blockquote]`, `[&_.arab]` untuk elemen yang tidak pernah sampai ke halaman.

  Dampaknya bukan kosmetik: `/profil`, `/kurikulum`, `/tata-tertib`, `/prestasi`, dan isi tiap berita adalah halaman paling padat teks di situs, dan semuanya terbit sebagai dinding `<p>` tanpa satu pun heading internal — pengguna pembaca layar tidak bisa melompat antarbagian, dan mesin pencari kehilangan sinyal struktur.

  Cara memastikannya: `clean('<h3>Judul</h3>')` mengembalikan `<p>Judul</p>` sebelum perbaikan.

- **`[x-cloak]` tidak punya aturan CSS sama sekali.** `x-cloak` hanyalah atribut kosong yang dihapus Alpine; yang menyembunyikan adalah CSS. Tanpa aturan itu, seluruh dropdown navbar dan menu mobile tampil **terbuka** sejak halaman pertama dicat sampai Alpine selesai boot. Aset dimuat sebagai modul (defer), jadi di 3G jeda itu ratusan milidetik — terlihat, dan memicu pergeseran tata letak.

### Berubah
- `figure` dan `figcaption` kini diizinkan, menyiapkan keterangan yang menempel pada gambar di dalam artikel.
- Atribut `style` dibuang total dari isi editor. Menempel dari Word membawa warna dan font sembarangan yang melanggar Aturan Token.
- Atribut `class` dibatasi hanya nilai `arab` lewat `Attr.AllowedClasses`, sehingga admin tidak bisa menyuntik kelas Tailwind sembarangan.
- `naskah/` dibuat sebagai tempat menaruh bahan dari sekolah, berikut daftar periksa penghambat rilis. Isinya diblokir git, README-nya ikut.
- `AGENTS.md`, `HANDOFF.md`, dan `CHANGELOG.md` dibuat untuk serah terima pekerjaan ke agen atau pengembang lain.

### Diputuskan
- **Situs pesantren ternyata biru `#1e3a8a`, bukan hijau.** Warna SMA sekarang `#0d4a5c` dipilih dengan alasan "supaya beda dari hijau pesantren" — alasan itu salah, diambil dari contoh ilustratif di `DESIGN_SWAP_PLAYBOOK.md` yang barisnya sendiri menyatakan nilai aslinya berbeda. Akibatnya dua situs berada di keluarga warna yang sama dan berisiko tertukar. Tiga arah desain pengganti sudah disusun dan diverifikasi kontrasnya; **pemilik proyek belum memilih**, jadi belum diterapkan.
- Pemulihan kata sandi tetap lewat super admin, bukan Supabase/Firebase/Google Sign-In. Skala 5–10 admin tidak sepadan dengan menambah penyedia identitas, dan semuanya menghidupkan kembali tagihan dolar yang tidak bisa dialihkan ke yayasan.

### Sengaja tidak dikerjakan
- **Paket sitemap** (`spatie/laravel-sitemap`) — paket itu bekerja dengan merayapi situs, sementara rute kita cuma ~30 dan sudah diketahui semua. Satu route Blade lebih sedikit kodenya daripada dependensinya.
- **Paket schema.org** — hanya butuh satu blok JSON-LD.
- **Laravel Telescope** — berat untuk shared hosting; debugbar sudah menutup kebutuhan lokal.
- **Pest** — PHPUnit sudah jalan dengan 65 test; pindah hanya membeli gaya penulisan.

### Verifikasi
- 65 test lolos, phpstan level 5 nol error, tsc bersih, pint bersih, `vite build` bersih.
- Sanitasi diuji tujuh kasus: heading, kutipan, kelas arab, figure/figcaption lolos; `style`, kelas liar, dan `<script>` dibuang.

---

## 2026-08-15 — Panel admin lengkap sembilan bagian

**Dikerjakan:** Claude Opus 5

### Berubah
- Panel admin dari dua bagian menjadi sembilan: Dasbor, Berita, Halaman, Guru & Tendik, Struktur Organisasi, Ekstrakurikuler, Galeri, Pengaturan Situs, Akun Pengguna.
- Kerangka admin mengikuti panel situs yayasan — sidebar gelap tetap 16rem, nav mobile terpisah, header sambutan — tetapi memakai warna token SMA, bukan salinan palet pesantren.
- Panel admin dipindah ke Inertia + React + TypeScript. Situs publik tetap Blade.
- Editor teks kaya TipTap, pilihan ekstensinya mengikuti editor situs pesantren tetapi ditulis ulang tanpa shadcn, lucide, dan dialog media Supabase.
- `pengguna:buat` dan `pengguna:sandi` bisa dijalankan tanpa TTY, untuk pemakaian lewat SSH.

### Diperbaiki
- `pengguna:buat` gagal di lingkungan non-TTY dengan pesan "Required." yang tidak menjelaskan apa pun. Symfony menganggap perintah tetap interaktif selama `--no-interaction` tidak dipakai; diganti `stream_isatty(STDIN)`.
- `env()` mengembalikan null setelah `php artisan config:cache`, sehingga pembuatan akun pertama di produksi akan gagal senyap tepat setelah deploy. Diganti `getenv()`. Ditemukan larastan.
- Enam kesalahan tipe di model, termasuk perbandingan enum yang selalu bernilai salah, yang lolos dari 36 test karena jalur kodenya belum pernah dieksekusi. Ditemukan larastan pada pemasangan pertama.

### Diputuskan
- Middleware `inertia` hanya dipasang pada grup rute admin, tidak global, dan entry Vite dipisah dua. Pengunjung situs publik memuat ~46KB, panel admin ~720KB. Memasang Inertia global akan menyamakan keduanya di angka besar.
- `larastan` dipasang sejak awal, bukan setelah rilis, karena pada jalannya yang pertama ia langsung menemukan enam bug nyata.
- Penjaga yang tidak boleh dilepas: halaman kosong tidak bisa diterbitkan; simpul akar bagan tidak bisa dihapus; simpul tidak bisa menjadi atasan dirinya sendiri; super admin terakhir tidak bisa diturunkan atau dihapus; menghapus akun sendiri ditolak.

### Verifikasi
- 59 test lolos, phpstan nol error, tsc bersih.
- Alur end-to-end diuji di browser: login, mengetik di TipTap, format kutipan, simpan lewat Inertia, HTML tersimpan utuh di database.

---

## 2026-08-15 — Fondasi, situs publik, admin berita

**Dikerjakan:** Claude Opus 5

### Berubah
- Laravel 13.25 + Blade + Tailwind v4, PHP 8.4.1, SQLite lokal / MySQL produksi.
- Situs publik 15 rute, mengikuti struktur navigasi yang dipakai sekolah di `WEBSITE.docx`.
- Naskah sekolah ditranskrip ke `docs/KONTEN-SEKOLAH.md` **tanpa kolom NUPTK**.
- Peran `super-admin` dan `admin` lewat spatie/laravel-permission.
- Bagan organisasi dirender HTML dari tabel `struktur_organisasi`, bukan dari gambar.

### Diputuskan
- `WEBSITE.docx` diblokir `.gitignore` **sebelum commit pertama** — berkas itu memuat NUPTK 13 orang, dan sekali masuk riwayat git praktis tidak bisa ditarik lagi. Repo saat itu belum punya commit apa pun, jadi jendela ini tertutup pada commit pertama.
- Halaman yang naskahnya belum ada memberi 404 dan hilang dari navigasi lewat `konten_halaman.terbit`, bukan terbit dalam keadaan kosong. **Kecuali `/kontak`** — situs sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya, jadi kekurangan data kontak memblokir rilis, bukan menyembunyikan halaman.
- Bagan organisasi tidak memakai gambar dari docx: tidak terbaca di 390px, tidak bisa dicari, dan menciptakan sumber kebenaran kedua yang akan berbeda dari daftar guru begitu ada mutasi.
- Kolom `baris` ditambahkan ke `struktur_organisasi` karena bagan sekolah punya satu deret (BK, Wali Kelas, Guru Mapel) yang menggantung di bawah **keempat** kotak Waka sekaligus, dan pohon `atasan_id` biasa tidak bisa menyatakan induk jamak.

### Verifikasi
- 36 test lolos, pint bersih, `migrate:fresh --seed` bersih di SQLite.
- Nol kelas palet Tailwind dan nol hex di luar `resources/css/app.css`.
