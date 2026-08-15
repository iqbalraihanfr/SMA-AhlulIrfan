# AGENTS.md — Website SMA Ahlul Irfan Bangsalsari

> **Untuk Claude Code:** salin file ini ke `CLAUDE.md`, atau isi `CLAUDE.md` dengan: "Baca AGENTS-SMA.md dan patuhi."
> **Scope ada di `PRD-SMA.md`. Jangan bangun apa pun di luar P0 tanpa bertanya.**
> **Sprint 3 hari (15–17 Agustus 2026). Kecepatan penting. Utamakan pakai ulang daripada bikin baru.**

## Konteks proyek

Situs profil publik untuk SMA di bawah Yayasan Ahlul Irfan Al-Kholily, Jember. Audiens: calon siswa dan orang tua yang membandingkan sekolah, mayoritas lewat ponsel dengan kuota terbatas. Seluruh teks antarmuka, label admin, dan konten dalam **Bahasa Indonesia**.

Konten sekolah sudah lengkap dan tertulis: sejarah, visi-misi, kurikulum, sambutan kepala sekolah, 16 guru, 7 ekstrakurikuler. Hambatan proyek ini waktu membangun, bukan waktu menulis.

**Situs kembar:** Pondok Pesantren Ahlul Irfan Al-Kholily di `/Users/iqbalrei/Projects/KKN/PP_ahlulirfan`. Boleh dan sebaiknya dibaca — tapi baca dulu aturan #7 sebelum menyalin apa pun dari sana, karena stack-nya berbeda.

## Stack

Versi yang benar-benar terpasang, bukan rencana:

```
PHP 8.4.1                          dari MAMP: /Applications/MAMP/bin/php/php8.4.1/bin/php
Laravel 13.25                      minimum framework: php ^8.3
Blade                              server-rendered, tanpa SPA
Tailwind CSS 4.3                   via @tailwindcss/vite; token di @theme
MySQL 8                            produksi (BiznetGio) — MAMP menyediakannya juga untuk lokal
SQLite                             dev lokal bawaan — nol setup, satu berkas
laravel/breeze 2.4                 stack Blade; auth saja; registrasi publik DIHAPUS
spatie/laravel-permission 8.3      peran super-admin & admin
spatie/laravel-medialibrary 11.23  upload + konversi thumbnail/card/hero
mews/purifier 3.4                  sanitasi HTML editor sebelum dirender
spatie/laravel-backup 10.3         backup terjadwal ke penyimpanan luar
barryvdh/laravel-debugbar 4.4      dev — pemantauan query, memori, waktu render
barryvdh/laravel-ide-helper 3.7    dev — autocomplete model di editor
laravel/pint                       formatter bawaan
larastan/larastan 3.10             dev — analisis statis PHPStan level 5

--- khusus panel admin ---
inertiajs/inertia-laravel 3.3      jembatan Laravel ↔ React
@inertiajs/react 3.6 + React 19.2  panel admin
tightenco/ziggy 2.6                rute Laravel dapat dipanggil dari React
@tiptap/react 3.30                 editor teks kaya
TypeScript 5                       strict
```

**PHP lokal.** Mesin ini punya PHP 8.5.9 dari Homebrew, tapi target produksi 8.4.1. Karena itu `composer.json` mengunci `config.platform.php = 8.4.1` — Composer menolak paket yang menuntut lebih dari itu, sehingga resolusi dependensi mengikuti produksi tanpa perlu memasang runtime kedua. Jalankan artisan lewat PHP MAMP:

```bash
alias pa='/Applications/MAMP/bin/php/php8.4.1/bin/php artisan'
```

**`spatie/laravel-medialibrary`, bukan `intervention/image`.** Medialibrary menangani unggah, varian ukuran, dan penyimpanan sekaligus — memenuhi Aturan #8 (jangan hand-roll penanganan upload) dan menghapus tabel `media` buatan sendiri. Konversi berjalan sinkron (`QUEUE_CONNECTION=sync`) karena shared hosting tidak punya daemon queue.

**Debugbar hanya untuk lokal.** Ia menampilkan query, isi session, dan variabel — jangan pernah aktif di produksi. Paket ini ada di `require-dev`, jadi `composer install --no-dev` saat deploy sudah membuangnya.

Node hanya dipakai untuk membangun aset. Server produksi tidak butuh Node sama sekali.

**Catatan Breeze:** Breeze dibekukan sejak Laravel 12 dan tidak lagi menerima fitur baru. Ini disengaja dan tidak berdampak — Breeze murni *scaffolding*: ia menyalin controller ke `app/Http/Controllers/Auth/` dan view ke `resources/views/auth/`, lalu paketnya tidak lagi berperan saat runtime. Setelah dipasang, kode itu milik kita. Alternatif terawat jika kelak bermasalah: `laravel/fortify` dengan view Blade sendiri.

## Perintah

### Setup awal — sekali, dari direktori kosong

```bash
composer create-project laravel/laravel .
composer require laravel/breeze --dev
php artisan breeze:install blade          # pilih stack Blade, tanpa dark mode
composer require intervention/image mews/purifier
composer require spatie/laravel-backup
php artisan storage:link
```

Laravel versi mutakhir sudah membawa Vite + Tailwind v4 di skeleton bawaan — **cek `package.json` hasil scaffold sebelum memasang Tailwind manual.** Kalau ternyata belum ada: `npm install tailwindcss @tailwindcss/vite` lalu `@import "tailwindcss";` di `resources/css/app.css`.

Setelah Breeze terpasang, **hapus route dan view registrasi** (`register`) — situs ini tidak punya pendaftaran publik.

### Harian

```bash
composer install
npm install
npm run dev
php artisan storage:link          # sekali saat setup
php artisan migrate --seed
php artisan migrate:fresh --seed  # reset dev
php artisan pengguna:buat         # membuat akun pengelola (satu-satunya cara)
php artisan test
./vendor/bin/pint                 # format PHP — wajib sebelum commit
./vendor/bin/phpstan analyse      # analisis statis — wajib bersih
./node_modules/.bin/tsc --noEmit  # cek tipe TypeScript panel admin
npm run build                     # WAJIB lolos sebelum task dianggap selesai
```

Setiap `php artisan` di atas berarti PHP MAMP 8.4.1, bukan `php` bawaan PATH:

```bash
alias pa='/Applications/MAMP/bin/php/php8.4.1/bin/php artisan'
```

## Aturan emas

1. **ATURAN TOKEN.** Tidak ada warna, font, radius, atau bayangan yang ditulis keras di mana pun. Hanya token semantik dari `resources/css/app.css` (`@theme`). Tidak ada nilai hex, tidak ada kelas palet Tailwind (`bg-blue-800`), tidak ada nilai arbitrer (`bg-[#1e40af]`) di view atau komponen. Butuh token yang belum ada? Tambahkan ke tema dulu.

2. **ATURAN KOMPONEN.** Halaman menyusun section; section menyusun primitif UI. Halaman tidak pernah menata konten langsung. Section jadi Blade component di `resources/views/components/sections/`, primitif di `resources/views/components/ui/`.

3. **ATURAN KONTEN.** Tidak ada konten nyata yang ditulis keras di view. Semua mengalir dari database. Konten dummy hanya hidup di `database/seeders/` dan `database/factories/`.

4. **ATURAN DATA.** Model Eloquent langsung, tanpa lapisan abstraksi provider. Controller mengambil data, view menerima data. Kebutuhan "jalan tanpa database produksi" dipenuhi SQLite + `migrate --seed` — bukan dengan menulis dua implementasi.

5. **ATURAN SKEMA-SEBAGAI-KODE.** Skema hidup di `database/migrations/`. Validasi dan pesan error Bahasa Indonesia hidup di `app/Http/Requests/`. Jangan mengubah tabel lewat phpMyAdmin — selalu lewat migrasi.

6. **ATURAN PRIVASI.** `NUPTK`, `NIK`, dan identitas kependudukan apa pun tidak boleh ada di migrasi, model, response, structured data, maupun HTML yang dirender.

   **Ini bukan larangan teoretis.** Naskah sumber `WEBSITE.docx` memuat NUPTK 13 orang. File itu diblokir `.gitignore` dan naskahnya sudah ditranskrip tanpa kolom tersebut ke `docs/KONTEN-SEKOLAH.md`. Ambil konten dari file transkrip itu — **jangan pernah membuka atau menyalin dari `.docx` langsung**, dan jangan pernah memaksa file naskah masuk git dengan `git add -f`.

7. **PAKAI ULANG DULU — tapi tahu apa yang bisa dipakai ulang.** Repo pesantren memakai **Next.js + Supabase + React**, bukan Laravel. Jadi:

   | Bisa diambil | Tidak bisa diambil |
   |---|---|
   | Nilai token dari `src/app/globals.css` | Komponen React (`src/components/**`) |
   | Markup HTML + kelas Tailwind dari section | `src/lib/data.ts` dan seluruh lapisan data |
   | Struktur dan gaya penulisan dokumen | Admin TipTap berbasis React |
   | Copywriting Bahasa Indonesia | Migrasi Supabase, kebijakan RLS |
   | `docs/DESIGN_SWAP_PLAYBOOK.md` apa adanya | Seluruh test (Vitest/Playwright) |

   Porting markup React ke Blade itu pekerjaan mekanis: `className` → `class`, `{expr}` → `{{ $expr }}`. Jangan mendesain ulang tampilannya.

8. **Tidak ada dependency baru tanpa bertanya.** Yang sudah disetujui ada di daftar Stack. Jangan pernah menulis sendiri autentikasi, penanganan upload, atau validasi — Laravel sudah menyediakannya.

9. **DUA LAPIS RENDER, DAN BATASNYA MUTLAK.**

   | Lapisan | Teknologi | Alasan |
   |---|---|---|
   | Situs publik (`/`, `/profil`, `/berita`, …) | **Blade server-rendered**, JavaScript hanya Alpine untuk nav mobile dan lightbox | Audiensnya orang tua di ponsel dengan kuota terbatas. Halaman tanpa React itu keunggulan, bukan keterbatasan |
   | Panel admin (`/admin/*`) | **Inertia + React + TypeScript** | Pemakainya segelintir staf di laptop, di balik login, dan tidak diindeks mesin pencari |
   | Halaman auth (`/login`, reset password) | **Blade** | Milik Breeze, hanya dua formulir, di luar "aplikasi" admin |

   **Jangan pernah memasang middleware `inertia` secara global.** Ia hanya terpasang pada grup rute admin di `routes/web.php`. Memasangnya di seluruh web akan menyuntikkan payload JSON dan aset React ke halaman publik yang justru dirancang tanpa JavaScript.

   Entry Vite juga sengaja dua: `resources/js/app.js` (publik, Alpine ±46KB) dan `resources/js/admin.tsx` (admin, React + TipTap ±720KB). Pengunjung situs publik tidak boleh ikut mengunduh React. Kalau menambah dependensi berat, pastikan ia masuk entry admin.

10. **Setiap gambar lewat helper media.** Varian `thumbnail`/`card`/`hero` dibuat saat upload. Wajib `loading="lazy"`, `width`, dan `height` untuk mencegah layout shift. Kolom `alt` wajib terisi di tabel media. Situs publik tidak pernah meminta file asli.

## Struktur repo

```
app/
  Http/Controllers/           # publik; Admin/ untuk panel
  Http/Requests/              # validasi + pesan Bahasa Indonesia
  Models/                     # Berita, Guru, Ekstrakurikuler, Album, Media, PengaturanSitus
database/
  migrations/
  factories/
  seeders/                    # sumber tunggal konten dummy
resources/
  css/app.css                 # @theme — satu-satunya sumber kebenaran visual
  js/
    app.js                    # entry SITUS PUBLIK — Alpine saja, tanpa React
    admin.tsx                 # entry PANEL ADMIN — Inertia + React
    types.d.ts                # tipe props bersama dari HandleInertiaRequests
    Layouts/Layout.tsx        # kerangka panel admin
    Components/               # Ui.tsx (primitif), EditorTeks.tsx (TipTap)
    Pages/                    # dipetakan dari Inertia::render('Berita/Index')
  views/
    inertia.blade.php         # root view panel admin
    layouts/                  # guest.blade.php (auth), app.blade.php (halaman akun)
    components/layout/        # situs, navbar, footer — publik
    components/ui/            # primitif Blade publik
    pages/                    # beranda, profil, struktur, guru, ekstrakurikuler, prosa, berita/, galeri/, kontak
routes/web.php
public/branding/
```

Nama berkas di `resources/js/Pages/` menentukan argumen `Inertia::render()`. `Inertia::render('Berita/Form')` memuat `resources/js/Pages/Berita/Form.tsx` — huruf besar-kecil berpengaruh.

## Route

Publik, dikelompokkan seperti navigasi sekolah:

| Kelompok | Route |
|---|---|
| — | `/` |
| Profil | `/profil`, `/profil/struktur-organisasi` |
| Akademik | `/kurikulum`, `/guru`, `/e-learning` |
| Kesiswaan | `/ekstrakurikuler`, `/prestasi`, `/tata-tertib`, `/organisasi-siswa` |
| — | `/berita`, `/berita/{slug}`, `/galeri`, `/kontak` |

Admin: `/login`, `/lupa-password`, `/reset-password`, `/admin/*` — semua di balik middleware `auth`. Tidak ada route registrasi.

**Halaman yang naskahnya belum ada disembunyikan dari navigasi**, dikendalikan kolom `konten_halaman.terbit`. Route-nya boleh ada, tapi tidak muncul di navbar dan tidak masuk sitemap sampai naskahnya datang. Halaman setengah isi lebih merusak kepercayaan calon orang tua daripada halaman yang belum ada. Naskah mana yang sudah ada dan mana yang belum: `docs/KONTEN-SEKOLAH.md`.

`/e-learning` adalah **halaman informasi statis**, bukan sistem. Tidak ada login siswa, tidak ada materi, tidak ada unggah tugas. Keberadaan route ini bukan izin membangun LMS.

**Urutan section Beranda (dikunci):**
Hero → Sambutan Kepala Sekolah → Highlight Kurikulum → Grid Ekstrakurikuler → Grid Guru → Berita Terbaru → Teaser Galeri → CTA Kontak/WhatsApp

## Token desain

Pakai pola dua lapis dari pesantren: palet mentah di `:root`, peran semantik di `@theme`. Yang dirujuk komponen **hanya** nama semantik — begitu grand design tiba, cukup nilai di lapisan mentah yang berubah.

| Token | Peran |
|---|---|
| `--color-brand`, `--color-brand-strong`, `--color-on-brand` | warna utama sekolah, keadaan hover, teks di atasnya |
| `--color-highlight`, `--color-on-highlight` | aksen CTA — pakai hemat |
| `--color-paper`, `--color-paper-raised`, `--color-paper-sunken` | latar halaman, kartu, latar section selang-seling |
| `--color-ink`, `--color-ink-deep`, `--color-ink-muted`, `--color-ink-faint` | hierarki teks |
| `--color-line` | garis dan pemisah |
| `--color-danger`, `--color-success` | pesan validasi dan notifikasi admin |
| `--font-heading`, `--font-sans` | tipografi judul dan teks |
| `--radius-sm/-md/-lg`, `--shadow-card` | bahasa bentuk |
| `--ease-reveal`, `--ease-out-expo` | easing animasi |

Sebagian besar nama di atas diambil apa adanya dari `PP_ahlulirfan/src/app/globals.css` — **verifikasi dengan grep sebelum menulisnya**, jangan menyalin dari dokumen mana pun termasuk yang ini.

Empat token berikut **tidak ada** di pesantren dan sengaja ditambahkan:

| Tambahan | Alasan |
|---|---|
| `--color-ink-muted`, `--color-ink-faint` | pesantren mengisi peran ini langsung dari `--zinc-500`/`--zinc-400`; situs sekolah butuh hierarki teks bernama |
| `--color-on-highlight` | pasangan teks untuk `--color-highlight`; tanpa ini kontras CTA jadi tebakan |
| `--shadow-card` | pesantren memakai bayangan glass yang tidak diport ke sini |
| `--color-danger`, `--color-success` | pesan validasi formulir; tanpa ini komponen Breeze memakai `text-red-600`/`text-green-600` yang melanggar Aturan Token |

**Jangan diambil** dari pesantren: seluruh set semantik shadcn (`--color-background`, `--color-muted`, `--color-sidebar-*`, `--color-chart-*`) karena tidak ada shadcn di sini, ditambah variabel glass dan skala phi kecuali markup yang benar-benar diport memakainya.

### Nilai provisional — pakai ini sampai grand design tiba

Sengaja sederhana dan aman; umurnya pendek, jangan dipoles berlebihan.

```css
:root {
  /* palet mentah */
  --teal-800: #0d4a5c;   /* biru-teal dalam: terbaca "sekolah", beda dari hijau pesantren */
  --teal-900: #08303c;
  --amber-700: #a8560a;  /* satu-satunya warna hangat, khusus CTA */
  --zinc-50:  #fafafa;
  --zinc-100: #f4f4f5;
  --zinc-200: #e4e4e7;
  --zinc-400: #a1a1aa;
  --zinc-600: #52525b;
  --ink-800:  #111111;
  --ink-900:  #0a0a0a;

  /* peran semantik */
  --brand: var(--teal-800);
  --brand-strong: var(--teal-900);
  --on-brand: #ffffff;
  --highlight: var(--amber-700);
  --on-highlight: #ffffff;
  --paper: #ffffff;
  --paper-raised: var(--zinc-50);
  --paper-sunken: var(--zinc-100);
  --ink: var(--ink-800);
  --ink-deep: var(--ink-900);
  --ink-muted: var(--zinc-600);
  --ink-faint: var(--zinc-400);
  --line: var(--zinc-200);
}
```

Kontras di atas latar putih: `brand` 9,8:1 dan `ink-muted` 7,7:1 — lolos AA. Teks putih di atas `highlight` 5,3:1 — lolos AA. **`ink-faint` hanya 2,6:1: jangan dipakai untuk teks yang harus terbaca**, hanya untuk pemisah, placeholder, dan keadaan nonaktif.

Nilai final menyusul grand design. **Kunci namanya sekarang, ganti nilainya nanti** — dan saat mengganti, ulangi pengecekan kontras di atas.

### Varian gambar

Dibuat saat upload, lebar maksimum; rasio mengikuti sumber. Format WebP, kualitas 75.

| Varian | Lebar | Dipakai di |
|---|---|---|
| `thumbnail` | 320px | daftar admin, avatar guru |
| `card` | 800px | kartu berita, grid galeri, kartu ekstrakurikuler |
| `hero` | 1600px | hero beranda, sampul detail berita |

Sumber hero minimal 1920×1080. Situs publik tidak pernah meminta file asli.

## Konvensi komponen

- Section menerima data lewat props dan tidak pernah mengambil data sendiri. Pengambilan data terjadi di controller.
- Setiap section harus benar di 390px, 768px, dan 1280px.
- **Empty state selalu dirancang.** Konten masih berdatangan — kalau berita, galeri, guru, atau ekstrakurikuler kosong, tampilkan empty state Bahasa Indonesia yang hangat. Jangan pernah halaman kosong atau error.
- Grid guru menampilkan nama + jabatan/mata pelajaran saja. Foto opsional; kalau tidak ada, tampilkan inisial, bukan gambar rusak. Dirender dua kelompok terpisah mengikuti `guru.kategori`: pendidik dan tenaga kependidikan.
- **Bagan struktur organisasi** dirender dari tabel `struktur_organisasi`, bukan dari gambar. Di bawah 640px berubah jadi daftar bertingkat, **bukan bagan yang menyusut sampai tidak terbaca**. Simpul bertipe `penasihat` (Komite Sekolah) digambar di samping induknya, bukan di bawahnya.
- Fokus keyboard terlihat; `alt` wajib; hormati `prefers-reduced-motion`.

## Peran dan izin

Dua peran, dikelola `spatie/laravel-permission`. Definisinya di `app/Enums/Peran.php` dan `app/Enums/Izin.php`; disemai `database/seeders/PeranSeeder.php`.

| Peran | Untuk siapa | Boleh apa |
|---|---|---|
| `super-admin` | pemilik proyek | segalanya, termasuk mengelola akun pengguna |
| `admin` | staf sekolah (TU, guru) | seluruh konten situs; **tidak** boleh menyentuh akun pengguna |

`super-admin` sengaja **tidak** diberi daftar izin eksplisit. Ia melewati seluruh pemeriksaan lewat `Gate::before` di `AppServiceProvider`. Memberinya daftar izin justru menciptakan dua sumber kebenaran yang akan berbeda begitu ada izin baru ditambahkan.

Akun dibuat hanya lewat perintah interaktif — tidak ada kata sandi bawaan di seeder, karena apa pun yang punya kata sandi bawaan akan bocor cepat atau lambat:

```bash
php artisan pengguna:buat
```

Menghapus akun sendiri sengaja tidak disediakan: admin sekolah yang salah pencet bisa mengunci dirinya keluar, dan tidak ada tim IT yang siaga memulihkannya.

## Konvensi admin

- **Hak akses:** publik hanya membaca konten berstatus terbit. Semua tulis butuh sesi terautentikasi. Draft tidak pernah bocor ke publik — diuji lewat URL langsung, bukan hanya disembunyikan dari daftar. Tabel `users` tidak pernah dibaca publik.
- **Label Bahasa Indonesia** di setiap form, kolom tabel, dan pesan validasi, ditambah keterangan singkat di tempat yang bikin admin non-teknis ragu.
- **Kesederhanaan:** kolom daftar seperlunya, sembunyikan yang tidak pernah disentuh admin. Harus nyaman di laptop dan tetap berfungsi di browser ponsel.
- **Media:** satu tabel media, `alt` wajib, varian `thumbnail`/`card`/`hero` dibuat saat upload.
- **Editor:** HTML dari editor **selalu** lewat `mews/purifier` sebelum dirender.

## Environment

```
APP_URL                 satu-satunya sumber URL kanonik
DB_CONNECTION           sqlite (lokal) | mysql (produksi)
DB_*
FILESYSTEM_DISK=public
MAIL_*                  wajib — reset password tidak jalan tanpa SMTP
```

**Jangan pernah menulis keras nama domain di mana pun.** Situs lahir di alamat sementara dan pindah ke `.sch.id` belakangan; semua URL diturunkan dari `APP_URL`. Jaga `.env.example` tetap mutakhir. Jangan commit secret.

## Deploy

Aset dibangun di lokal (`npm run build`) dan `public/build` ikut di-commit. Di server:

```bash
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

**Hosting: BiznetGio NEO Web Hosting (cPanel), atas nama yayasan.** Alasannya di ADR-6 `PRD-SMA.md`.

`git clone` ke home directory **di luar** `public_html`, lalu arahkan document root domain ke `~/sma/public`. Ini yang mencegah `.env` dan `storage/` bisa diunduh publik — kesalahan paling umum sekaligus paling fatal saat menaruh Laravel di shared hosting. Jangan pernah meletakkan root Laravel di dalam `public_html`.

- `.env` diunggah manual lewat File Manager. Tidak pernah lewat git.
- Cron cPanel tiap menit: `php artisan schedule:run`
- SSL lewat AutoSSL cPanel
- SMTP memakai mailbox hosting itu sendiri

**Checklist sebelum membayar paket** — semua harus terverifikasi, bukan diasumsikan:

- [ ] PHP Selector menyediakan 8.2 atau lebih baru
- [ ] Ekstensi aktif: `gd`, `mbstring`, `zip`, `bcmath`, `pdo_mysql`, `fileinfo`, `openssl`, `xml`
- [ ] SSH atau cPanel Terminal tersedia (tanpa ini deploy Laravel menyiksa)
- [ ] Git tersedia
- [ ] Document root domain bisa diarahkan ke subfolder
- [ ] MySQL 8 dan phpMyAdmin
- [ ] Kuota disk cukup untuk galeri foto (minimal 10GB)

**Backup:** backup harian panel hosting **plus** `spatie/laravel-backup` ke penyimpanan luar. Backup di satu tempat bukan backup. Restore wajib diuji minimal sekali sebelum serah terima.

**Serah terima:** domain `.sch.id` didaftarkan **atas nama yayasan/sekolah, bukan pribadi**. `.sch.id` butuh dokumen (SK pendirian / surat permohonan kepala sekolah + KTP), jadi pakai registrar lokal terakreditasi PANDI. Domain dan hosting tidak harus satu vendor. Rotasi seluruh secret setelah serah terima, dan pastikan minimal dua orang di pihak sekolah bisa login.

## Definisi selesai

- [ ] `npm run build`, `php artisan test`, `./vendor/bin/pint`, `./vendor/bin/phpstan analyse`, dan `tsc --noEmit` semuanya lolos
- [ ] Aturan Token berlaku juga di TSX: tidak ada hex di `resources/js/` — warna dibaca dari variabel CSS
- [ ] `php artisan migrate:fresh --seed` jalan bersih di SQLite
- [ ] `grep -rniE '\b(nuptk|nik)\b' app/ resources/ database/` tidak mengembalikan apa pun
- [ ] Dicek di 390px dan 1280px; admin dicek di lebar laptop
- [ ] Tidak ada nilai hex atau kelas palet Tailwind di luar `resources/css/app.css`
- [ ] Tipe konten baru ada di migrasi, model, factory, **dan** seeder
- [ ] Setiap media punya `alt` terisi
- [ ] `.env.example` mencerminkan semua variabel yang dipakai
- [ ] `git ls-files | grep -iE '\.(docx?|xlsx?)$'` tidak mengembalikan apa pun
- [ ] `grep -rE '[0-9]{16}' docs/ database/` tidak mengembalikan apa pun — NUPTK panjangnya 16 digit, ini menangkap yang terbawa walau labelnya sudah dihapus
- [ ] Halaman yang naskahnya belum ada tidak muncul di navigasi maupun sitemap

> Batas kata `\b` pada perintah grep itu penting: tanpa itu, `nik` cocok dengan `teknik`, `klinik`, dan `unik` — yang pasti ada di situs sekolah Indonesia, sehingga checklist mustahil hijau.

## Kalau buntu

Kerjakan dulu semua yang tidak bergantung pada jawaban, tulis asumsinya, lalu lanjut.

**Jangan pernah menebak isi konten sekolah** — nama guru, tahun berdiri, prestasi, alamat, nomor telepon.

Naskah yang sudah ada berikut status tiap bagiannya: `docs/KONTEN-SEKOLAH.md`. Bagian bertanda `⚠️ BELUM ADA NASKAH` memang belum diberikan sekolah. Untuk bagian itu, seeder diisi placeholder yang jelas ditandai (`[ISI: daftar prestasi siswa]`) dan halamannya disembunyikan dari navigasi — supaya mustahil lolos ke produksi tanpa ketahuan. Placeholder yang tersamar lebih berbahaya daripada halaman yang belum ada.

`docs/KONTEN-SEKOLAH.md` juga mencatat **dua konflik nama** yang belum terjawab (Wakil Kepala Sekolah dan Kepala TU). Jangan pilih salah satu sepihak — itu nama orang.

## Jangan

- Jangan membangun e-learning, presensi, ujian online, PPDB berbayar, atau login siswa (lihat Non-Goals di `PRD-SMA.md`).
- Jangan memodelkan atau merender NUPTK, NIK, atau identitas kependudukan apa pun.
- Jangan menerbitkan foto siswa sebelum ada izin tertulis.
- Jangan mendesain ulang tampilan yang diport dari pesantren — ganti nilai token saja.
- Jangan menulis keras nama domain di mana pun.
- Jangan menulis teks antarmuka atau label admin dalam Bahasa Inggris.
- Jangan mengubah skema lewat phpMyAdmin — selalu lewat migrasi.
- Jangan commit secret. Jaga `.env.example` tetap mutakhir.
