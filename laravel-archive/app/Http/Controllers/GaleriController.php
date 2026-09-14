<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\View\View;

class GaleriController extends Controller
{
    public function index(): View
    {
        return view('pages.galeri.index', [
            'album' => Album::urut()->with('media')->get(),
        ]);
    }

    public function show(Album $album): View
    {
        return view('pages.galeri.show', [
            'album' => $album->load('media'),
        ]);
    }
}
