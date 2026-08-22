<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Data siswa minimum untuk absensi. Tidak menyimpan identitas kependudukan.
 *
 * @property int $id
 * @property string $kode_siswa
 * @property string $nama
 * @property string|null $jenis_kelamin
 * @property bool $aktif
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Collection<int, AnggotaKelas> $anggotaKelas
 * @property-read Collection<int, KehadiranSiswa> $kehadiran
 */
class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswa';

    protected $fillable = ['kode_siswa', 'nama', 'jenis_kelamin', 'aktif'];

    protected function casts(): array
    {
        return ['aktif' => 'boolean'];
    }

    public function anggotaKelas(): HasMany
    {
        return $this->hasMany(AnggotaKelas::class);
    }

    public function kehadiran(): HasMany
    {
        return $this->hasMany(KehadiranSiswa::class);
    }

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}
