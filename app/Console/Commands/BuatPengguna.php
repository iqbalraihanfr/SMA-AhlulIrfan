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
 * Kata sandi diminta secara interaktif supaya tidak pernah tersimpan di
 * riwayat shell. Tidak ada kata sandi bawaan di seeder — apa pun yang punya
 * kata sandi bawaan akan bocor cepat atau lambat.
 */
class BuatPengguna extends Command
{
    protected $signature = 'pengguna:buat';

    protected $description = 'Membuat akun pengelola situs (super admin atau admin sekolah)';

    public function handle(): int
    {
        $nama = text('Nama lengkap', required: true);
        $email = text('Email', required: true);

        $peran = select(
            label: 'Peran',
            options: collect(Peran::cases())
                ->mapWithKeys(fn (Peran $p) => [$p->value => $p->label().' — '.$p->keterangan()])
                ->all(),
            default: Peran::Admin->value,
        );

        $sandi = password('Kata sandi (minimal 12 karakter)', required: true);
        $ulang = password('Ulangi kata sandi', required: true);

        $validator = Validator::make(
            ['nama' => $nama, 'email' => $email, 'sandi' => $sandi, 'sandi_confirmation' => $ulang],
            [
                'nama' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'sandi' => ['required', 'confirmed', Password::min(12)],
            ],
            [
                'email.unique' => 'Email tersebut sudah dipakai akun lain.',
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

        return self::SUCCESS;
    }
}
