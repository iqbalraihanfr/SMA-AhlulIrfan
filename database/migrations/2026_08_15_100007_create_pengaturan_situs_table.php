<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Pengaturan situs — tabel baris tunggal, diedit admin lewat satu formulir.
|
| SEMUA kolom kontak masih kosong: alamat, telepon, WhatsApp, email, dan
| koordinat peta tidak ada di naskah sekolah. Ini satu-satunya kekurangan
| naskah yang MEMBLOKIR peluncuran — halaman /kontak tidak boleh disembunyikan
| maupun terbit kosong. Lihat PRD-SMA.md Bagian 7.
|
| Nama domain TIDAK disimpan di sini. URL kanonik selalu dari APP_URL.
*/
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturan_situs', function (Blueprint $table) {
            $table->id();

            $table->string('nama_sekolah')->default('SMA Ahlul Irfan Bangsalsari');
            $table->string('nama_yayasan')->nullable();
            $table->string('semboyan')->nullable();

            $table->text('alamat')->nullable();
            $table->string('telepon')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();

            $table->decimal('peta_lat', 10, 7)->nullable();
            $table->decimal('peta_lng', 10, 7)->nullable();

            $table->string('npsn')->nullable();
            $table->string('akreditasi')->nullable();

            $table->string('instagram')->nullable();
            $table->string('facebook')->nullable();
            $table->string('youtube')->nullable();

            // Ditandai true hanya setelah semua fakta wajib diverifikasi
            // pengurus. Dipakai checklist peluncuran sebagai gerbang produksi.
            $table->boolean('fakta_terverifikasi')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturan_situs');
    }
};
