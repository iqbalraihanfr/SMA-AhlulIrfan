<?php

namespace Database\Seeders;

use App\Models\Album;
use Illuminate\Database\Seeder;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Memasang dokumentasi kontekstual dari Yayasan Ahlul Irfan Al-Kholily.
 *
 * Album dan media dibuat secara idempoten. Metadata album, alt/urutan pada
 * versi aset aktif, serta media tambahan yang dikelola admin tidak ditimpa.
 * Media bawaan hanya diperbarui ketika versi aset seedernya berubah.
 */
class GaleriYayasanSeeder extends Seeder
{
    public const SUMBER_ASET = 'seeder-yayasan';

    public const VERSI_ASET = '2026-08-21.1';

    /**
     * @var array<int, array{
     *     judul: string,
     *     slug: string,
     *     deskripsi: string,
     *     urutan: int,
     *     foto: array<int, array{berkas: string, alt: string}>
     * }>
     */
    private const ALBUM = [
        [
            'judul' => 'Lingkungan dan Fasilitas Yayasan',
            'slug' => 'lingkungan-dan-fasilitas-yayasan',
            'deskripsi' => 'Sekilas lingkungan belajar dan fasilitas di bawah naungan Yayasan Ahlul Irfan Al-Kholily.',
            'urutan' => 10,
            'foto' => [
                [
                    'berkas' => 'gedung-yayasan.webp',
                    'alt' => 'Gedung dua lantai di lingkungan Yayasan Ahlul Irfan Al-Kholily',
                ],
                [
                    'berkas' => 'ruang-laboratorium.webp',
                    'alt' => 'Bagian depan ruang laboratorium di lingkungan yayasan',
                ],
                [
                    'berkas' => 'asrama-putra.webp',
                    'alt' => 'Bangunan Asrama Putra Darul Ulum Muis di lingkungan yayasan',
                ],
            ],
        ],
        [
            'judul' => 'Pembinaan Keagamaan di Lingkungan Yayasan',
            'slug' => 'pembinaan-keagamaan-di-lingkungan-yayasan',
            'deskripsi' => 'Dokumentasi kegiatan mengaji dan pendampingan keagamaan bagi santri putra dan putri di lingkungan yayasan.',
            'urutan' => 20,
            'foto' => [
                [
                    'berkas' => 'santri-putra-mengaji.webp',
                    'alt' => 'Santri putra membaca kitab bersama di lingkungan yayasan',
                ],
                [
                    'berkas' => 'suasana-mengaji-santri-putra.webp',
                    'alt' => 'Suasana mengaji bersama santri putra di lingkungan yayasan',
                ],
                [
                    'berkas' => 'pembinaan-santri-putra.webp',
                    'alt' => 'Pendamping membimbing kegiatan mengaji santri putra',
                ],
                [
                    'berkas' => 'mengaji-close-up.webp',
                    'alt' => 'Santri mengikuti pembacaan kitab dalam kegiatan mengaji',
                ],
                [
                    'berkas' => 'suasana-mengaji-santri-putri.webp',
                    'alt' => 'Santri putri membaca kitab bersama di musala yayasan',
                ],
                [
                    'berkas' => 'pembinaan-santri-putri.webp',
                    'alt' => 'Pendamping membimbing santri putri membaca kitab',
                ],
                [
                    'berkas' => 'santri-putri-bersama-pembimbing.webp',
                    'alt' => 'Santri putri belajar membaca kitab bersama pembimbing',
                ],
            ],
        ],
    ];

    public function run(): void
    {
        foreach (self::ALBUM as $dataAlbum) {
            $album = Album::firstOrCreate(
                ['slug' => $dataAlbum['slug']],
                [
                    'judul' => $dataAlbum['judul'],
                    'deskripsi' => $dataAlbum['deskripsi'],
                    'urutan' => $dataAlbum['urutan'],
                ],
            );

            $this->pasangFoto($album, $dataAlbum['foto']);
        }
    }

    /** @param array<int, array{berkas: string, alt: string}> $daftarFoto */
    private function pasangFoto(Album $album, array $daftarFoto): void
    {
        $namaBerkasAktif = collect($daftarFoto)->pluck('berkas');

        $album->getMedia('foto')
            ->filter(fn (Media $media): bool => $media->getCustomProperty('sumber') === self::SUMBER_ASET)
            ->reject(fn (Media $media): bool => $namaBerkasAktif->contains($media->file_name))
            ->each(fn (Media $media) => $media->delete());

        foreach ($daftarFoto as $foto) {
            $berkas = database_path('seeders/assets/galeri/'.$foto['berkas']);
            $media = $album->getMedia('foto')->firstWhere('file_name', $foto['berkas']);

            if (! is_file($berkas)) {
                continue;
            }

            // Nama berkas yang sama dari admin tetap dipertahankan.
            if ($media instanceof Media && $media->getCustomProperty('sumber') !== self::SUMBER_ASET) {
                continue;
            }

            // Pada versi aset yang sama, suntingan alt dan urutan oleh admin
            // dianggap sebagai sumber kebenaran dan tidak ditimpa seeder.
            if ($media instanceof Media
                && $media->getCustomProperty('versi_aset') === self::VERSI_ASET) {
                continue;
            }

            $urutan = $media?->order_column;
            $media?->delete();

            $penambah = $album->addMedia($berkas)
                ->preservingOriginal()
                ->usingFileName($foto['berkas'])
                ->withCustomProperties([
                    'alt' => $foto['alt'],
                    'sumber' => self::SUMBER_ASET,
                    'versi_aset' => self::VERSI_ASET,
                ]);

            if ($urutan !== null) {
                $penambah->setOrder($urutan);
            }

            $penambah->toMediaCollection('foto');
        }
    }
}
