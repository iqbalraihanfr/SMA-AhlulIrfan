<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\View\View;

class BeritaController extends Controller
{
    public function index(): View
    {
        return view('pages.berita.index', [
            'daftar' => Berita::terbit()->paginate(9),
        ]);
    }

    public function show(Berita $berita): View
    {
        // Draft dan berita berjadwal masa depan tidak boleh bocor lewat URL
        // langsung, bukan hanya tersembunyi dari daftar.
        abort_unless(
            Berita::terbit()->whereKey($berita->getKey())->exists(),
            404
        );

        return view('pages.berita.show', [
            'berita' => $berita,
            'lainnya' => Berita::terbit()->whereKeyNot($berita->getKey())->take(3)->get(),
        ]);
    }
}
