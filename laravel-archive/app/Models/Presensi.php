<?php

namespace App\Models;

use App\Enums\StatusPresensi;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $kelas_id
 * @property Carbon $tanggal
 * @property StatusPresensi $status
 * @property int $dicatat_oleh
 * @property int $versi
 * @property Carbon|null $selesai_pada
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Kelas $kelas
 * @property-read User $pencatat
 * @property-read Collection<int, KehadiranSiswa> $kehadiranSiswa
 * @property-read Collection<int, RiwayatPresensi> $riwayat
 */
class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensi';

    protected $fillable = ['kelas_id', 'tanggal', 'status', 'dicatat_oleh', 'versi', 'selesai_pada'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'status' => StatusPresensi::class,
            'versi' => 'integer',
            'selesai_pada' => 'datetime',
        ];
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function pencatat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dicatat_oleh');
    }

    public function kehadiranSiswa(): HasMany
    {
        return $this->hasMany(KehadiranSiswa::class);
    }

    public function riwayat(): HasMany
    {
        return $this->hasMany(RiwayatPresensi::class);
    }
}
