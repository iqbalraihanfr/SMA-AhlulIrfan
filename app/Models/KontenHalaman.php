<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * @property int $id
 * @property string $kunci
 * @property string $judul
 * @property string|null $isi
 * @property bool $terbit
 */
class KontenHalaman extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'konten_halaman';

    protected $fillable = ['kunci', 'judul', 'isi', 'terbit'];

    protected function casts(): array
    {
        return ['terbit' => 'boolean'];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gambar')->singleFile();
    }

    /**
     * Ambil satu bagian berdasarkan kunci. Mengembalikan null bila belum
     * terbit, sehingga halaman tanpa naskah otomatis hilang dari navigasi
     * alih-alih tampil kosong.
     */
    public static function terbit(string $kunci): ?self
    {
        return static::where('kunci', $kunci)->where('terbit', true)->first();
    }

    /** Daftar kunci yang sudah terbit — dipakai navbar untuk memutuskan tautan. */
    public static function kunciTerbit(): array
    {
        return static::where('terbit', true)->pluck('kunci')->all();
    }
}
