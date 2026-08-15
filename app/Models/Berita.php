<?php

namespace App\Models;

use App\Enums\StatusBerita;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Berita extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'berita';

    protected $fillable = [
        'judul', 'slug', 'ringkasan', 'isi', 'status', 'diterbitkan_pada', 'penulis_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => StatusBerita::class,
            'diterbitkan_pada' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function penulis(): BelongsTo
    {
        return $this->belongsTo(User::class, 'penulis_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('sampul')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')->fit(Fit::Crop, 320, 200)->nonQueued();
        $this->addMediaConversion('card')->fit(Fit::Crop, 800, 500)->nonQueued();
        $this->addMediaConversion('hero')->fit(Fit::Max, 1600, 1000)->nonQueued();
    }

    /**
     * Hanya berita yang benar-benar boleh dilihat publik.
     * Draft tidak pernah bocor, dan tanggal terbit di masa depan belum tampil.
     */
    public function scopeTerbit(Builder $q): Builder
    {
        return $q->where('status', StatusBerita::Terbit)
            ->whereNotNull('diterbitkan_pada')
            ->where('diterbitkan_pada', '<=', now())
            ->orderByDesc('diterbitkan_pada');
    }
}
