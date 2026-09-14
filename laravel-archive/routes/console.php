<?php

use App\Services\GambarIsiBerita;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(fn () => app(GambarIsiBerita::class)->bersihkanTertunda())
    ->name('berita:bersihkan-gambar-isi-tertunda')
    ->withoutOverlapping()
    ->daily();
