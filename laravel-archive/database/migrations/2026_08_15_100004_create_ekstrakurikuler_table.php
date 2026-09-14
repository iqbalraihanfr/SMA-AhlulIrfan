<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();

            // Naskah pembina dan jadwal BELUM diberikan sekolah — nullable
            // dengan sengaja supaya tidak menjadi penghambat rilis.
            // Tampilkan hanya bila terisi. Lihat docs/KONTEN-SEKOLAH.md.
            $table->string('pembina')->nullable();
            $table->string('jadwal')->nullable();

            $table->unsignedSmallInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ekstrakurikuler');
    }
};
