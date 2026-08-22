<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kehadiran_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('presensi_id')->constrained('presensi')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->restrictOnDelete();
            $table->string('status', 20)->default('belum_diisi');
            $table->string('catatan', 255)->nullable();
            $table->foreignId('diubah_oleh')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->unique(['presensi_id', 'siswa_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kehadiran_siswa');
    }
};
