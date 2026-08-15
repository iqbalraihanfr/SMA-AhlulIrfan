<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $nama
 * @property string $slug
 * @property string|null $deskripsi
 * @property string|null $pembina
 * @property string|null $jadwal
 * @property int $urutan
 */
class Ekstrakurikuler extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'ekstrakurikuler';

    protected $fillable = ['nama', 'slug', 'deskripsi', 'pembina', 'jadwal', 'urutan'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gambar')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('card')->nonQueued()->fit(Fit::Crop, 800, 500);
    }

    public function scopeUrut(Builder $q): Builder
    {
        return $q->orderBy('urutan')->orderBy('nama');
    }
}
