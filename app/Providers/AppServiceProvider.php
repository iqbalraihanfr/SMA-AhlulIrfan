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

        // Di balik proxy shared hosting, request bisa terdeteksi sebagai http
        // sehingga aset dan tautan reset password memakai skema yang salah.
        // APP_URL adalah sumber kebenaran; ikuti skemanya.
        if (str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }

        View::composer(['components.layout.*', 'pages.*'], SitusComposer::class);
    }
}
