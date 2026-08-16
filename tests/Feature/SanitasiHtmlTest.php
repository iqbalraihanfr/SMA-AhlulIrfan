<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Daftar putih HTMLPurifier di config/purifier.php.
 *
 * Dua sisi yang sama pentingnya:
 *   - Yang HARUS lolos: struktur yang bisa dibuat admin lewat editor TipTap.
 *     Kalau tombol editor menghasilkan tag yang lalu dibuang purifier, editor
 *     berbohong kepada penggunanya — admin melihatnya bekerja, lalu hilang
 *     diam-diam di situs. Itu pernah terjadi dan diperbaiki.
 *   - Yang HARUS dibuang: skrip, gaya sembarangan, dan kelas liar.
 */
class SanitasiHtmlTest extends TestCase
{
    /**
     * Setiap tombol di EditorTeks.tsx harus menghasilkan HTML yang selamat.
     * Menambah tombol baru di editor tanpa menambahnya ke daftar putih akan
     * membuat test ini gagal — itu memang tujuannya.
     */
    public function test_struktur_dari_editor_tidak_dibuang(): void
    {
        $kasus = [
            '<h2>Judul</h2>',
            '<h3>Sub-judul</h3>',
            '<blockquote>Kutipan</blockquote>',
            '<ul><li>Butir</li></ul>',
            '<ol><li>Nomor</li></ol>',
            '<p><strong>Tebal</strong> dan <em>miring</em></p>',
            '<p><a href="https://contoh.test" title="Contoh">Tautan</a></p>',
        ];

        foreach ($kasus as $html) {
            $hasil = trim(clean($html));

            $tag = preg_match('/<(\w+)/', $html, $m) ? $m[1] : '';

            $this->assertStringContainsString(
                "<{$tag}",
                $hasil,
                "Tag <{$tag}> dibuang purifier padahal editor bisa membuatnya. ".
                'Tambahkan ke HTML.Allowed di config/purifier.php.'
            );
        }
    }

    /** Basmalah di Sambutan Kepala Sekolah bergantung pada kelas ini. */
    public function test_kelas_arab_dipertahankan(): void
    {
        $this->assertStringContainsString('class="arab"', clean('<p class="arab">بِسْمِ اللّٰهِ</p>'));
    }

    /** Gambar di dalam artikel harus bisa membawa keterangannya sendiri. */
    public function test_figure_dan_figcaption_dipertahankan(): void
    {
        $hasil = clean('<figure><img src="/a.jpg" alt="Foto kegiatan"><figcaption>Upacara bendera</figcaption></figure>');

        $this->assertStringContainsString('<figcaption>', $hasil);
        $this->assertStringContainsString('alt="Foto kegiatan"', $hasil);
    }

    /**
     * Menempel dari Word membawa warna dan font sembarangan. Membiarkannya
     * lolos berarti isi yang ditempel admin bisa melanggar Aturan Token.
     */
    public function test_gaya_inline_dibuang(): void
    {
        $hasil = clean('<p style="color:red;font-size:40px">Merah besar</p>');

        $this->assertStringNotContainsString('style', $hasil);
        $this->assertStringContainsString('Merah besar', $hasil);
    }

    /** Hanya kelas `arab` yang boleh; sisanya termasuk kelas Tailwind dibuang. */
    public function test_kelas_selain_arab_dibuang(): void
    {
        $hasil = clean('<p class="bg-red-500 text-9xl">Nakal</p>');

        $this->assertStringNotContainsString('bg-red-500', $hasil);
        $this->assertStringContainsString('Nakal', $hasil);
    }

    public function test_skrip_dan_penangan_kejadian_dibuang(): void
    {
        $berbahaya = [
            '<script>alert(1)</script>',
            '<p onclick="alert(1)">Klik</p>',
            '<a href="javascript:alert(1)">Tautan</a>',
            '<iframe src="https://jahat.test"></iframe>',
            '<img src=x onerror="alert(1)">',
        ];

        foreach ($berbahaya as $html) {
            $hasil = clean($html);

            $this->assertStringNotContainsString('alert(1)', $hasil, "Lolos: {$html}");
            $this->assertStringNotContainsString('<script', $hasil);
            $this->assertStringNotContainsString('onerror', $hasil);
            $this->assertStringNotContainsString('onclick', $hasil);
            $this->assertStringNotContainsString('<iframe', $hasil);
        }
    }
}
