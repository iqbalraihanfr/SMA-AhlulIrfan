<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->restrictOnDelete();
            $table->date('tanggal');
            $table->string('status', 10)->default('draf');
            $table->foreignId('dicatat_oleh')->constrained('users')->restrictOnDelete();
            $table->unsignedInteger('versi')->default(1);
            $table->timestamp('selesai_pada')->nullable();
            $table->timestamps();

            $table->unique(['kelas_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};
