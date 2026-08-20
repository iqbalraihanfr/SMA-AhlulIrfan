<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| ATURAN PRIVASI — JANGAN TAMBAHKAN KOLOM IDENTITAS KEPENDUDUKAN APA PUN KE
| TABEL INI.
|
| Naskah sumber dari sekolah memuat data sensitif. Kolom semacam itu sengaja
| tidak dimodelkan, bukan lupa. Lihat Aturan Privasi di AGENTS-SMA.md dan ADR-8
| di PRD-SMA.md. Foto guru ditangani spatie/laravel-medialibrary, bukan kolom.
*/
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guru', function (Blueprint $table) {
            $table->id();
            $table->string('nama');

            // 'pendidik' | 'tenaga_kependidikan' — memisahkan dua kelompok
            // di halaman /guru. Dicasting ke enum PHP di model.
            $table->string('kategori')->default('pendidik');

            // 'L' | 'P'
            $table->string('jenis_kelamin', 1)->nullable();

            // Jabatan struktural, mis. "Waka Kurikulum". Kosong untuk guru
            // mata pelajaran tanpa jabatan tambahan.
            $table->string('jabatan')->nullable();

            $table->string('mata_pelajaran')->nullable();

            $table->unsignedSmallInteger('urutan')->default(0);
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            $table->index(['kategori', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guru');
    }
};
