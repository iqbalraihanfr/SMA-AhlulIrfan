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
