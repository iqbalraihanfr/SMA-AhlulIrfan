<?php

namespace App\Http\Controllers;

use App\Enums\KategoriGuru;
use App\Enums\TipeSimpul;
use App\Models\Berita;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use App\Models\KontenHalaman;
use App\Models\StrukturOrganisasi;
use Illuminate\View\View;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class HalamanController extends Controller
{
    public function beranda(): View
    {
        return view('pages.beranda', [
            'sambutan' => KontenHalaman::terbit('sambutan_kepsek'),
            'kurikulum' => KontenHalaman::terbit('kurikulum'),
            'ekstrakurikuler' => Ekstrakurikuler::urut()->take(7)->get(),
            'pendidik' => Guru::aktif()->where('kategori', KategoriGuru::Pendidik)->urut()->take(8)->get(),
            'beritaTerbaru' => Berita::terbit()->take(3)->get(),
        ]);
    }

    public function profil(): View
    {
        return view('pages.profil', [
            'sejarah' => KontenHalaman::terbit('sejarah'),
            'visiMisi' => KontenHalaman::terbit('visi_misi'),
            'sambutan' => KontenHalaman::terbit('sambutan_kepsek'),
        ]);
    }

    public function struktur(): View
    {
        $akar = StrukturOrganisasi::with(['guru', 'bawahan.guru', 'bawahan.bawahan.guru', 'bawahan.bawahan.bawahan.guru'])
            ->whereNull('atasan_id')
            ->first();

        abort_if(! $akar, 404);

        return view('pages.struktur', [
            'akar' => $akar,
            'penasihat' => $akar->bawahan->firstWhere('tipe', TipeSimpul::Penasihat),
        ]);
    }

    public function kurikulum(): View
    {
        return view('pages.prosa', ['halaman' => $this->wajibTerbit('kurikulum')]);
    }

    public function guru(): View
    {
        return view('pages.guru', [
            'pendidik' => Guru::aktif()->where('kategori', KategoriGuru::Pendidik)->urut()->get(),
            'tendik' => Guru::aktif()->where('kategori', KategoriGuru::TenagaKependidikan)->urut()->get(),
        ]);
    }

    public function ekstrakurikuler(): View
    {
        return view('pages.ekstrakurikuler', [
            'daftar' => Ekstrakurikuler::urut()->get(),
        ]);
    }

    public function eLearning(): View
    {
        return view('pages.prosa', ['halaman' => $this->wajibTerbit('e_learning')]);
    }

    public function prestasi(): View
    {
        return view('pages.prosa', ['halaman' => $this->wajibTerbit('prestasi')]);
    }

    public function tataTertib(): View
    {
        return view('pages.prosa', ['halaman' => $this->wajibTerbit('tata_tertib')]);
    }

    public function organisasiSiswa(): View
    {
        return view('pages.prosa', ['halaman' => $this->wajibTerbit('organisasi_siswa')]);
    }

    /**
     * Halaman yang naskahnya belum datang dari sekolah memberi 404, bukan
     * halaman kosong. Navbar juga tidak menampilkan tautannya, jadi pengunjung
     * tidak akan sampai ke sini lewat jalur normal.
     */
    private function wajibTerbit(string $kunci): KontenHalaman
    {
        return KontenHalaman::terbit($kunci)
            ?? throw new NotFoundHttpException("Halaman [{$kunci}] belum memiliki naskah.");
    }
}
