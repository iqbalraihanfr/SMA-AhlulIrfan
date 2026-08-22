<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $tahun_ajaran_id
 * @property string $nama
 * @property int $tingkat
 * @property int|null $wali_kelas_id
 * @property bool $aktif
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read TahunAjaran $tahunAjaran
 * @property-read Guru|null $waliKelas
 * @property-read Collection<int, AnggotaKelas> $anggotaKelas
 * @property-read Collection<int, Presensi> $presensi
 */
class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    protected $fillable = ['tahun_ajaran_id', 'nama', 'tingkat', 'wali_kelas_id', 'aktif'];

    protected function casts(): array
    {
        return ['aktif' => 'boolean'];
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }

    public function waliKelas(): BelongsTo
    {
        return $this->belongsTo(Guru::class, 'wali_kelas_id');
    }

    public function anggotaKelas(): HasMany
    {
        return $this->hasMany(AnggotaKelas::class);
    }

    public function presensi(): HasMany
    {
        return $this->hasMany(Presensi::class);
    }

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}
