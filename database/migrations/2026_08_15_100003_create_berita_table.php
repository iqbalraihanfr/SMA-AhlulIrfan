<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('ringkasan')->nullable();

            // HTML dari editor. WAJIB disanitasi mews/purifier sebelum dirender.
            $table->longText('isi');

            // 'draft' | 'terbit'. Draft tidak pernah bocor ke publik.
            $table->string('status')->default('draft');

            $table->timestamp('diterbitkan_pada')->nullable();
            $table->foreignId('penulis_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'diterbitkan_pada']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};
