<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\password;

/**
 * Jaring pengaman terakhir saat SUPER ADMIN sendiri terkunci.
 *
 * Staf sekolah yang lupa kata sandi dipulihkan super admin lewat panel
 * (Akun Pengguna). Perintah ini untuk kasus yang tidak bisa ditolong panel:
 * tidak ada seorang pun yang bisa masuk.
 *
 *   php artisan pengguna:sandi super@sekolah.sch.id
 *   ADMIN_PASSWORD='...' php artisan pengguna:sandi super@sekolah.sch.id
 *
 * Sengaja tidak ada jalur lewat web: apa pun yang bisa mereset kata sandi
 * tanpa autentikasi adalah pintu belakang, sekalipun disembunyikan.
 */
class GantiSandi extends Command
{
    protected $signature = 'pengguna:sandi {email : Email akun yang kata sandinya diganti}';

    protected $description = 'Mengganti kata sandi sebuah akun lewat baris perintah (pemulihan darurat)';

    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::whereEmail($email)->first();

        if (! $user) {
            $this->error("Tidak ada akun dengan email {$email}.");

            return self::FAILURE;
        }

        $interaktif = $this->input->isInteractive() && stream_isatty(STDIN);

        if ($interaktif) {
            $sandi = password('Kata sandi baru (minimal 12 karakter)', required: true);
            $ulang = password('Ulangi kata sandi baru', required: true);
        } else {
            // getenv(), BUKAN env(): helper env() mengembalikan null setelah
            // `php artisan config:cache`, persis keadaan server produksi.
            $dariEnv = getenv('ADMIN_PASSWORD');
            $sandi = $ulang = $dariEnv === false || $dariEnv === '' ? null : $dariEnv;
        }

        if ($sandi === null) {
            $this->error('Kata sandi tidak tersedia. Di mode non-interaktif, isi variabel lingkungan ADMIN_PASSWORD.');

            return self::FAILURE;
        }

        $validator = Validator::make(
            ['sandi' => $sandi, 'sandi_confirmation' => $ulang],
            ['sandi' => ['required', 'confirmed', Password::min(12)]],
            [
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

        $user->update(['password' => Hash::make($sandi)]);

        // Sesi lama harus mati: kalau kata sandi diganti karena dicurigai
        // bocor, membiarkan sesi lama hidup membuat penggantian ini sia-sia.
        $user->forceFill(['remember_token' => null])->save();

        $this->info("Kata sandi {$user->email} berhasil diganti.");

        if (! $interaktif) {
            $this->comment('Hapus ADMIN_PASSWORD dari lingkungan/riwayat shell sekarang juga.');
        }

        return self::SUCCESS;
    }
}
