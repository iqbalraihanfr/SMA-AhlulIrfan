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

## 2026-08-20 — Enam foto guru tambahan dan pembaruan aset resmi

**Dikerjakan:** Iqbal (penyediaan aset), diintegrasikan dan diverifikasi oleh
Codex GPT-5.6 Sol

### Berubah
- Enam foto bernama tambahan dipasang untuk Fathur Rohman, Nur Rochman Hidayat,
  Yeni Sri Astutik, Noviani, Ahmad Saini, dan Sofiatul Lailiyah. Bersama delapan
  aset sebelumnya, 14 dari 16 guru/tendik kini memiliki potret resmi.
- Logo yayasan yang sebelumnya dipakai sebagai fallback diganti dengan logo
  resmi SMA Ahlul Irfan 512×512 dari batch terbaru.
- Seluruh potret seeder diseragamkan menjadi WebP 1200×1800 tanpa metadata
  kamera. Foto mentah 59 MB dipindahkan dari `public/` ke
  `naskah/foto-original/2026-08-20-tambahan/` yang diabaikan Git agar tidak
  dapat diunduh pengunjung dan tidak membengkakkan repositori.

### Diperbaiki
- `MediaSekolahSeeder` kini memberi penanda sumber dan versi aset. Foto bawaan
  lama dapat diperbarui saat aset resmi berubah, tetapi foto yang pernah
  diunggah admin tidak pernah ditimpa oleh seeder.
- Dokumentasi kebutuhan foto diperbarui: hanya Hilmi Fathiyatul Baroroh dan
  Anis Novi Rahayu yang masih memakai inisial. `GEMA2770.JPG` tidak dibuat
  menjadi media kedua karena hash-nya identik dengan foto Sofiatul Lailiyah;
  deduplikasi ini mencegah satu orang dipetakan dua kali.
- Judul halaman Guru & Tenaga Kependidikan tidak lagi menampilkan teks literal
  `&amp;` akibat entitas HTML yang di-escape dua kali oleh properti komponen.

### Verifikasi
- Tes seeder memeriksa 14 pemetaan, idempotensi, konversi media, penanda sumber,
  serta perlindungan foto pilihan admin.
- Gerbang integrasi lengkap lulus: 88 test PHP dengan 542 asersi, 5 test Node,
  Pint, PHPStan level 5 tanpa error, TypeScript tanpa error, dan build produksi
  Vite 8.2.1 sebanyak 2.406 modul.
- Audit berkas memastikan seluruh aset repo berupa WebP 1200×1800 atau logo
  WebP 512×512, total 1,6 MB, tanpa metadata EXIF/GPS yang terbaca.
- Browser Chromium nyata memverifikasi seluruh kartu pada 1280×900 dan 390×844:
  crop wajah benar, logo baru tampil, judul terbaca normal, dan konsol nol error.

---

## 2026-08-20 — Kompresi otomatis seluruh unggahan gambar

**Dikerjakan:** Codex GPT-5.6 Sol (orchestrator), dengan audit read-only
GPT-5.6 Terra dan Luna

### Berubah
- Seluruh jalur unggah gambar di panel admin—sampul dan isi berita, foto guru,
  gambar ekstrakurikuler, galeri multi-foto, serta logo—kini menyiapkan raster
  di browser sebelum dikirim. Sisi terpanjang dibatasi 2560 piksel dan hasil
  WebP kualitas 82% hanya dipakai bila benar-benar lebih kecil.
- Admin mendapat status ukuran awal/akhir dan jumlah penghematan. Tombol simpan
  dinonaktifkan selama pemrosesan serta bila hasil masih melampaui batas server
  masing-masing: 2 MB untuk logo, 5 MB untuk konten, dan 8 MB per foto galeri.
- Varian Media Library `thumbnail`, `card`, dan `hero` sekarang selalu WebP
  kualitas 75 sesuai aturan proyek. Deploy pertama dari versi lama harus
  menjalankan `php artisan media-library:regenerate --force` satu kali agar
  konversi lama tidak meninggalkan URL WebP tanpa berkas.

### Diperbaiki
- Konfigurasi Media Library tidak lagi menjalankan `jpegoptim`, `pngquant`,
  `cwebp`, atau binary optimizer lain yang tidak dijamin tersedia di shared
  hosting. Konversi server menggunakan GD PHP; pengecilan sumber dilakukan
  browser tanpa dependency baru.
- Server dan pemilih berkas hanya menerima JPG, PNG, dan WebP yang dapat
  dikonversi GD. GIF, SVG, AVIF, HEIC, serta HEIF ditolak dengan pesan jelas,
  bukan dibiarkan gagal 500 atau kehilangan animasi saat menjadi WebP statis.
  Bila browser gagal memproses format yang didukung, berkas asli tetap dipakai
  dan admin mendapat keterangan yang jujur.
- Browser lama tidak merasterisasi gambar ketika metadata orientasinya tidak
  dapat dijamin. Sumber asli dipertahankan agar hasil tidak berputar salah.
- Pemilihan berkas berulang tidak dapat ditimpa hasil kompresi pilihan lama;
  galeri menjaga urutan berkas dan pasangan teks alternatifnya.
- Tombol simpan berita ikut menunggu kompresi dan upload gambar isi. Tanpa
  penguncian ini, artikel dapat tersimpan lebih dulu lalu meninggalkan upload
  tertunda tanpa node gambar di dalam HTML.

### Diputuskan
- Tidak menambah paket kompresi. Canvas dan WebP browser mencukupi untuk klien,
  sedangkan GD yang memang menjadi syarat hosting menangani varian publik.
- Galeri memproses foto secara serial. Sedikit lebih lama daripada dua proses
  paralel, tetapi puncak memori jauh lebih aman untuk Safari/iPhone yang umum
  dipakai pengelola sekolah.
- Sumber di atas 20 MB atau 40 megapiksel tidak dipaksa masuk canvas agar tab
  admin tidak kehabisan memori; UI meminta berkas yang lebih kecil bila hasil
  akhirnya melampaui validasi server.

### Verifikasi
- Tes unit Node mengunci resize proporsional, whitelist format, fallback,
  pemilihan hasil yang lebih kecil, nama WebP, dan peringatan batas berkas.
- Tes fitur PHP mengunci sembilan varian milik Album, Guru, Ekstrakurikuler,
  serta Berita sebagai WebP dengan dimensi maksimum yang benar, membuktikan
  sumber WebP browser dapat dikonversi ulang, dan memastikan GIF ditolak.
- Browser Chromium nyata mengubah PNG 2,1 MB menjadi WebP 102 KB (hemat 95%),
  mengirim nama dan MIME WebP ke server, serta menampilkan logo sekolah di
  panel admin. Pengujian memakai database sementara, bukan database kerja.
- Gerbang akhir integrasi lulus: 88 test PHP dengan 541 asersi, 5 test Node,
  Pint, PHPStan level 5 tanpa error, TypeScript tanpa error, dan build produksi
  Vite 8.2.1 sebanyak 2.406 modul.

---

## 2026-08-20 — Logo sekolah di panel admin

**Dikerjakan:** Codex GPT-5.6 Sol, dengan audit read-only GPT-5.6 Luna

### Berubah
- Sidebar desktop dan drawer navigasi mobile panel admin kini menampilkan logo
  sekolah di samping label **Panel Admin**. Bila logo belum tersedia, inisial
  `AI` tetap menjadi fallback agar instalasi baru tidak kehilangan identitas.
- Logo mengikuti media aktif pada Pengaturan Situs. Saat pengelola menggantinya,
  panel admin ikut berubah tanpa perlu menyentuh kode atau menjalankan seeder.

### Diputuskan
- Layout menerima URL dan teks alternatif melalui shared props Inertia dari
  Media Library. Path berkas seeder tidak ditulis langsung karena itu hanya
  sumber instalasi awal, bukan sumber kebenaran setelah situs dikelola sekolah.

### Sengaja tidak dikerjakan
- Halaman autentikasi Blade tidak diubah karena permintaan hanya menyasar panel
  admin. Batas Blade untuk auth dan Inertia/React untuk `/admin` tetap utuh.

### Verifikasi
- 87 test lolos dengan 468 asersi, termasuk regresi bahwa shared props membawa
  URL dan alt logo aktif.
- Pint, PHPStan level 5, dan TypeScript bersih; Vite 8.2.1 berhasil membangun
  2.404 modul.
- Browser nyata memverifikasi sidebar 1280×900 dan drawer 390×844. Logo terbaca
  sebagai “Logo SMA Ahlul Irfan Bangsalsari” dan tab baru memiliki nol error
  konsol.

---

## 2026-08-20 — Bagan, editor berita, dan penjadwalan yang diminta pemilik

**Dikerjakan:** Codex GPT-5.6 Sol (orchestrator), dengan audit dan review
read-only dari GPT-5.6 Terra dan Luna

### Berubah
- Bagan organisasi kini memakai hierarki daftar yang semantik dan konektor CSS
  murni. Ponsel dan tablet sampai 1023 piksel mendapat daftar bertingkat tanpa
  overflow; layar desktop mendapat bagan lengkap dengan rel antarsimpul dan
  garis penasihat yang berbeda.
- Form berita admin dirombak menjadi area isi dua kolom dengan sidebar metadata
  yang sticky di desktop dan tetap bertumpuk rapi di ponsel. Komponen label juga
  kini menggabungkan `className`, sehingga label khusus pembaca layar tidak lagi
  tertimpa gaya bawaan.
- Editor TipTap dapat menerima gambar lewat pemilih berkas, drag-drop, maupun
  paste. Setiap gambar menjadi satu node `figure` atomik bersama caption,
  mewajibkan teks alternatif, dapat dipindah sebagai satu kesatuan, dan
  caption-nya dapat diedit setelah penyimpanan.
- Tanggal publikasi kini memakai kontrol tanggal dan jam native yang aksesibel,
  dilengkapi aksi **Sekarang** dan **Kosongkan**. Nilai “Sekarang” selalu dihitung
  dalam `Asia/Jakarta`, terlepas dari zona waktu perangkat admin.
- Zona waktu aplikasi mengikuti `APP_TIMEZONE` dengan fallback
  `Asia/Jakarta`. `HANDOFF.md`, PRD, dan daftar konten juga mencatat konfirmasi
  pemilik bahwa izin publikasi foto siswa telah diperoleh pada 20 Agustus 2026;
  bukti persetujuannya tetap harus ikut dokumen serah-terima.

### Diperbaiki
- Upload gambar isi sekarang terikat ke berita pemiliknya; server menolak media
  berita lain dan hotlink, membersihkan HTML, lalu menulis ulang URL, dimensi,
  serta alt dari Media Library. Ini mencegah nilai klien dan URL pelacak masuk
  ke artikel publik.
- Media baru berstatus `tertunda` sampai HTML benar-benar tersimpan. Finalisasi
  tidak lagi menghapus upload tab admin lain, tidak menghapus file sebelum
  pembaruan berita berhasil, dan kegagalan housekeeping non-kritis tidak
  membuat penyimpanan yang sudah persisten tampak gagal.
- Pembersih harian hanya menyasar koleksi isi milik model Berita, memulihkan
  status media yang ternyata sudah direferensikan HTML, menghapus upload
  tertunda lebih dari 24 jam, dan memakai mutex `withoutOverlapping`.
- Pemilihan gambar di editor kini benar-benar membuka panel edit caption;
  mengetik caption tidak mencuri fokus, dan Enter pada panel upload tidak lagi
  mengirim form berita sebelum gambar disisipkan.
- Area bagan diberi nama region dan fokus keyboard. Temuan review pada lebar 768
  piksel—akar terdorong dan kartu terpotong—ditutup dengan mempertahankan mode
  daftar sampai breakpoint desktop.

### Diputuskan
- Tidak ada dependency baru. Node gambar ditulis dengan API TipTap yang sudah
  terpasang, sedangkan tanggal/jam memakai kontrol browser; ini mengurangi
  beban pemeliharaan dan ukuran bundle untuk kebutuhan yang sudah tercakup.
- Upload isi diaktifkan setelah berita pertama kali disimpan karena endpoint
  membutuhkan pemilik media yang nyata. Setelah membuat berita, admin langsung
  diarahkan ke halaman ubah dengan penjelasan bahwa gambar kini dapat disisipkan.
- Foto isi dan gambar sampul tetap dua konsep terpisah: koleksi `isi` tidak
  pernah dipakai sebagai sampul kartu berita.

### Sengaja tidak dikerjakan
- Kompresi gambar otomatis (pekerjaan nomor 10) tidak disentuh karena sedang
  dikerjakan pemilik di room lain. Perubahan ini hanya memakai konversi Media
  Library yang sudah ada untuk URL gambar isi.
- Tidak memasang `react-day-picker`, `date-fns`, atau extension image tambahan;
  kebutuhan UX selesai tanpa memperluas dependency proyek.

### Verifikasi
- 86 test lolos dengan 456 asersi. Cakupannya termasuk izin 403, alt wajib,
  berkas non-gambar/lebih dari 5 MB, ownership lintas berita, sanitasi hotlink,
  URL dan dimensi hasil konversi, persistensi caption, media tertunda, pemulihan
  pembersih, zona waktu, dan markup semantik bagan.
- Pint bersih; PHPStan level 5 nol error; TypeScript `tsc --noEmit` bersih; Vite
  8.2.1 membangun 2.404 modul dengan sukses tanpa menambah paket.
- Browser nyata memverifikasi bagan pada 390, 768, dan 1280 piksel; editor pada
  390 dan 1280 piksel; upload, drag-drop, simpan/reload, edit caption per
  karakter, serta aksi Sekarang/Kosongkan. Tab verifikasi baru memiliki nol
  error konsol. Artikel dan media uji lokal kemudian dihapus melalui model,
  sehingga tidak meninggalkan konten tiruan di database pengembangan.
- Audit literal data privat pada `app`, `resources`, dan `database`, audit warna
  keras/kelas palet pada Blade dan TSX, serta `git diff --check` seluruhnya
  menghasilkan nol temuan.

---

## 2026-08-20 — Redesign publik dan media resmi sekolah

**Dikerjakan:** Codex (orchestrator) dan GPT-5.6 Luna (executor)

### Berubah
- Seluruh situs publik dirombak ke arah institusional-modern dengan palet Hijau
  Santri. Hierarki, ritme ruang, navigasi, footer, komponen kartu, halaman
  profil, guru, berita, galeri, ekstrakurikuler, kontak, dan prosa kini memakai
  satu sistem token semantik yang tetap dapat dirawat dari
  `resources/css/app.css`.
- Urutan beranda kini Hero → Sambutan → Kurikulum → Ekstrakurikuler → Guru →
  Berita → Galeri → CTA. Polanya mengambil prinsip keterbacaan situs sekolah
  rujukan, tetapi publik tetap Blade + Alpine agar ringan bagi wali siswa yang
  mengakses lewat ponsel; batas Inertia + React hanya untuk admin tidak berubah.
- Logo dan delapan foto guru/tendik resmi diperkecil ke WebP, orientasinya
  dibetulkan, dan metadata kameranya dibuang. `MediaSekolahSeeder` memasangnya
  ke koleksi medialibrary secara idempoten tanpa menimpa unggahan admin.
- Beranda memprioritaskan empat guru yang sudah mempunyai foto, sedangkan
  halaman Guru & Tendik eager-load media untuk mencegah query per kartu.
- Aset sumber 43 MB dipindahkan dari `public/` ke `naskah/foto-original/` yang
  diabaikan Git. Salinan asli tetap tersedia lokal, tetapi tidak dapat diakses
  pengunjung dan tidak membengkakkan repositori.

### Diperbaiki
- Sambutan Kepala Sekolah sebelumnya kehilangan tiga baris penutup ketika
  ditranskripsikan ke seeder. Halaman profil kini memuat tanggal, jabatan, dan
  nama `FATHUR ROHMAN, S.P`, serta dijaga test fitur agar tidak terpotong lagi.
- Tautan Beranda sebelumnya dapat terlihat aktif di semua URL karena `/`
  merupakan prefix setiap halaman. Pemeriksaan aktif kini memakai nama route
  khusus untuk Beranda dan memberi `aria-current` hanya pada halaman yang benar.
- Ringkasan sambutan dan kurikulum tidak lagi merapatkan akhir satu paragraf ke
  awal paragraf berikutnya ketika tag HTML dibuang.
- Teaser galeri yang hilang dari urutan beranda dikembalikan, tetapi hanya
  mengambil album yang benar-benar memiliki foto dan melakukan eager-load.
- Dropdown desktop dapat ditutup dengan Escape, click-outside, dan perpindahan
  fokus; menu mobile memakai struktur daftar bersarang serta label buka/tutup
  yang sesuai keadaan.
- Komentar pengaman privasi dirapikan agar audit literal pada kode aplikasi
  benar-benar menghasilkan nol temuan, tanpa mengurangi larangan menyimpan
  identitas kependudukan.

### Diputuskan
- Arah Hijau Santri (`brand #14532d`, `highlight #b45309`) menjadi arah visual
  SMA. Nilai warna hanya hidup di berkas CSS pusat; Blade dan TSX memakai token
  semantik.
- Stack Laravel 13 + Blade/Alpine publik + Inertia/React admin dipertahankan.
  Redesign tidak menjadi alasan migrasi framework menjelang serah-terima.
- `WEBSITE.docx` tidak dibuka karena berisi data sensitif dan diblokir aturan
  privasi repo. Semua konten, termasuk sambutan, diverifikasi dari transkrip
  aman `docs/KONTEN-SEKOLAH.md`.

### Sengaja tidak dikerjakan
- `GEMA2770.JPG` tidak digunakan karena tidak memuat nama orang. Identitas guru
  tidak ditebak dari wajah; sekolah perlu memberi pemetaan sebelum foto itu
  boleh dipublikasikan.
- Delapan pendidik yang belum mempunyai foto tetap memakai inisial yang stabil.
  Tidak digunakan stok foto atau gambar buatan untuk merepresentasikan orang
  nyata.
- Tidak ada fitur absensi, perubahan skema bisnis, atau migrasi Next.js dalam
  pekerjaan UI ini. Lingkupnya sengaja dijaga agar versi Laravel siap
  diserahterimakan.

### Verifikasi
- 77 test lolos dengan 388 asersi, termasuk kelengkapan sambutan, integrasi
  delapan foto, idempotensi seeder media, teaser galeri, dan status navigasi.
- Pint bersih; PHPStan level 5 nol error dengan PHP MAMP 8.4.1; TypeScript
  `tsc --noEmit` bersih; Vite 8.2.1 membangun 2.402 modul dengan sukses.
- Audit literal privasi pada `app`, `resources`, dan `database` menghasilkan nol
  temuan; `git diff --check` bersih.
- Browser nyata memverifikasi beranda desktop 1280×900 dan halaman guru mobile
  390×844. Logo dan semua delapan foto tampil, layout responsif, dan konsol
  browser tidak memiliki error.

---

## 2026-08-17 — Halaman error dan fondasi SEO publik

**Dikerjakan:** Codex

### Berubah
- Halaman 403, 404, dan 500 kini memakai tampilan sekolah berbahasa Indonesia,
  responsif, dapat dinavigasi dengan keyboard, dan diberi `noindex`. Layout-nya
  sengaja mandiri dari database supaya halaman 500 tetap dapat dirender ketika
  sumber gangguan justru koneksi database.
- Seluruh halaman publik kini mengirim `og:image`, `og:image:alt`, Open Graph
  berbahasa Indonesia, dan Twitter large card. Sampul berita dan foto pertama
  album diprioritaskan; hero situs dipakai bila tersedia; ilustrasi bawaan
  1730×909 menjadi fallback agar instalasi baru tetap menghasilkan pratinjau
  gambar di WhatsApp.
- `sitemap.xml` memuat rute publik yang ditulis eksplisit, halaman prosa yang
  sudah terbit, berita yang sudah terbit dan tidak terjadwal di masa depan,
  serta album galeri. `robots.txt` kini dibentuk dari `APP_URL`, menunjuk sitemap,
  dan menutup rute admin serta autentikasi dari perayap.
- Setiap halaman publik kini memuat JSON-LD `EducationalOrganization` dari
  pengaturan situs. Alamat, telepon, email, koordinat, logo, yayasan, dan media
  sosial hanya ikut bila datanya memang tersedia; tidak ada fakta sekolah yang
  ditebak di view.
- `HANDOFF.md` diperbarui agar pekerjaan lama nomor 1–4 tidak dikerjakan ulang.

### Diperbaiki
- Cache Blade hasil kompilasi sebelumnya ikut dilacak Git. Gejalanya terbukti
  saat test memuat layout SEO lama walaupun source Blade sudah berubah, karena
  timestamp cache lebih baru daripada source. Seluruh cache terkompilasi
  dihapus dari repo dan `storage/framework/views` kini diabaikan; produksi tetap
  membangunnya ulang lewat `php artisan view:cache` saat deploy. Pemindaian
  Tailwind juga dibatasi eksplisit ke source aplikasi agar hash dan ukuran CSS
  tidak berubah mengikuti isi cache runtime.
- Tautan situs sebelumnya tidak memiliki `og:image`, sehingga kanal utama
  audiens—grup WhatsApp wali murid—tidak memperoleh pratinjau gambar.
- Galat HTTP sebelumnya jatuh ke halaman bawaan Laravel berbahasa Inggris dan
  tidak memiliki jalur kembali yang jelas.
- `public/robots.txt` sebelumnya kosong secara semantik (`Disallow:` tanpa
  sitemap), dan belum ada sitemap maupun structured data yang mengenalkan situs
  sebagai lembaga pendidikan.
- Generator URL sebelumnya masih dapat mengikuti `Host` request, sehingga
  domain sementara atau konfigurasi proxy berisiko masuk ke canonical, sitemap,
  dan `og:image`. Origin kini dipaksa mengikuti `APP_URL`, sesuai aturan deploy.
- Konfigurasi Vite masih memakai `__dirname` yang tidak didukung calon default
  native config loader. Alias admin kini memakai `import.meta.dirname`, sehingga
  build tidak lagi mengeluarkan peringatan kompatibilitas tersebut.
- Riwayat yang oleh handoff lama disebut hanya berada di satu laptop ternyata
  sudah sinkron dengan `origin/main` pada awal pekerjaan; dokumentasinya
  diluruskan sebelum perubahan baru didorong.

### Diputuskan
- Sitemap dan schema tetap ditulis tangan tanpa paket baru. Rute publiknya
  sedikit, sudah diketahui, dan status terbit di database perlu menjadi gerbang
  eksplisit—crawler paket akan menambah dependensi tanpa menyederhanakan aturan.
- `robots.txt` dilayani Laravel, bukan berkas statis, karena URL sitemap harus
  mengikuti `APP_URL` dan domain final belum ditentukan.
- Structured data memakai pengaturan situs sebagai sumber kebenaran. Data yang
  belum diberikan sekolah tidak dimasukkan, supaya markup mesin pencari tidak
  mengubah placeholder menjadi klaim resmi.

### Sengaja tidak dikerjakan
- Arah warna baru tidak diterapkan karena pemilik belum memilih Hijau Santri,
  Marun Akademik, atau Tembakau Jember. Halaman error memakai token semantik
  yang ada sehingga akan ikut berubah tanpa refactor setelah pilihan dibuat.
- Halaman Prestasi, Tata Tertib, Organisasi Siswa, dan E-Learning tetap tidak
  masuk sitemap karena naskahnya belum terbit. Memiliki route bukan izin untuk
  mengenalkannya ke mesin pencari.
- Schema `Article` tidak ditambahkan karena pekerjaan ini meminta identitas
  sekolah; prioritasnya satu blok `EducationalOrganization` yang akurat dan
  mudah dirawat.

### Verifikasi
- 73 test lolos dengan 366 asersi, termasuk fallback/prioritas `og:image`,
  parsing JSON-LD, filter sitemap, robots, serta render 403/404/500.
- Pint bersih; PHPStan level 5 nol error (dijalankan dengan batas memori 512 MB
  karena worker melewati batas lokal 128 MB); TypeScript `tsc --noEmit` bersih;
  `vite build` berhasil.
- Browser nyata memverifikasi 404 pada 390×844 dan 1280×800, metadata halaman
  utama, JSON-LD yang dapat diurai, serta URL absolut untuk canonical dan
  `og:image`. Pemeriksaan HTTP memastikan `robots.txt` dan `sitemap.xml` berstatus
  200 dengan tipe konten yang benar, dan fallback gambar berstatus 200
  `image/png`.

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
