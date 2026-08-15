<?php

namespace App\Models;

use App\Enums\TipeSimpul;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class StrukturOrganisasi extends Model
{
    use HasFactory;

    protected $table = 'struktur_organisasi';

    protected $fillable = ['label', 'guru_id', 'atasan_id', 'tipe', 'nama_luar', 'baris', 'urutan'];

    protected function casts(): array
    {
        return ['tipe' => TipeSimpul::class];
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(Guru::class);
    }

    public function atasan(): BelongsTo
    {
        return $this->belongsTo(self::class, 'atasan_id');
    }

    public function bawahan(): HasMany
    {
        return $this->hasMany(self::class, 'atasan_id')->orderBy('baris')->orderBy('urutan');
    }

    /**
     * Anak yang digambar di bawah, dikelompokkan per baris.
     * Kunci koleksi = nomor baris, isinya simpul-simpul pada baris itu.
     */
    public function barisBawahan(): Collection
    {
        return $this->bawahan
            ->reject(fn (self $s) => $s->tipe === TipeSimpul::Penasihat)
            ->groupBy('baris');
    }

    /**
     * Nama yang tampil di kotak. Simpul 'orang' mengambilnya dari relasi `guru`
     * supaya nama pegawai tetap punya satu sumber kebenaran; simpul 'kelompok'
     * memang tidak punya nama.
     */
    public function namaTampil(): ?string
    {
        return $this->guru?->nama ?? $this->nama_luar;
    }

    /** Bawahan yang digambar di bawah, tidak termasuk penasihat di samping. */
    public function anakBawah(): iterable
    {
        return $this->bawahan->reject(fn (self $s) => $s->tipe === TipeSimpul::Penasihat);
    }

    /** Penasihat digambar di samping induknya. */
    public function anakSamping(): iterable
    {
        return $this->bawahan->filter(fn (self $s) => $s->tipe === TipeSimpul::Penasihat);
    }
}
