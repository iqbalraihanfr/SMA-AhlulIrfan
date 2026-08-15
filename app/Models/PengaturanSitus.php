<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * Tabel baris tunggal. Selalu diakses lewat PengaturanSitus::ambil().
 *
 * Nama domain TIDAK disimpan di sini — URL kanonik selalu dari APP_URL.
 */
class PengaturanSitus extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'pengaturan_situs';

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'peta_lat' => 'float',
            'peta_lng' => 'float',
            'fakta_terverifikasi' => 'boolean',
        ];
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('logo')->singleFile();
        $this->addMediaCollection('hero')->singleFile();
    }

    public static function ambil(): self
    {
        return static::firstOrCreate([]);
    }

    /** Tautan WhatsApp siap pakai, atau null bila nomornya belum diisi. */
    public function tautanWhatsapp(?string $pesan = null): ?string
    {
        if (blank($this->whatsapp)) {
            return null;
        }

        $nomor = preg_replace('/\D/', '', $this->whatsapp);
        $nomor = str_starts_with($nomor, '0') ? '62'.substr($nomor, 1) : $nomor;

        return 'https://wa.me/'.$nomor.($pesan ? '?text='.rawurlencode($pesan) : '');
    }
}
