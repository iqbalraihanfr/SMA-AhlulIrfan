<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anggota_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->restrictOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->restrictOnDelete();
            $table->date('mulai_pada');
            $table->date('selesai_pada')->nullable();
            $table->timestamps();

            $table->index(['kelas_id', 'mulai_pada', 'selesai_pada']);
            $table->index(['siswa_id', 'mulai_pada', 'selesai_pada']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_kelas');
    }
};
