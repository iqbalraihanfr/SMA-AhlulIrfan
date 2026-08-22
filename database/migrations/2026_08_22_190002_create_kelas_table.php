<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->restrictOnDelete();
            $table->string('nama', 50);
            $table->unsignedTinyInteger('tingkat');
            $table->foreignId('wali_kelas_id')->nullable()->constrained('guru')->restrictOnDelete();
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            $table->unique(['tahun_ajaran_id', 'nama']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
