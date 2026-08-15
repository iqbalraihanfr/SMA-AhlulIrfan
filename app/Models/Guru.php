<?php

namespace App\Models;

use App\Enums\KategoriGuru;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ATURAN PRIVASI: model ini tidak boleh punya atribut NUPTK, NIK, atau
 * identitas kependudukan apa pun. Lihat AGENTS-SMA.md.
 */
/**
 * @property int $id
 * @property string $nama
 * @property KategoriGuru $kategori
 * @property string|null $jenis_kelamin
 * @property string|null $jabatan
 * @property string|null $mata_pelajaran
 * @property int $urutan
 * @property bool $aktif
 */
class Guru extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'guru';

    protected $fillable = [
        'nama', 'kategori', 'jenis_kelamin', 'jabatan', 'mata_pelajaran', 'urutan', 'aktif',
    ];

    protected function casts(): array
    {
        return [
            'kategori' => KategoriGuru::class,
            'aktif' => 'boolean',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('foto')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')->nonQueued()->fit(Fit::Crop, 320, 320);
        $this->addMediaConversion('card')->nonQueued()->fit(Fit::Crop, 800, 800);
    }

    public function scopeAktif(Builder $q): Builder
    {
        return $q->where('aktif', true);
    }

    public function scopeUrut(Builder $q): Builder
    {
        return $q->orderBy('urutan')->orderBy('nama');
    }

    /** Dipakai sebagai pengganti foto yang tidak ada — inisial, bukan gambar rusak. */
    public function inisial(): string
    {
        return Str::of($this->nama)
            ->replaceMatches('/,.*$/', '')      // buang gelar setelah koma
            ->explode(' ')
            ->take(2)
            ->map(fn (string $kata) => Str::substr($kata, 0, 1))
            ->implode('');
    }

    /** Baris kedua pada kartu guru: jabatan, mata pelajaran, atau keduanya. */
    public function peran(): string
    {
        return collect([$this->jabatan, $this->mata_pelajaran ? 'Guru '.$this->mata_pelajaran : null])
            ->filter()
            ->implode(' · ');
    }
}
