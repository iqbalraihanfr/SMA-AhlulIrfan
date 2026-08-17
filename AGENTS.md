# AGENTS.md — SMA Ahlul Irfan Bangsalsari

Situs profil SMA Islam di bawah Yayasan Ahlul Irfan Al-Kholily, Jember. Laravel 13 + Blade (publik) + Inertia/React (admin).

**Baca berurutan sebelum menyentuh kode:**

| Berkas | Isi |
|---|---|
| `HANDOFF.md` | Keadaan sekarang, jebakan yang sudah pernah menggigit, dan apa yang harus dikerjakan berikutnya. **Mulai dari sini.** |
| `AGENTS-SMA.md` | Aturan kerja lengkap: token, komponen, privasi, deploy |
| `PRD-SMA.md` | Lingkup pekerjaan + 14 ADR (keputusan yang sudah diambil, jangan diulang perdebatannya) |
| `docs/KONTEN-SEKOLAH.md` | Naskah asli sekolah, dan bagian mana yang belum ada |
| `CHANGELOG.md` | Riwayat perubahan. **Wajib ditambah tiap selesai bekerja** |

---

## Enam aturan yang tidak boleh dilanggar

Kalau kamu hanya membaca satu bagian, baca yang ini.

**1. PHP wajib MAMP 8.4.1.** `php` bawaan PATH adalah 8.5.9 dan bukan target produksi.

```bash
alias pa='/Applications/MAMP/bin/php/php8.4.1/bin/php artisan'
```

**2. ATURAN TOKEN.** Tidak ada nilai hex, tidak ada kelas palet Tailwind (`bg-blue-500`), tidak ada nilai arbitrer (`bg-[#0d4a5c]`) di luar `resources/css/app.css`. Berlaku juga di `.tsx` — warna di JavaScript dibaca dari variabel CSS, bukan ditulis keras.

**3. ATURAN PRIVASI.** `NUPTK`, `NIK`, dan identitas kependudukan apa pun dilarang ada di migrasi, model, response, structured data, maupun HTML. **Ini bukan larangan teoretis:** `WEBSITE.docx` memuat NUPTK 13 orang dan diblokir `.gitignore`. Ambil konten dari `docs/KONTEN-SEKOLAH.md`, jangan pernah dari `.docx`, dan jangan pernah `git add -f` berkas naskah.

**4. DUA LAPIS RENDER, batasnya mutlak.**

| Lapisan | Teknologi |
|---|---|
| Situs publik | Blade + Alpine (~46KB) |
| Panel admin `/admin/*` | Inertia + React + TypeScript (~720KB) |
| Halaman auth | Blade (milik Breeze) |

**Jangan pernah memasang middleware `inertia` secara global.** Ia hanya di grup rute admin. Memasangnya di seluruh web menyuntikkan React ke halaman publik yang justru dirancang tanpa JavaScript, untuk orang tua berkuota terbatas.

**5. Bahasa Indonesia** untuk seluruh teks antarmuka, label admin, dan pesan validasi.

**6. Catat perubahanmu di `CHANGELOG.md`** sebelum menyatakan pekerjaan selesai. Aturannya ada di berkas itu.

---

## Gerbang mutu

Kelimanya harus bersih sebelum pekerjaan dianggap selesai:

```bash
pa test                            # 73 test
./vendor/bin/pint                  # format PHP
./vendor/bin/phpstan analyse       # larastan level 5, harus nol error
./node_modules/.bin/tsc --noEmit   # tipe TypeScript
./node_modules/.bin/vite build     # aset
```

Jangan menaikkan level phpstan, dan jangan menambah `ignoreErrors` di `phpstan.neon`. Kalau muncul error properti magic, perbaiki dengan menambah anotasi `@property` di model — itu sekaligus memperbaiki autocomplete editor.

---

## Repo

Remote: `https://github.com/iqbalraihanfr/SMA-AhlulIrfan.git`

`/Users/iqbalrei/Projects/KKN/PP_ahlulirfan` adalah **repo lain** (situs pesantren, `ahlul-irfan-al-kholily.git`). Boleh dibaca sebagai rujukan, **jangan pernah diubah atau di-push**.
