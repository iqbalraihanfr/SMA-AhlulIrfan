<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Berita;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use App\Models\KontenHalaman;
use App\Models\PengaturanSitus;
use Inertia\Inertia;
use Inertia\Response;

class DasborController extends Controller
{
    public function __invoke(): Response
    {
        $situs = PengaturanSitus::ambil();

        // Daftar kesiapan: apa yang masih menghambat peluncuran, ditampilkan
        // terus-menerus supaya kekurangan naskah tidak terlupakan sampai hari H.
        $kesiapan = [
            [
                'label' => 'Alamat, telepon, dan WhatsApp sekolah',
                'siap' => filled($situs->alamat) && filled($situs->telepon) && filled($situs->whatsapp),
                'catatan' => 'Wajib. Situs tidak boleh diluncurkan tanpa ini.',
            ],
            [
                'label' => 'Naskah Prestasi Siswa',
                'siap' => KontenHalaman::where('kunci', 'prestasi')->value('terbit'),
                'catatan' => 'Belum ada di naskah sekolah.',
            ],
            [
                'label' => 'Naskah Tata Tertib Sekolah',
                'siap' => KontenHalaman::where('kunci', 'tata_tertib')->value('terbit'),
                'catatan' => 'Belum ada di naskah sekolah.',
            ],
            [
                'label' => 'Minimal satu berita terbit',
                'siap' => Berita::terbit()->exists(),
                'catatan' => 'Halaman Berita masih kosong.',
            ],
            [
                'label' => 'Logo sekolah',
                'siap' => filled($situs->getFirstMediaUrl('logo')),
                'catatan' => 'Sementara memakai inisial.',
            ],
        ];

        return Inertia::render('Dasbor', [
            'jumlah' => [
                'berita' => Berita::count(),
                'beritaTerbit' => Berita::terbit()->count(),
                'guru' => Guru::count(),
                'ekstrakurikuler' => Ekstrakurikuler::count(),
                'album' => Album::count(),
            ],
            'kesiapan' => $kesiapan,
        ]);
    }
}
