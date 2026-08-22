<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Memisahkan pembuka sambutan dari ringkasan isi tanpa mengikat view pada
 * naskah seeder. Admin tetap dapat memperbarui teks melalui CMS.
 */
final readonly class RingkasanSambutan
{
    public function __construct(
        public ?string $arab,
        public ?string $salam,
        public string $isi,
    ) {}

    public static function dariHtml(?string $html, int $batas = 360): self
    {
        if (blank($html)) {
            return new self(null, null, '');
        }

        preg_match_all('/<p\b([^>]*)>(.*?)<\/p>/is', $html, $paragraf, PREG_SET_ORDER);

        if ($paragraf === []) {
            return new self(null, null, Str::limit(self::teks($html), $batas));
        }

        $arab = null;
        $salam = null;
        $isi = [];

        foreach ($paragraf as $bagian) {
            $atribut = $bagian[1];
            $teks = self::teks($bagian[2]);

            if ($teks === '') {
                continue;
            }

            if ($arab === null && str_contains(Str::lower($atribut), 'arab')) {
                $arab = $teks;

                continue;
            }

            $teksNormal = Str::lower(str_replace(['’', '‘'], "'", $teks));

            if ($salam === null && (Str::startsWith($teksNormal, "assalamu'alaikum") || Str::startsWith($teksNormal, 'assalamualaikum'))) {
                $salam = $teks;

                continue;
            }

            $isi[] = $teks;
        }

        return new self($arab, $salam, Str::limit(Str::squish(implode(' ', $isi)), $batas));
    }

    private static function teks(string $html): string
    {
        $tanpaTag = preg_replace('/<[^>]+>/', ' ', $html) ?? $html;

        return Str::squish(html_entity_decode($tanpaTag, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }
}
