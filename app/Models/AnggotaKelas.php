<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $kelas_id
 * @property int $siswa_id
 * @property Carbon $mulai_pada
 * @property Carbon|null $selesai_pada
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Kelas $kelas
 * @property-read Siswa $siswa
 */
class AnggotaKelas extends Model
{
    use HasFactory;

    protected $table = 'anggota_kelas';

    protected $fillable = ['kelas_id', 'siswa_id', 'mulai_pada', 'selesai_pada'];

    protected function casts(): array
    {
        return [
            'mulai_pada' => 'date',
            'selesai_pada' => 'date',
        ];
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function scopeAktifPada(Builder $query, CarbonInterface $tanggal): Builder
    {
        return $query
            ->whereDate('mulai_pada', '<=', $tanggal)
            ->where(fn (Builder $q) => $q
                ->whereNull('selesai_pada')
                ->orWhereDate('selesai_pada', '>=', $tanggal));
    }
}
