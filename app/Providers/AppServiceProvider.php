<?php

namespace App\Providers;

use App\Enums\Peran;
use App\Models\User;
use App\View\Composers\SitusComposer;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // super-admin melewati seluruh pemeriksaan izin. Ini alasan peran
        // tersebut sengaja tidak diberi daftar izin eksplisit di PeranSeeder.
        Gate::before(fn (User $user) => $user->hasRole(Peran::SuperAdmin->value) ? true : null);

        // APP_URL adalah satu-satunya sumber URL publik. Selain skema yang bisa
        // salah di balik proxy shared hosting, Host request juga bisa berupa
        // domain sementara. Keduanya tidak boleh mencemari canonical, sitemap,
        // og:image, maupun tautan reset password.
        $alamatAplikasi = (string) config('app.url');
        URL::useOrigin($alamatAplikasi);

        if (str_starts_with($alamatAplikasi, 'https://')) {
            URL::forceScheme('https');
        }

        View::composer(['components.layout.*', 'pages.*'], SitusComposer::class);
    }
}
