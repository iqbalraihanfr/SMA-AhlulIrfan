<?php

namespace App\Models;

use App\Enums\StatusKehadiran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Jejak append-only untuk perubahan presensi. Tabel ini tidak memiliki updated_at.
 *
 * @property int $id
 * @property int $presensi_id
 * @property int|null $siswa_id
 * @property int $user_id
 * @property string $aksi
 * @property StatusKehadiran|null $status_sebelum
 * @property StatusKehadiran|null $status_sesudah
 * @property string|null $catatan_sebelum
 * @property string|null $catatan_sesudah
 * @property string|null $alasan
 * @property Carbon $created_at
 * @property-read Presensi $presensi
 * @property-read Siswa|null $siswa
 * @property-read User $user
 */
class RiwayatPresensi extends Model
{
    use HasFactory;

    protected $table = 'riwayat_presensi';

    public $timestamps = false;

    protected $fillable = [
        'presensi_id', 'siswa_id', 'user_id', 'aksi', 'status_sebelum', 'status_sesudah',
        'catatan_sebelum', 'catatan_sesudah', 'alasan',
    ];

    protected function casts(): array
    {
        return [
            'status_sebelum' => StatusKehadiran::class,
            'status_sesudah' => StatusKehadiran::class,
        ];
    }

    public function presensi(): BelongsTo
    {
        return $this->belongsTo(Presensi::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
