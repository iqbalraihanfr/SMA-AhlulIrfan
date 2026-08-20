# Tempat menaruh bahan dari sekolah

Taruh semua bahan mentah di folder ini. **Isinya tidak ikut git** — jadi aman untuk berkas besar dan foto yang izinnya belum jelas. Hanya berkas README ini yang ikut.

Setelah bahan masuk, sebutkan saja "bahannya sudah di `naskah/`", nanti dipindahkan ke tempat yang benar.

---

## Yang memblokir peluncuran

Tiga hal ini menentukan situs bisa rilis atau tidak.

### 1. Kontak sekolah — paling mendesak

Tidak perlu berkas. **Ketik langsung** di panel admin → **Pengaturan Situs**:

- [ ] Alamat lengkap sampai nama jalan dan nomor. Yang ada sekarang baru `Desa Langkap, Kecamatan Bangsalsari` — itu belum cukup untuk orang tua yang mau berkunjung
- [ ] Nomor telepon sekolah
- [ ] Nomor WhatsApp (boleh diawali `0` atau `62`, sistem menyesuaikan)
- [ ] Email resmi sekolah
- [ ] Titik peta — buka Google Maps, klik kanan lokasi sekolah, salin dua angka yang muncul
- [ ] NPSN
- [ ] Status dan tahun akreditasi

Halaman Kontak tidak boleh disembunyikan maupun terbit setengah isi. Situs sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya.

### 2. Naskah dua halaman

Di `WEBSITE.docx`, keduanya cuma judul kosong. Kirim sebagai `.docx`, `.txt`, foto ketikan, atau tulis di chat — apa pun bentuknya.

- [ ] **Prestasi Siswa** — daftar prestasi: nama lomba, tingkat, tahun, nama siswa (kalau boleh disebut), juara ke berapa
- [ ] **Tata Tertib Sekolah** — naskah tata tertib yang berlaku

Selama kosong, kedua halaman otomatis tersembunyi dari navigasi. Begitu naskahnya ditempel di panel admin → **Halaman**, tautannya muncul sendiri.

### 3. Konfirmasi dua nama yang bentrok

Bagan organisasi dan tabel Data Guru di `WEBSITE.docx` **tidak cocok**. Ini nama orang, jadi tidak boleh ditebak.

| Jabatan | Versi tabel | Versi bagan | Dipakai sementara |
|---|---|---|---|
| Wakil Kepala Sekolah | **Nur** Rochman Hidayat, S.Pd. | **Fathur** Rochman Hidayat, S.Pd. | versi tabel |
| Kepala TU | Rofi**y**atun | Rofiatun | versi tabel |

- [ ] Tanyakan ke sekolah, mana yang benar

---

## Yang menentukan situs terlihat bagus atau polos

Boleh menyusul setelah rilis, tapi **inilah yang paling menentukan** apakah situs terasa hidup. Desain sebagus apa pun akan terasa kosong tanpa foto.

### Logo

- [x] Logo diterima 20 Agustus 2026 dan dipasang oleh `MediaSekolahSeeder`

Versi WebP 512×512 yang sudah dibersihkan dari metadata disimpan sebagai aset
seeder. Berkas asli tetap berada di `naskah/foto-original/` dan tidak ikut Git.

### Foto

Taruh di folder ini, boleh langsung dari HP tanpa dikecilkan — sistem mengompres sendiri saat diunggah.

- [ ] **Foto gedung sekolah**, 2–3 buah, orientasi mendatar (landscape), minimal 1600px sisi panjang. Ini untuk hero beranda — foto paling menentukan kesan pertama
- [ ] **Foto kegiatan**, 10–20 buah: upacara, pembelajaran, ekstrakurikuler, kegiatan keagamaan
- [ ] **Foto tiap ekstrakurikuler** — Pramuka, Paskibra, Hadrah, Futsal, Voli, Tata Boga, Tata Rias
- [ ] **Foto guru**, potret menghadap depan. Empat belas foto bernama sudah
  dipasang; Hilmi Fathiyatul Baroroh dan Anis Novi Rahayu masih memakai
  inisial. `GEMA2770.JPG` tidak memiliki nama dan tidak boleh dipetakan
  berdasarkan tebakan wajah.

**Izin foto siswa.** Foto yang memuat wajah siswa tidak diterbitkan sebelum ada izin tertulis. Kalau belum ada, kirim foto kegiatan yang tidak menampilkan wajah dari dekat — foto punggung, kegiatan dari jauh, atau tangan yang sedang bekerja. Ini bukan formalitas; menerbitkan foto anak tanpa izin tidak bisa diperbaiki setelah tersebar.

### Berita pertama

- [ ] Minimal satu berita agar halaman Berita tidak kosong saat peluncuran

Kegiatan terbaru apa saja: peringatan hari besar, lomba, kunjungan, pengumuman. Satu foto + tiga paragraf sudah cukup.

---

## Untuk domain `.sch.id`

Didaftarkan **atas nama yayasan atau sekolah, bukan nama pribadi**. Memindahkan kepemilikan `.sch.id` belakangan jauh lebih repot daripada mendaftarkannya benar sejak awal.

- [ ] Scan SK pendirian sekolah — nomor `421/1334/463.41.6/2003`
- [ ] Surat permohonan dari kepala sekolah
- [ ] Scan KTP penanggung jawab
- [ ] Nama domain yang diinginkan, siapkan 2–3 pilihan cadangan

---

## Ke mana bahan ini akhirnya pergi

| Bahan | Tujuan akhir | Ikut git? |
|---|---|---|
| Data kontak | Panel admin → Pengaturan Situs | tidak (di database) |
| Naskah halaman | Panel admin → Halaman | tidak (di database) |
| Logo bawaan sekolah | `database/seeders/assets/` lalu dipasang medialibrary | ya (versi WebP) |
| Foto kegiatan & guru | Diunggah lewat panel admin | tidak (di storage) |
| Scan dokumen legal | Tetap di folder ini saja | tidak |

Berkas `.docx`, `.xlsx`, dan seluruh isi folder ini diblokir `.gitignore`. `WEBSITE.docx` memuat NUPTK 13 orang — sekali masuk riwayat git, praktis tidak bisa ditarik lagi.
