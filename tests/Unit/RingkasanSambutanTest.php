<?php

namespace Tests\Unit;

use App\Support\RingkasanSambutan;
use PHPUnit\Framework\TestCase;

class RingkasanSambutanTest extends TestCase
{
    public function test_pembuka_dipisahkan_dari_ringkasan_isi(): void
    {
        $hasil = RingkasanSambutan::dariHtml(<<<'HTML'
<p class="arab">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
<p>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
<p>Alhamdulillah, selamat datang.</p>
<p>Semoga situs ini bermanfaat.</p>
HTML);

        $this->assertSame('بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ', $hasil->arab);
        $this->assertSame("Assalamu'alaikum Warahmatullahi Wabarakatuh", $hasil->salam);
        $this->assertSame('Alhamdulillah, selamat datang. Semoga situs ini bermanfaat.', $hasil->isi);
    }

    public function test_teks_tanpa_paragraf_tetap_dapat_diringkas(): void
    {
        $hasil = RingkasanSambutan::dariHtml('<strong>Salam</strong><br>untuk semua', 100);

        $this->assertNull($hasil->arab);
        $this->assertNull($hasil->salam);
        $this->assertSame('Salam untuk semua', $hasil->isi);
    }
}
