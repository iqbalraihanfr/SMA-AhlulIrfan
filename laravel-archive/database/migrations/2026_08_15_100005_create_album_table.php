<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
| Album galeri. Foto-fotonya TIDAK disimpan di tabel ini — setiap album
| memegang koleksi media lewat spatie/laravel-medialibrary (tabel `media`).
| Alt text wajib, disimpan pada custom property media.
*/
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('album', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->unsignedSmallInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('album');
    }
};
