<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * Halaman /kontak TIDAK PERNAH disembunyikan meski datanya belum lengkap —
 * situs sekolah tanpa cara menghubungi sekolah gagal memenuhi tujuannya.
 * Bagian yang kosong ditandai jelas agar ketiadaannya terlihat, bukan disamarkan.
 * Lihat PRD-SMA.md Bagian 7.
 */
class KontakController extends Controller
{
    public function index(): View
    {
        return view('pages.kontak');
    }
}
