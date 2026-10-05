# Production handoff

Admin: https://www.smaahlulirfan.sch.id/admin (login memakai email).
Akun sekolah aktif: `admin@smaahlulirfan.sch.id`.

Urutan penerapan, karena galeri dan rekap memakai perubahan database:

1. Terapkan migration `production_readiness` dan `restrict_helper_access` secara berurutan ke proyek sekolah `vsfmwdjpcjhgulntvhal`. Jangan jalankan seluruh `schema.sql` pada production; itu snapshot untuk instalasi baru.
2. Isi `SUPABASE_SERVICE_ROLE_KEY` secara privat untuk pembuatan/pengelolaan akun. Jangan memakai awalan `NEXT_PUBLIC_` untuk key ini. Cron juga membutuhkan `CRON_SECRET` di Vercel.
3. Buat akun sekolah: `node --env-file=.env.local create-school-admin.mjs admin@smaahlulirfan.sch.id`. Script memverifikasi login dan profil, menghasilkan password acak, dan tidak mereset akun lama. Jangan simpan output kredensial ke Git.
4. Dengan Node 24, jalankan `pnpm test`, `pnpm lint`, `pnpm build`, dan `pnpm check:db`. Pemeriksaan terakhir harus lulus terhadap database production sesudah migrasi.
5. Deploy ke Vercel, lalu uji login akun sekolah, terbitkan berita dengan foto, unggah beberapa foto dalam album, dan cek hasil di situs publik. Serahkan password setelah pengujian ini berhasil.

Panduan sekolah: di dasbor pilih **Tulis Berita**, isi judul dan konten, pilih **Terbit**, lalu simpan. Untuk foto kegiatan, pilih **Upload Foto**, isi judul album, pilih foto, lalu simpan.

Uji SQL tambahan: jalankan `tests/production.sql` dengan `psql` pada database PostgreSQL lokal kosong bernama `sma_production_test`. Script menolak database lain dan tidak memakai data sekolah.

Status 5 Oktober 2026: kedua migration sudah diterapkan; pemeriksaan akses anonim lulus; akun sekolah dibuat lewat Supabase Auth. Login, upload PNG, draf privat, publikasi berita dengan foto, dan album dua foto sudah diuji melalui production. Konten serta foto uji sudah dibersihkan. Endpoint bootstrap sementara sudah dinonaktifkan. Password tidak disimpan di repository.

Upload berita dan galeri sudah siap digunakan. Pengelolaan akun oleh Super Admin masih memerlukan `SUPABASE_SERVICE_ROLE_KEY` di environment server Vercel; fitur upload sekolah tidak memakai key ini. `CRON_SECRET` sudah terpasang.

Branding dan SEO: favicon multiresolusi, ikon 192 px, Apple touch icon 180 px, serta OG/Twitter 1200×630 memakai logo asli dari pengaturan sekolah. Gambar preview memakai URL dengan hash konten, metadata tiap halaman mempertahankan gambar dan nama situs. Canonical memakai domain `www`, sitemap hanya memuat halaman terbit, halaman admin/login tidak diindeks, dan preview deployment diberi `noindex`. Beranda memuat JSON-LD WebSite dan School; berita memuat NewsArticle.

Berita “tes” dan tiga berita contoh seed dijadikan draf; nomor telepon/WhatsApp placeholder dikosongkan. Seeder tidak lagi membuka policies RLS dan tidak menerbitkan berita contoh. Halaman Berita akan menampilkan pesan kosong sampai sekolah menerbitkan berita asli. Data profil dan foto sekolah tetap tersedia.

Pemeriksaan ulang: `node tests/check-seo.mjs` memeriksa seluruh URL sitemap production, metadata, aset, dan proteksi admin. Melalui Playwright CLI, jalankan `run-code --filename tests/check-news-layout.js` pada halaman berita untuk memeriksa ukuran 1440/768/390 px. Sesudah login akun QA, `run-code --filename tests/check-admin-feedback.js` menguji kegagalan hapus/logout yang disimulasikan, validasi ukuran foto, dan logout sesungguhnya tanpa menghapus data.

Google Search Console dan hasil indeks Google belum diverifikasi. Pengelola dapat mengisi kontak resmi melalui Pengaturan Situs dan menerbitkan draf hanya setelah isinya disahkan sekolah.
