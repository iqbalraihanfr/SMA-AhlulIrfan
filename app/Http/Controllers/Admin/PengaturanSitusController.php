<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Http\Controllers\Controller;
use App\Http\Requests\PengaturanSitusRequest;
use App\Models\PengaturanSitus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanSitusController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaPengaturan->value)];
    }

    public function edit(): Response
    {
        $p = PengaturanSitus::ambil();
        $logo = $p->getFirstMedia('logo');

        return Inertia::render('Pengaturan/Form', [
            'pengaturan' => [
                'nama_sekolah' => $p->nama_sekolah,
                'nama_yayasan' => $p->nama_yayasan,
                'semboyan' => $p->semboyan,
                'alamat' => $p->alamat,
                'telepon' => $p->telepon,
                'whatsapp' => $p->whatsapp,
                'email' => $p->email,
                'peta_lat' => $p->peta_lat,
                'peta_lng' => $p->peta_lng,
                'npsn' => $p->npsn,
                'akreditasi' => $p->akreditasi,
                'instagram' => $p->instagram,
                'facebook' => $p->facebook,
                'youtube' => $p->youtube,
                'logoUrl' => $logo?->getUrl(),
                'logoAlt' => $logo?->getCustomProperty('alt'),
            ],

            // Ditampilkan sebagai peringatan di formulir: tanpa ketiganya
            // halaman /kontak terbit setengah isi, dan itu satu-satunya
            // kekurangan naskah yang memblokir peluncuran.
            'wajibRilis' => [
                'alamat' => filled($p->alamat),
                'telepon' => filled($p->telepon),
                'whatsapp' => filled($p->whatsapp),
            ],
        ]);
    }

    public function update(PengaturanSitusRequest $request): RedirectResponse
    {
        $p = PengaturanSitus::ambil();

        $p->update($request->safe()->except(['logo', 'logo_alt']));

        if ($request->hasFile('logo')) {
            $p->addMediaFromRequest('logo')
                ->withCustomProperties(['alt' => $request->string('logo_alt')->value()])
                ->toMediaCollection('logo');
        }

        return to_route('admin.pengaturan.edit')->with('sukses', 'Pengaturan situs disimpan.');
    }
}
