<?php

namespace App\Http\Middleware;

use App\Enums\Izin;
use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * Hanya berlaku untuk panel admin. Situs publik tetap Blade
 * server-rendered — audiensnya orang tua di ponsel dengan kuota terbatas,
 * jadi halaman tanpa JavaScript itu keunggulan, bukan keterbatasan.
 */
class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'inertia';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Data yang dibagikan ke setiap halaman admin.
     *
     * `izin` dikirim agar menu dan tombol di React bisa disembunyikan sesuai
     * peran. Ini semata kenyamanan tampilan — penegakan sesungguhnya tetap di
     * middleware `can:` pada controller. Menyembunyikan tombol bukan keamanan.
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user ? [
                    'nama' => $user->name,
                    'email' => $user->email,
                    'peran' => $user->getRoleNames()->first(),
                ] : null,
                'izin' => $user
                    ? collect(Izin::cases())
                        ->mapWithKeys(fn (Izin $i) => [$i->value => $user->can($i->value)])
                        ->all()
                    : [],
            ],

            'flash' => [
                'sukses' => fn () => $request->session()->get('sukses'),
            ],

            'situs' => [
                'nama' => config('app.name'),
                'urlPublik' => route('beranda'),
            ],
        ];
    }
}
