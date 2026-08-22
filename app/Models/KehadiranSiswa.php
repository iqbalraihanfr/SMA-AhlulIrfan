<?php

namespace App\Models;

use App\Enums\StatusKehadiran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $presensi_id
 * @property int $siswa_id
 * @property StatusKehadiran $status
 * @property string|null $catatan
 * @property int $diubah_oleh
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read Presensi $presensi
 * @property-read Siswa $siswa
 * @property-read User $pengubah
 */
class KehadiranSiswa extends Model
{
    use HasFactory;

    protected $table = 'kehadiran_siswa';

    protected $fillable = ['presensi_id', 'siswa_id', 'status', 'catatan', 'diubah_oleh'];

    protected function casts(): array
    {
        return ['status' => StatusKehadiran::class];
    }

    public function presensi(): BelongsTo
    {
        return $this->belongsTo(Presensi::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function pengubah(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diubah_oleh');
    }
}
