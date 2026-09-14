<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Support\Facades\Route;

/*
| Rute autentikasi — hasil scaffolding Laravel Breeze, sudah dipangkas.
|
| Registrasi publik SENGAJA DIHAPUS. Situs sekolah tidak menerima pendaftaran
| mandiri; akun admin hanya dibuat oleh super admin lewat `php artisan pengguna:buat`.
| Verifikasi email juga dihapus karena akun dibuat manual oleh orang yang
| sudah memverifikasi identitas penggunanya secara langsung.
|
| URL memakai Bahasa Indonesia; nama rute tetap bawaan Laravel agar fitur
| internal (reset password, middleware) tetap bekerja.
*/

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('lupa-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('lupa-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('konfirmasi-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('konfirmasi-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
