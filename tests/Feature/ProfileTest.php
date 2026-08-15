<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_halaman_akun_dapat_ditampilkan(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/profile')->assertOk();
    }

    public function test_informasi_akun_dapat_diperbarui(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/profile', ['name' => 'Rofiyatun', 'email' => 'tu@example.test'])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Rofiyatun', $user->name);
        $this->assertSame('tu@example.test', $user->email);
    }

    public function test_tamu_tidak_bisa_membuka_halaman_akun(): void
    {
        $this->get('/profile')->assertRedirect('/login');
    }
}
