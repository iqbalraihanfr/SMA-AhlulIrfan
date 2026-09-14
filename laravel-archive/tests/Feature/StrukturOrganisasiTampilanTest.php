<?php

namespace Tests\Feature;

use Database\Seeders\KontenSekolahSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StrukturOrganisasiTampilanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(KontenSekolahSeeder::class);
    }

    /**
     * Garis bagan bergantung pada kait semantik ini, bukan pada urutan kelas
     * utilitas. Dengan begitu tampilan desktop dan daftar bertingkat seluler
     * bisa memakai markup yang sama tanpa JavaScript.
     */
    public function test_bagan_memiliki_kait_semantik_untuk_setiap_jenis_konektor(): void
    {
        $this->get(route('struktur'))
            ->assertOk()
            ->assertSee('data-bagan-organisasi', false)
            ->assertSee('struktur-simpul', false)
            ->assertSee('struktur-baris', false)
            ->assertSee('struktur-penasihat', false);
    }
}
