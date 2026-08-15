<?php

namespace App\Console\Commands;

use App\Enums\Peran;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\password;
use function Laravel\Prompts\select;
use function Laravel\Prompts\text;

/**
 * Satu-satunya cara membuat akun pengelola. Registrasi publik dimatikan.
 *
 * Dua mode:
 *
 *   Interaktif (terminal biasa)
 *     php artisan pengguna:buat
 *
 *   Non-interaktif (SSH tanpa TTY, skrip deploy)
 *     ADMIN_PASSWORD='...' php artisan pengguna:buat \
 *         --nama="Rofiyatun" --email=tu@sekolah.sch.id --peran=admin
 *
 * Kata sandi TIDAK PERNAH diterima sebagai argumen baris perintah: argumen
 * tersimpan di riwayat shell dan terlihat di daftar proses oleh pengguna lain
 * di server yang sama. Interaktif meminta ketikan; non-interaktif membaca
 * variabel lingkungan ADMIN_PASSWORD, lalu variabel itu dibuang setelah dipakai.
 */
class BuatPengguna extends Command
{
    protected $signature = 'pengguna:buat
        {--nama= : Nama lengkap}
        {--email= : Alamat email}
        {--peran= : super-admin atau admin}';

    protected $description = 'Membuat akun pengelola situs (super admin atau admin sekolah)';

    public function handle(): int
    {
        // Symfony menganggap perintah "interaktif" selama --no-interaction
        // tidak dipakai, padahal lewat SSH tanpa TTY atau di dalam skrip tidak
        // ada yang bisa mengetik. stream_isatty memeriksa keadaan sebenarnya.
        $interaktif = $this->input->isInteractive() && stream_isatty(STDIN);

        $nama = $this->option('nama')
            ?: ($interaktif ? text('Nama lengkap', required: true) : null);

        $email = $this->option('email')
            ?: ($interaktif ? text('Email', required: true) : null);

        $peran = $this->option('peran')
            ?: ($interaktif ? select(
                label: 'Peran',
                options: collect(Peran::cases())
                    ->mapWithKeys(fn (Peran $p) => [$p->value => $p->label().' — '.$p->keterangan()])
                    ->all(),
                default: Peran::Admin->value,
            ) : null);

        if (blank($nama) || blank($email) || blank($peran)) {
            $this->error('Mode non-interaktif memerlukan --nama, --email, dan --peran.');

            return self::FAILURE;
        }

        [$sandi, $ulang] = $this->ambilSandi($interaktif);

        if ($sandi === null) {
            $this->error('Kata sandi tidak tersedia. Di mode non-interaktif, isi variabel lingkungan ADMIN_PASSWORD.');

            return self::FAILURE;
        }

        $validator = Validator::make(
            compact('nama', 'email', 'peran') + ['sandi' => $sandi, 'sandi_confirmation' => $ulang],
            [
                'nama' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'peran' => ['required', 'in:'.implode(',', array_column(Peran::cases(), 'value'))],
                'sandi' => ['required', 'confirmed', Password::min(12)],
            ],
            [
                'email.unique' => 'Email tersebut sudah dipakai akun lain.',
                'peran.in' => 'Peran harus super-admin atau admin.',
                'sandi.confirmed' => 'Kedua kata sandi tidak sama.',
                'sandi.min' => 'Kata sandi minimal 12 karakter.',
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $pesan) {
                $this->error($pesan);
            }

            return self::FAILURE;
        }

        $user = User::create([
            'name' => $nama,
            'email' => $email,
            'password' => Hash::make($sandi),
        ]);

        $user->assignRole($peran);

        $this->info("Akun dibuat: {$user->email} sebagai ".Peran::from($peran)->label());
        $this->line('Masuk lewat '.rtrim((string) config('app.url'), '/').'/login');

        if (! $interaktif) {
            $this->comment('Hapus ADMIN_PASSWORD dari lingkungan/riwayat shell sekarang juga.');
        }

        return self::SUCCESS;
    }

    /** @return array{0: string|null, 1: string|null} */
    private function ambilSandi(bool $interaktif): array
    {
        if ($interaktif) {
            return [
                password('Kata sandi (minimal 12 karakter)', required: true),
                password('Ulangi kata sandi', required: true),
            ];
        }

        // getenv(), BUKAN env(). Helper env() Laravel membaca berkas .env yang
        // sudah dibekukan ke dalam config cache, sehingga mengembalikan null
        // setelah `php artisan config:cache` — persis keadaan server produksi
        // saat perintah ini dipakai membuat akun pertama lewat SSH.
        $dariEnv = getenv('ADMIN_PASSWORD');

        return $dariEnv === false || $dariEnv === '' ? [null, null] : [$dariEnv, $dariEnv];
    }
}
