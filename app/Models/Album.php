<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Album extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'album';

    protected $fillable = ['judul', 'slug', 'deskripsi', 'urutan'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function registerMediaCollections(): void
    {
        // Banyak foto per album. Alt text disimpan di custom property 'alt'
        // dan WAJIB terisi — lihat Definisi Selesai di AGENTS-SMA.md.
        $this->addMediaCollection('foto');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')->fit(Fit::Crop, 320, 320)->nonQueued();
        $this->addMediaConversion('card')->fit(Fit::Crop, 800, 600)->nonQueued();
        $this->addMediaConversion('hero')->fit(Fit::Max, 1600, 1200)->nonQueued();
    }

    public function scopeUrut(Builder $q): Builder
    {
        return $q->orderBy('urutan')->orderByDesc('created_at');
    }
}
