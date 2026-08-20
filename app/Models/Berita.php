<?php

namespace App\Models;

use App\Enums\StatusBerita;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * @property int $id
 * @property string $judul
 * @property string $slug
 * @property string|null $ringkasan
 * @property string $isi
 * @property StatusBerita $status
 * @property Carbon|null $diterbitkan_pada
 * @property int|null $penulis_id
 */
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
        $this->addMediaCollection('isi');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')->performOnCollections('sampul')->nonQueued()->format('webp')->quality(75)->fit(Fit::Crop, 320, 200);
        $this->addMediaConversion('card')->performOnCollections('sampul')->nonQueued()->format('webp')->quality(75)->fit(Fit::Crop, 800, 500);
        $this->addMediaConversion('hero')->performOnCollections('sampul', 'isi')->nonQueued()->format('webp')->quality(75)->fit(Fit::Max, 1600, 1000);
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
