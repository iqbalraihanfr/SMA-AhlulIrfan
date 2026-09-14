<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nama
 * @property string $semester
 * @property Carbon $mulai_pada
 * @property Carbon $selesai_pada
 * @property bool $aktif
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Collection<int, Kelas> $kelas
 */
class TahunAjaran extends Model
{
    use HasFactory;

    protected $table = 'tahun_ajaran';

    protected $fillable = ['nama', 'semester', 'mulai_pada', 'selesai_pada', 'aktif'];

    protected function casts(): array
    {
        return [
            'mulai_pada' => 'date',
            'selesai_pada' => 'date',
            'aktif' => 'boolean',
        ];
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}
