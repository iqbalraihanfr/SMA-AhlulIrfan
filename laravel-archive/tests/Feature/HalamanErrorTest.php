<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class HalamanErrorTest extends TestCase
{
    public function test_halaman_404_menggunakan_pesan_bahasa_indonesia(): void
    {
        $this->get('/halaman-yang-tidak-ada')
            ->assertNotFound()
            ->assertSee('Halaman tidak ditemukan')
            ->assertSee('Kembali ke beranda')
            ->assertSee('lang="id"', false);
    }

    public function test_halaman_403_menggunakan_pesan_bahasa_indonesia(): void
    {
        Route::get('/_uji/403', fn () => abort(403));

        $this->get('/_uji/403')
            ->assertForbidden()
            ->assertSee('Akses tidak diizinkan')
            ->assertSee('Kembali ke beranda');
    }

    public function test_halaman_500_tetap_tampil_tanpa_layout_database(): void
    {
        Route::get('/_uji/500', fn () => abort(500));

        $this->get('/_uji/500')
            ->assertStatus(500)
            ->assertSee('Layanan sedang terganggu')
            ->assertSee('Coba lagi');
    }
}
