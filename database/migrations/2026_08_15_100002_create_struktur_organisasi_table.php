<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Bagan struktur organisasi — lihat ADR-7 di PRD-SMA.md.
|
| Tabel ini terpisah dari `guru` dengan sengaja. Bagan sekolah memuat simpul
| yang BUKAN orang (Wali Kelas, Guru Mapel, Siswa-Siswi) dan satu orang di
| luar daftar pegawai (Komite Sekolah). Memaksakannya ke tabel `guru` berarti
| menyisipkan baris palsu ke daftar kepegawaian.
|
| Nama pegawai tetap punya satu sumber kebenaran: simpul bertipe 'orang'
| mengambil namanya lewat relasi ke `guru`, tidak menyalinnya.
*/
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('struktur_organisasi', function (Blueprint $table) {
            $table->id();

            // Nama jabatan yang tampil di kotak, mis. "Waka Kurikulum".
            $table->string('label');

            // Diisi hanya untuk tipe 'orang'. Nama diambil dari relasi ini.
            $table->foreignId('guru_id')->nullable()->constrained('guru')->nullOnDelete();

            // Induk dalam bagan. NULL hanya untuk simpul akar (Kepala Sekolah).
            $table->foreignId('atasan_id')->nullable()->constrained('struktur_organisasi')->cascadeOnDelete();

            // 'orang'     → kotak bernama, mengambil nama dari `guru`
            // 'kelompok'  → kotak tanpa nama (Wali Kelas, Guru Mapel, Siswa-Siswi)
            // 'penasihat' → digambar DI SAMPING induknya, bukan di bawah (Komite Sekolah)
            $table->string('tipe')->default('orang');

            // Nama untuk simpul yang bukan pegawai, mis. anggota Komite Sekolah.
            $table->string('nama_luar')->nullable();

            // Baris ke berapa di bawah induk yang sama.
            //
            // Bagan asli sekolah punya satu garis mendatar yang menggantung di
            // bawah KEEMPAT kotak Waka sekaligus (BK, Wali Kelas, Guru Mapel).
            // Pohon atasan_id biasa tidak bisa menyatakan induk jamak seperti
            // itu. Kolom ini menyelesaikannya: anak dari induk yang sama
            // dikelompokkan per `baris` lalu digambar sebagai baris terpisah.
            $table->unsignedTinyInteger('baris')->default(1);

            $table->unsignedSmallInteger('urutan')->default(0);
            $table->timestamps();

            $table->index(['atasan_id', 'baris', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('struktur_organisasi');
    }
};
