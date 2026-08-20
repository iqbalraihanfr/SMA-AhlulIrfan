<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\PengaturanSitus;
use Illuminate\Database\Seeder;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Memasang aset resmi yang sudah disetujui ke Medialibrary.
 *
 * Berkas di `database/seeders/assets` sudah diperkecil dan dibersihkan dari
 * metadata kamera. Seeder tidak menimpa media yang kelak diunggah admin.
 */
class MediaSekolahSeeder extends Seeder
{
    private const SUMBER_ASET = 'seeder-sekolah';

    private const VERSI_ASET = '2026-08-20.2';

    /** @var array<string, string> */
    private const FOTO_GURU = [
        'Fathur Rohman, S.P' => 'fathur-rohman.webp',
        'Nur Rochman Hidayat, S.Pd.' => 'nur-rochman-hidayat.webp',
        'Yeni Sri Astutik, S.Pd., Gr' => 'yeni-sri-astutik.webp',
        'Noviani, S.Pd., Gr' => 'noviani.webp',
        'Ahmad Saini, S.Pd., Gr' => 'ahmad-saini.webp',
        'Sofiatul Lailiyah, S.Pd., Gr' => 'sofiatul-lailiyah.webp',
        'Wiwindari Uswatul J, S.Pd., Gr' => 'wiwindari-uswatul-j.webp',
        'Nuruz Zakiya, M.Pd.' => 'nuruz-zakiya.webp',
        'Siti Habibah, S.Pd.' => 'siti-habibah.webp',
        'Firda Nurul Azizah, S.Ag' => 'firda-nurul-azizah.webp',
        'Ika Nur Hasanah, S.Pd.' => 'ika-nur-hasanah.webp',
        'Rofiyatun' => 'rofiyatun.webp',
        'Anik Purwanti' => 'anik-purwanti.webp',
        'Muflihatul Jannah' => 'muflihatul-jannah.webp',
    ];

    public function run(): void
    {
        $this->pasangLogo();
        $this->pasangFotoGuru();
    }

    private function pasangLogo(): void
    {
        $situs = PengaturanSitus::ambil();
        $berkas = database_path('seeders/assets/logo-sma.webp');
        $alt = 'Logo '.$situs->nama_sekolah;
        $logo = $situs->getFirstMedia('logo');

        if (! is_file($berkas) || ($logo instanceof Media && ! $this->dikelolaSeeder($logo, 'logo-sma.webp', $alt))) {
            return;
        }

        if ($logo?->getCustomProperty('versi_aset') === self::VERSI_ASET) {
            return;
        }

        $logo?->delete();

        $situs->addMedia($berkas)
            ->preservingOriginal()
            ->usingFileName('logo-sma.webp')
            ->withCustomProperties($this->propertiMedia($alt))
            ->toMediaCollection('logo');
    }

    private function pasangFotoGuru(): void
    {
        $guru = Guru::query()
            ->with('media')
            ->whereIn('nama', array_keys(self::FOTO_GURU))
            ->get()
            ->keyBy('nama');

        foreach (self::FOTO_GURU as $nama => $namaBerkas) {
            $orang = $guru->get($nama);
            $berkas = database_path('seeders/assets/guru/'.$namaBerkas);
            $alt = 'Foto '.$nama;

            if (! $orang instanceof Guru || ! is_file($berkas)) {
                continue;
            }

            $foto = $orang->getFirstMedia('foto');

            if ($foto instanceof Media && ! $this->dikelolaSeeder($foto, $namaBerkas, $alt)) {
                continue;
            }

            if ($foto?->getCustomProperty('versi_aset') === self::VERSI_ASET) {
                continue;
            }

            $foto?->delete();

            $orang->addMedia($berkas)
                ->preservingOriginal()
                ->usingFileName($namaBerkas)
                ->withCustomProperties($this->propertiMedia($alt))
                ->toMediaCollection('foto');
        }
    }

    /**
     * Media berpenanda seeder aman diperbarui. Kondisi kedua mengenali media
     * bawaan dari versi lama sebelum properti `sumber` diperkenalkan.
     */
    private function dikelolaSeeder(Media $media, string $namaBerkas, string $alt): bool
    {
        return $media->getCustomProperty('sumber') === self::SUMBER_ASET
            || ($media->file_name === $namaBerkas && $media->getCustomProperty('alt') === $alt);
    }

    /** @return array{alt: string, sumber: string, versi_aset: string} */
    private function propertiMedia(string $alt): array
    {
        return [
            'alt' => $alt,
            'sumber' => self::SUMBER_ASET,
            'versi_aset' => self::VERSI_ASET,
        ];
    }
}
