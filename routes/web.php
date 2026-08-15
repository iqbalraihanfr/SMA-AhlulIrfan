<?php

use App\Http\Controllers\Admin\BeritaController as AdminBeritaController;
use App\Http\Controllers\Admin\DasborController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\HalamanController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
| Rute publik. Pengelompokan mengikuti navigasi yang dipakai sekolah
| (lihat PRD-SMA.md Bagian 7).
|
| Halaman berbasis prosa dilayani HalamanController lewat `kunci`. Bila
| naskahnya belum ada (konten_halaman.terbit = false), controller memberi 404
| dan navbar tidak menampilkan tautannya — halaman setengah isi lebih merusak
| kepercayaan calon orang tua daripada halaman yang belum ada.
*/

Route::get('/', [HalamanController::class, 'beranda'])->name('beranda');

Route::get('/profil', [HalamanController::class, 'profil'])->name('profil');
Route::get('/profil/struktur-organisasi', [HalamanController::class, 'struktur'])->name('struktur');

Route::get('/kurikulum', [HalamanController::class, 'kurikulum'])->name('kurikulum');
Route::get('/guru', [HalamanController::class, 'guru'])->name('guru');
Route::get('/e-learning', [HalamanController::class, 'eLearning'])->name('e-learning');

Route::get('/ekstrakurikuler', [HalamanController::class, 'ekstrakurikuler'])->name('ekstrakurikuler');
Route::get('/prestasi', [HalamanController::class, 'prestasi'])->name('prestasi');
Route::get('/tata-tertib', [HalamanController::class, 'tataTertib'])->name('tata-tertib');
Route::get('/organisasi-siswa', [HalamanController::class, 'organisasiSiswa'])->name('organisasi-siswa');

Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{berita}', [BeritaController::class, 'show'])->name('berita.show');

Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri.index');
Route::get('/galeri/{album}', [GaleriController::class, 'show'])->name('galeri.show');

Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');

/*
| Panel admin. Semua di balik middleware `auth`; kontrol lebih rinci memakai
| izin spatie/laravel-permission per area konten.
|
| Rute dasbor sengaja diberi nama `dashboard` karena controller bawaan Breeze
| mengarahkan ke nama itu setelah login dan setelah konfirmasi kata sandi.
*/
/*
| Panel admin — Inertia + React.
|
| Middleware `inertia` SENGAJA hanya dipasang di sini, bukan global. Situs
| publik harus tetap Blade murni: memasang Inertia di seluruh web akan
| menyisipkan payload JSON dan aset React ke halaman yang justru dirancang
| tanpa JavaScript demi pengunjung berkuota terbatas.
|
| Halaman auth (login, reset password) juga tetap Blade — milik Breeze,
| cuma dua formulir, dan berada di luar "aplikasi" admin.
*/
Route::middleware(['auth', 'inertia'])->group(function () {
    Route::get('/admin', DasborController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('berita', AdminBeritaController::class)
            ->except('show')
            ->parameters(['berita' => 'berita']);
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/auth.php';
