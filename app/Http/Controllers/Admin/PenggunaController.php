<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Izin;
use App\Enums\KategoriGuru;
use App\Enums\Peran;
use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
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
            'daftar' => User::with(['roles', 'guru'])->orderBy('name')->get()->map(fn (User $u) => [
                'id' => $u->id,
                'nama' => $u->name,
                'email' => $u->email,
                'peran' => $u->getRoleNames()->first(),
                'peranLabel' => $this->labelPeran($u->getRoleNames()->first()),
                'guruNama' => $u->guru?->nama,
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
            'pilihanGuru' => $this->pilihanGuru(),
            'aksi' => route('admin.pengguna.store'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'peran' => ['required', Rule::enum(Peran::class)],
            'guru_id' => $this->aturanGuru(),
            'password' => ['required', 'confirmed', Password::min(12)],
        ], $this->pesan());

        try {
            $user = DB::transaction(function () use ($data): User {
                $guruId = isset($data['guru_id']) ? (int) $data['guru_id'] : null;
                $this->kunciDanValidasiGuru($guruId);

                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'guru_id' => $guruId,
                ]);

                $user->assignRole($data['peran']);

                return $user;
            });
        } catch (QueryException $exception) {
            $this->terjemahkanBenturanTautanGuru($exception);
        }

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
                'guru_id' => $pengguna->guru_id,
            ],
            'pilihanPeran' => $this->pilihanPeran(),
            'pilihanGuru' => $this->pilihanGuru(),
            'aksi' => route('admin.pengguna.update', $pengguna),
        ]);
    }

    public function update(Request $request, User $pengguna): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', Rule::unique('users', 'email')->ignore($pengguna)],
            'peran' => ['required', Rule::enum(Peran::class)],
            'guru_id' => $this->aturanGuru($pengguna),
            // Kosongkan bila tidak ingin mengganti kata sandi.
            'password' => ['nullable', 'confirmed', Password::min(12)],
        ], $this->pesan());

        try {
            DB::transaction(function () use ($data, $pengguna): void {
                $this->cegahMenurunkanSuperAdminTerakhir($pengguna, $data['peran']);
                $penggunaTerkunci = User::query()->lockForUpdate()->findOrFail($pengguna->id);
                $guruId = isset($data['guru_id']) ? (int) $data['guru_id'] : null;
                $this->kunciDanValidasiGuru($guruId, $penggunaTerkunci->id);

                $penggunaTerkunci->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'guru_id' => $guruId,
                ]);

                if (filled($data['password'] ?? null)) {
                    $penggunaTerkunci->update(['password' => Hash::make($data['password'])]);
                }

                $penggunaTerkunci->syncRoles([$data['peran']]);
            });
        } catch (QueryException $exception) {
            $this->terjemahkanBenturanTautanGuru($exception);
        }

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

        $nama = DB::transaction(function () use ($pengguna): string {
            $this->cegahMenurunkanSuperAdminTerakhir($pengguna, null);
            $penggunaTerkunci = User::query()->lockForUpdate()->findOrFail($pengguna->id);

            $nama = $penggunaTerkunci->name;
            $penggunaTerkunci->delete();

            return $nama;
        });

        return to_route('admin.pengguna.index')->with('sukses', "Akun {$nama} dihapus.");
    }

    /**
     * Tanpa penjaga ini, super admin terakhir bisa menurunkan atau menghapus
     * dirinya sendiri sehingga tidak ada lagi yang bisa mengelola akun —
     * hanya bisa dipulihkan lewat SSH.
     */
    private function cegahMenurunkanSuperAdminTerakhir(User $pengguna, ?string $peranBaru): void
    {
        if ($peranBaru === Peran::SuperAdmin->value) {
            return;
        }

        $superAdmin = User::query()
            ->whereHas('roles', fn ($query) => $query->where('name', Peran::SuperAdmin->value))
            ->lockForUpdate()
            ->get();

        if (! $superAdmin->contains('id', $pengguna->id)) {
            return;
        }

        abort_if(
            $superAdmin->count() <= 1,
            422,
            'Ini super admin terakhir. Angkat super admin lain lebih dulu sebelum menurunkan atau menghapus akun ini.'
        );
    }

    private function kunciDanValidasiGuru(?int $guruId, ?int $abaikanPenggunaId = null): void
    {
        if ($guruId === null) {
            return;
        }

        $guru = Guru::query()->lockForUpdate()->find($guruId);

        if ($guru === null || $guru->kategori !== KategoriGuru::Pendidik || ! $guru->aktif) {
            throw ValidationException::withMessages([
                'guru_id' => 'Pendidik harus aktif dan berkategori pendidik.',
            ]);
        }

        $sudahTertaut = User::query()
            ->where('guru_id', $guru->id)
            ->when($abaikanPenggunaId !== null, fn ($query) => $query->whereKeyNot($abaikanPenggunaId))
            ->lockForUpdate()
            ->exists();

        if ($sudahTertaut) {
            throw ValidationException::withMessages([
                'guru_id' => 'Pendidik tersebut sudah terhubung ke akun lain.',
            ]);
        }
    }

    private function terjemahkanBenturanTautanGuru(QueryException $exception): never
    {
        if (str_contains($exception->getMessage(), 'users.guru_id') || str_contains($exception->getMessage(), 'users_guru_id_unique')) {
            throw ValidationException::withMessages([
                'guru_id' => 'Pendidik tersebut sudah terhubung ke akun lain.',
            ]);
        }

        throw $exception;
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

    /** @return array<int, array{id: int, nama: string}> */
    private function pilihanGuru(): array
    {
        return Guru::query()
            ->where('kategori', KategoriGuru::Pendidik->value)
            ->where('aktif', true)
            ->orderBy('urutan')
            ->orderBy('nama')
            ->get(['id', 'nama'])
            ->map(fn (Guru $guru) => ['id' => $guru->id, 'nama' => $guru->nama])
            ->all();
    }

    /** @return array<int, mixed> */
    private function aturanGuru(?User $pengguna = null): array
    {
        $unik = Rule::unique('users', 'guru_id');

        if ($pengguna !== null) {
            $unik->ignore($pengguna);
        }

        return [
            'exclude_unless:peran,'.Peran::Guru->value,
            'required',
            'integer',
            Rule::exists('guru', 'id')->where(fn ($query) => $query
                ->where('kategori', KategoriGuru::Pendidik->value)
                ->where('aktif', true)),
            $unik,
        ];
    }

    /** @return array<string, string> */
    private function pesan(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.unique' => 'Email tersebut sudah dipakai akun lain.',
            'peran.required' => 'Pilih peran akun.',
            'guru_id.required' => 'Pilih pendidik aktif untuk akun guru.',
            'guru_id.integer' => 'Pendidik yang dipilih tidak valid.',
            'guru_id.exists' => 'Pendidik harus aktif dan berkategori pendidik.',
            'guru_id.unique' => 'Pendidik tersebut sudah terhubung ke akun lain.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.confirmed' => 'Kedua kata sandi tidak sama.',
            'password.min' => 'Kata sandi minimal 12 karakter.',
        ];
    }
}
