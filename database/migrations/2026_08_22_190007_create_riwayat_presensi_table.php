<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('riwayat_presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('presensi_id')->constrained('presensi')->restrictOnDelete();
            $table->foreignId('siswa_id')->nullable()->constrained('siswa')->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('aksi', 20);
            $table->string('status_sebelum', 20)->nullable();
            $table->string('status_sesudah', 20)->nullable();
            $table->string('catatan_sebelum', 255)->nullable();
            $table->string('catatan_sesudah', 255)->nullable();
            $table->string('alasan', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_presensi');
    }
};
