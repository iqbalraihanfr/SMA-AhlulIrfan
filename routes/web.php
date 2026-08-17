<?php

use App\Http\Controllers\Admin\BeritaController as AdminBeritaController;
use App\Http\Controllers\Admin\DasborController;
use App\Http\Controllers\Admin\EkstrakurikulerController;
use App\Http\Controllers\Admin\GaleriController as AdminGaleriController;
use App\Http\Controllers\Admin\GuruController as AdminGuruController;
use App\Http\Controllers\Admin\HalamanController as AdminHalamanController;
use App\Http\Controllers\Admin\PengaturanSitusController;
use App\Http\Controllers\Admin\PenggunaController;
use App\Http\Controllers\Admin\StrukturController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\HalamanController;
use App\Http\Controllers\KontakController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeoController;
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

Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

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
| Panel admin — Inertia + React.
|
| Semua di balik middleware `auth`; kontrol lebih rinci memakai izin
| spatie/laravel-permission per area konten. Rute dasbor sengaja diberi nama
| `dashboard` karena controller bawaan Breeze mengarahkan ke nama itu setelah
| login dan setelah konfirmasi kata sandi.
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

        // Baris konten_halaman dibuat seeder dan terikat pada route publik
        // tertentu, jadi tidak ada create/store/destroy — menghapus baris
        // `kurikulum` akan mematikan /kurikulum tanpa cara memulihkannya.
        Route::resource('halaman', AdminHalamanController::class)->only(['index', 'edit', 'update']);

        Route::resource('guru', AdminGuruController::class)->except('show');
        Route::resource('struktur', StrukturController::class)->except('show');
        Route::resource('ekstrakurikuler', EkstrakurikulerController::class)->except('show');

        Route::resource('galeri', AdminGaleriController::class)->except('show');
        Route::post('galeri/{galeri}/foto', [AdminGaleriController::class, 'simpanFoto'])->name('galeri.foto.store');
        Route::delete('galeri/{galeri}/foto/{media}', [AdminGaleriController::class, 'hapusFoto'])->name('galeri.foto.destroy');

        Route::get('pengaturan', [PengaturanSitusController::class, 'edit'])->name('pengaturan.edit');
        Route::put('pengaturan', [PengaturanSitusController::class, 'update'])->name('pengaturan.update');

        Route::resource('pengguna', PenggunaController::class)->except('show');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__.'/auth.php';
