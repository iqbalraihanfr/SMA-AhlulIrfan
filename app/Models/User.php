<?php

namespace App\Models;

use App\Enums\Peran;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Spatie\Permission\Traits\HasRoles;

/**
 * Akun pengelola situs. TIDAK PERNAH dibaca publik.
 *
 * Peran (lihat RoleSeeder):
 *   super-admin — pemilik proyek. Melewati seluruh pemeriksaan izin.
 *   admin       — staf sekolah. Mengelola konten, tetapi tidak bisa
 *                 mengelola akun pengguna lain.
 *
 * Registrasi publik dimatikan; akun dibuat lewat `php artisan pengguna:buat`.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property int|null $guru_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Guru|null $guru
 */
#[Fillable(['name', 'email', 'password', 'guru_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(Peran::SuperAdmin->value);
    }
}
