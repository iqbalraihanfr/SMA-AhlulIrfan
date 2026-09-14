<?php

namespace App\Services;

use App\Models\Berita;
use DOMDocument;
use DOMElement;
use DOMNode;
use DOMXPath;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Throwable;

class GambarIsiBerita
{
    /**
     * Membersihkan HTML editor dan mengikat setiap gambar ke media milik berita.
     * URL, dimensi, dan alt selalu ditulis ulang dari Media Library; nilai dari
     * klien tidak dipercaya. Media yang sudah dilepas dari isi ikut dibersihkan.
     */
    public function normalisasi(Berita $berita, string $html): string
    {
        $dokumen = new DOMDocument('1.0', 'UTF-8');
        $sebelumnya = libxml_use_internal_errors(true);

        $dokumen->loadHTML(
            '<?xml encoding="utf-8" ?><div id="isi-berita">'.clean($html).'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );

        libxml_clear_errors();
        libxml_use_internal_errors($sebelumnya);

        $xpath = new DOMXPath($dokumen);
        $mediaIsi = $berita->getMedia('isi')->keyBy('id');
        /** @var DOMElement $gambar */
        foreach (iterator_to_array($xpath->query('//img') ?: []) as $gambar) {
            $id = filter_var($gambar->getAttribute('data-media-id'), FILTER_VALIDATE_INT);
            $media = $id ? $mediaIsi->get($id) : null;

            if (! $media instanceof Media) {
                $this->hapusGambar($gambar);

                continue;
            }

            $gambar->setAttribute('data-media-id', (string) $media->id);
            $gambar->setAttribute('src', $media->getUrl('hero'));
            $gambar->setAttribute('alt', (string) $media->getCustomProperty('alt'));

            $ukuran = @getimagesize($media->getPath('hero'));
            if (is_array($ukuran)) {
                $gambar->setAttribute('width', (string) $ukuran[0]);
                $gambar->setAttribute('height', (string) $ukuran[1]);
            }
        }

        $wadah = $dokumen->getElementById('isi-berita');

        return $wadah instanceof DOMElement ? $this->htmlDalam($wadah) : '';
    }

    /**
     * Dipanggil hanya setelah berita dan sampul berhasil disimpan. Pemisahan
     * ini mencegah media lama terhapus bila update database/upload gagal di
     * tengah jalan, sementara HTML lama masih merujuk kepadanya.
     */
    public function selesaikanPenyimpanan(Berita $berita): void
    {
        $dipakai = $this->idMediaDalamHtml($berita->isi);

        $berita->getMedia('isi')->each(function (Media $media) use ($dipakai): void {
            try {
                if (in_array($media->id, $dipakai, true)) {
                    $media->setCustomProperty('status_editor', 'dipakai');
                    $media->save();

                    return;
                }

                // Upload tertunda mungkin sedang dipakai editor di tab lain.
                // Scheduler yang akan membersihkannya setelah masa aman lewat.
                if ($media->getCustomProperty('status_editor') !== 'tertunda') {
                    $media->delete();
                }
            } catch (Throwable $galat) {
                // Konten utama sudah tersimpan. Kegagalan housekeeping tidak
                // boleh membuat admin mengira pembaruan berita ikut gagal.
                report($galat);
            }
        });
    }

    /** Menghapus upload yang ditinggalkan tanpa pernah menyimpan editor. */
    public function bersihkanTertunda(?Carbon $sebelum = null): int
    {
        $batas = $sebelum ?? now()->subDay();
        $dihapus = 0;

        Media::query()
            ->where('model_type', (new Berita)->getMorphClass())
            ->where('collection_name', 'isi')
            ->where('created_at', '<', $batas)
            ->eachById(function (Media $media) use (&$dihapus): void {
                if ($media->getCustomProperty('status_editor') !== 'tertunda') {
                    return;
                }

                $berita = $media->model;

                // Memulihkan status bila update HTML berhasil tetapi proses
                // finalisasi sebelumnya terputus sebelum status media berubah.
                if ($berita instanceof Berita && in_array($media->id, $this->idMediaDalamHtml($berita->isi), true)) {
                    $media->setCustomProperty('status_editor', 'dipakai');
                    $media->save();

                    return;
                }

                $media->delete();
                $dihapus++;
            });

        return $dihapus;
    }

    private function hapusGambar(DOMElement $gambar): void
    {
        $wadah = $gambar->parentNode;

        if ($wadah instanceof DOMElement && $wadah->tagName === 'figure') {
            $wadah->parentNode?->removeChild($wadah);

            return;
        }

        $gambar->parentNode?->removeChild($gambar);
    }

    private function htmlDalam(DOMNode $wadah): string
    {
        $html = '';

        foreach ($wadah->childNodes as $anak) {
            $html .= $wadah->ownerDocument?->saveHTML($anak) ?: '';
        }

        return trim($html);
    }

    /** @return list<int> */
    private function idMediaDalamHtml(string $html): array
    {
        preg_match_all('/data-media-id="(\d+)"/', $html, $cocok);

        return array_values(array_unique(array_map('intval', $cocok[1])));
    }
}
