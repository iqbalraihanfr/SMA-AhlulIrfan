<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Halaman berbasis prosa, satu baris per bagian, diambil lewat `kunci`.
|
| Kunci yang dipakai: sejarah, visi_misi, sambutan_kepsek, kurikulum,
| prestasi, tata_tertib, organisasi_siswa, e_learning.
|
| Kolom `terbit` inilah yang menyembunyikan halaman dari navigasi selama
| naskahnya belum datang dari sekolah. Empat kunci terakhir saat ini masih
| kosong — lihat docs/KONTEN-SEKOLAH.md. Halaman setengah isi lebih merusak
| kepercayaan calon orang tua daripada halaman yang belum ada.
*/
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('konten_halaman', function (Blueprint $table) {
            $table->id();
            $table->string('kunci')->unique();
            $table->string('judul');

            // HTML dari editor. WAJIB lewat mews/purifier sebelum dirender.
            $table->longText('isi')->nullable();

            $table->boolean('terbit')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('konten_halaman');
    }
};
