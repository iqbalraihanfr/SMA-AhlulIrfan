<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\Peran;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Pengelolaan akun — hanya super admin (izin `pengguna.kelola`).
 *
 * Inilah jalur pemulihan resmi saat staf sekolah lupa kata sandi: super admin
 * mengaturkan kata sandi baru dari sini, lalu menyampaikannya langsung.
 * Karena itu situs tidak memerlukan SMTP untuk bisa diluncurkan, dan tidak
 * memerlukan penyedia identitas luar sama sekali.
 *
 * Kalau super admin sendiri yang terkunci, jaring pengamannya perintah
 * `php artisan pengguna:sandi` lewat SSH.
 */
class PenggunaController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('can:'.Izin::KelolaPengguna->value)];
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Pengguna/Index', [
            'daftar' => User::with('roles')->orderBy('name')->get()->map(fn (User $u) => [
                'id' => $u->id,
                'nama' => $u->name,
                'email' => $u->email,
                'peran' => $u->getRoleNames()->first(),
                'peranLabel' => $this->labelPeran($u->getRoleNames()->first()),
                'diriSendiri' => $u->id === $request->user()->id,
                'urlUbah' => route('admin.pengguna.edit', $u),
                'urlHapus' => route('admin.pengguna.destroy', $u),
            ]),
            'pilihanPeran' => $this->pilihanPeran(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pengguna/Form', [
            'pengguna' => null,
            'pilihanPeran' => $this->pilihanPeran(),
            'aksi' => route('admin.pengguna.store'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'peran' => ['required', Rule::enum(Peran::class)],
            'password' => ['required', 'confirmed', Password::min(12)],
        ], $this->pesan());

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->assignRole($data['peran']);

        return to_route('admin.pengguna.index')
            ->with('sukses', "Akun {$user->name} dibuat. Sampaikan kata sandinya langsung, jangan lewat grup chat.");
    }

    public function edit(User $pengguna): Response
    {
        return Inertia::render('Pengguna/Form', [
            'pengguna' => [
                'id' => $pengguna->id,
                'name' => $pengguna->name,
                'email' => $pengguna->email,
                'peran' => $pengguna->getRoleNames()->first(),
            ],
            'pilihanPeran' => $this->pilihanPeran(),
            'aksi' => route('admin.pengguna.update', $pengguna),
        ]);
    }

    public function update(Request $request, User $pengguna): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($pengguna)],
            'peran' => ['required', Rule::enum(Peran::class)],
            // Kosongkan bila tidak ingin mengganti kata sandi.
            'password' => ['nullable', 'confirmed', Password::min(12)],
        ], $this->pesan());

        $this->cegahMenurunkanSuperAdminTerakhir($request, $pengguna, $data['peran']);

        $pengguna->update([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if (filled($data['password'] ?? null)) {
            $pengguna->update(['password' => Hash::make($data['password'])]);
        }

        $pengguna->syncRoles([$data['peran']]);

        return to_route('admin.pengguna.index')->with(
            'sukses',
            filled($data['password'] ?? null)
                ? "Akun {$pengguna->name} diperbarui dan kata sandinya diganti."
                : "Akun {$pengguna->name} diperbarui."
        );
    }

    public function destroy(Request $request, User $pengguna): RedirectResponse
    {
        // Menghapus diri sendiri akan mengunci pengguna keluar seketika.
        abort_if($pengguna->id === $request->user()->id, 403, 'Tidak bisa menghapus akun sendiri.');

        $this->cegahMenurunkanSuperAdminTerakhir($request, $pengguna, null);

        $nama = $pengguna->name;
        $pengguna->delete();

        return to_route('admin.pengguna.index')->with('sukses', "Akun {$nama} dihapus.");
    }

    /**
     * Tanpa penjaga ini, super admin terakhir bisa menurunkan atau menghapus
     * dirinya sendiri sehingga tidak ada lagi yang bisa mengelola akun —
     * hanya bisa dipulihkan lewat SSH.
     */
    private function cegahMenurunkanSuperAdminTerakhir(Request $request, User $pengguna, ?string $peranBaru): void
    {
        if (! $pengguna->hasRole(Peran::SuperAdmin->value)) {
            return;
        }

        if ($peranBaru === Peran::SuperAdmin->value) {
            return;
        }

        $jumlah = User::role(Peran::SuperAdmin->value)->count();

        abort_if(
            $jumlah <= 1,
            422,
            'Ini super admin terakhir. Angkat super admin lain lebih dulu sebelum menurunkan atau menghapus akun ini.'
        );
    }

    /** @return array<int, array{value: string, label: string, keterangan: string}> */
    private function pilihanPeran(): array
    {
        return array_map(
            fn (Peran $p) => ['value' => $p->value, 'label' => $p->label(), 'keterangan' => $p->keterangan()],
            Peran::cases()
        );
    }

    private function labelPeran(?string $peran): string
    {
        return $peran ? Peran::from($peran)->label() : 'Tanpa peran';
    }

    /** @return array<string, string> */
    private function pesan(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email tersebut sudah dipakai akun lain.',
            'peran.required' => 'Pilih peran akun.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Kedua kata sandi tidak sama.',
            'password.min' => 'Kata sandi minimal 12 karakter.',
        ];
    }
}
