<?php

namespace Tests\Feature\Presensi;

use App\Enums\Izin;
use App\Enums\KategoriGuru;
use App\Models\Guru;
use App\Models\User;
use Database\Seeders\PeranSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PeranGuruTest extends TestCase
{
    use RefreshDatabase;

    private User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PeranSeeder::class);
        $this->superAdmin = User::factory()->create(['name' => 'Akun Super']);
        $this->superAdmin->assignRole('super-admin');
    }

    /** Role guru hanya menerima izin mengisi presensi, bukan pengelolaan penuh. */
    public function test_seeder_memberi_guru_hanya_izin_mengisi_presensi(): void
    {
        $guru = Role::query()->where('name', 'guru')->first();

        $this->assertNotNull($guru);
        $this->assertSame(['presensi.isi'], $guru->permissions->pluck('name')->all());
    }

    /** Akun guru tidak boleh menunjuk tenaga kependidikan yang masih aktif. */
    public function test_super_admin_tidak_dapat_membuat_akun_guru_untuk_tenaga_kependidikan(): void
    {
        $tendik = Guru::create([
            'nama' => 'Staf Tata Usaha',
            'kategori' => KategoriGuru::TenagaKependidikan,
            'aktif' => true,
        ]);

        $this->actingAs($this->superAdmin)
            ->post(route('admin.pengguna.store'), [
                'name' => 'Akun Staf',
                'email' => 'staf@sekolah.test',
                'peran' => 'guru',
                'guru_id' => $tendik->id,
                'password' => 'kata-sandi-uji-12',
                'password_confirmation' => 'kata-sandi-uji-12',
            ])
            ->assertSessionHasErrors('guru_id');

        $this->assertDatabaseMissing('users', ['email' => 'staf@sekolah.test']);
    }

    /** Seeder berulang memperbarui izin peran tanpa menggandakan role atau permission. */
    public function test_seeder_peran_presensi_idempoten_dan_membedakan_izin_setiap_peran(): void
    {
        $this->seed(PeranSeeder::class);

        $guru = Role::query()->where('name', 'guru')->firstOrFail();
        $admin = Role::query()->where('name', 'admin')->firstOrFail();
        $superAdmin = Role::query()->where('name', 'super-admin')->firstOrFail();

        $this->assertSame(3, Role::query()->count());
        $this->assertSame(count(Izin::cases()), Permission::query()->count());
        $this->assertTrue($admin->hasPermissionTo('presensi.isi'));
        $this->assertTrue($admin->hasPermissionTo('presensi.kelola'));
        $this->assertFalse($guru->hasPermissionTo('presensi.kelola'));
        $this->assertSame(0, $superAdmin->permissions()->count());
    }

    /** Peran guru selalu memerlukan pilihan pendidik aktif dari server, bukan sekadar form. */
    public function test_super_admin_wajib_memilih_pendidik_aktif_saat_membuat_akun_guru(): void
    {
        $this->actingAs($this->superAdmin)
            ->post(route('admin.pengguna.store'), [
                'name' => 'Guru Baru',
                'email' => 'guru-baru@sekolah.test',
                'peran' => 'guru',
                'password' => 'kata-sandi-uji-12',
                'password_confirmation' => 'kata-sandi-uji-12',
            ])
            ->assertSessionHasErrors('guru_id');

        $this->assertDatabaseMissing('users', ['email' => 'guru-baru@sekolah.test']);
    }

    /** Satu pendidik aktif hanya dapat terhubung ke satu akun guru. */
    public function test_super_admin_tidak_dapat_menautkan_satu_pendidik_ke_dua_akun_guru(): void
    {
        $guru = $this->pendidik();

        $this->buatAkunGuru($guru, 'guru-pertama@sekolah.test');

        $this->actingAs($this->superAdmin)
            ->post(route('admin.pengguna.store'), [
                'name' => 'Guru Kedua',
                'email' => 'guru-kedua@sekolah.test',
                'peran' => 'guru',
                'guru_id' => $guru->id,
                'password' => 'kata-sandi-uji-12',
                'password_confirmation' => 'kata-sandi-uji-12',
            ])
            ->assertSessionHasErrors('guru_id');

        $this->assertDatabaseMissing('users', ['email' => 'guru-kedua@sekolah.test']);
    }

    /** Mengubah peran guru ke admin wajib melepas tautan guru, bahkan bila klien mengirim guru_id. */
    public function test_mengubah_peran_guru_ke_admin_melepaskan_tautan_guru(): void
    {
        $guru = $this->pendidik();
        $akun = User::factory()->create(['guru_id' => $guru->id]);
        $akun->assignRole('guru');

        $this->actingAs($this->superAdmin)
            ->put(route('admin.pengguna.update', $akun), [
                'name' => $akun->name,
                'email' => $akun->email,
                'peran' => 'admin',
                'guru_id' => $guru->id,
            ])
            ->assertSessionHasNoErrors();

        $akun->refresh();
        $this->assertNull($akun->guru_id);
        $this->assertTrue($akun->hasRole('admin'));
    }

    /** Admin sekolah tidak boleh membuat akun guru meskipun mengetahui ID pendidiknya. */
    public function test_admin_sekolah_ditolak_saat_membuat_akun_guru(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $this->actingAs($admin)
            ->post(route('admin.pengguna.store'), [
                'name' => 'Guru Baru',
                'email' => 'guru-tolak@sekolah.test',
                'peran' => 'guru',
                'guru_id' => $this->pendidik()->id,
                'password' => 'kata-sandi-uji-12',
                'password_confirmation' => 'kata-sandi-uji-12',
            ])
            ->assertForbidden();
    }

    /** Perintah CLI membuat akun guru dan menyimpan tautan pendidiknya. */
    public function test_perintah_buat_pengguna_dapat_membuat_akun_guru_tertaut(): void
    {
        putenv('ADMIN_PASSWORD=kata-sandi-uji-12');
        $guru = $this->pendidik();

        $this->artisan('pengguna:buat', [
            '--nama' => 'Guru CLI',
            '--email' => 'guru-cli@sekolah.test',
            '--peran' => 'guru',
            '--guru-id' => $guru->id,
        ])->assertSuccessful();

        $akun = User::query()->where('email', 'guru-cli@sekolah.test')->firstOrFail();
        $this->assertSame($guru->id, $akun->guru_id);
        $this->assertTrue($akun->hasRole('guru'));

        putenv('ADMIN_PASSWORD');
    }

    /** Mode non-interaktif tidak boleh membuat akun guru tanpa tautan pendidik. */
    public function test_perintah_buat_pengguna_mewajibkan_guru_id_untuk_peran_guru(): void
    {
        putenv('ADMIN_PASSWORD=kata-sandi-uji-12');

        $this->artisan('pengguna:buat', [
            '--nama' => 'Guru Tanpa Tautan',
            '--email' => 'guru-tanpa-tautan@sekolah.test',
            '--peran' => 'guru',
        ])->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'guru-tanpa-tautan@sekolah.test']);
        putenv('ADMIN_PASSWORD');
    }

    /** Peran selain guru tidak menerima guru_id agar tautan tersembunyi tidak diabaikan diam-diam. */
    public function test_perintah_buat_pengguna_menolak_guru_id_untuk_peran_non_guru(): void
    {
        putenv('ADMIN_PASSWORD=kata-sandi-uji-12');

        $this->artisan('pengguna:buat', [
            '--nama' => 'Admin Dengan Tautan',
            '--email' => 'admin-tautan@sekolah.test',
            '--peran' => 'admin',
            '--guru-id' => $this->pendidik()->id,
        ])->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'admin-tautan@sekolah.test']);
        putenv('ADMIN_PASSWORD');
    }

    /** Form akun menerima pilihan pendidik aktif saja, lalu indeks menerangkan tautan akun guru. */
    public function test_halaman_pengguna_menyediakan_pilihan_pendidik_aktif_dan_menampilkan_tautan_guru(): void
    {
        $pendidik = $this->pendidik();
        Guru::create([
            'nama' => 'Pendidik Nonaktif',
            'kategori' => KategoriGuru::Pendidik,
            'aktif' => false,
        ]);

        $akunGuru = User::factory()->create([
            'name' => 'Akun Guru',
            'guru_id' => $pendidik->id,
        ]);
        $akunGuru->assignRole('guru');

        $this->actingAs($this->superAdmin)
            ->get(route('admin.pengguna.create'))
            ->assertInertia(fn (AssertableInertia $halaman) => $halaman
                ->component('Pengguna/Form')
                ->has('pilihanGuru', 1)
                ->where('pilihanGuru.0.id', $pendidik->id)
                ->where('pilihanGuru.0.nama', 'Pendidik Aktif')
            );

        $this->actingAs($this->superAdmin)
            ->get(route('admin.pengguna.index'))
            ->assertInertia(fn (AssertableInertia $halaman) => $halaman
                ->component('Pengguna/Index')
                ->where('daftar.0.guruNama', 'Pendidik Aktif')
                ->where('daftar.1.guruNama', null)
            );
    }

    /** Pendidik tertaut ke akun Guru tidak boleh dinonaktifkan diam-diam. */
    public function test_super_admin_tidak_dapat_menonaktifkan_pendidik_tertaut_ke_akun_guru(): void
    {
        $guru = $this->pendidik();
        $akun = User::factory()->create(['guru_id' => $guru->id]);
        $akun->assignRole('guru');

        $this->actingAs($this->superAdmin)
            ->put(route('admin.guru.update', $guru), $this->dataGuru($guru, ['aktif' => false]))
            ->assertSessionHasErrors('aktif');

        $this->assertTrue($guru->fresh()->aktif);
        $this->assertTrue($akun->fresh()->hasRole('guru'));
    }

    /** Pendidik tertaut ke akun Guru tidak boleh diubah menjadi tenaga kependidikan. */
    public function test_super_admin_tidak_dapat_mengubah_kategori_pendidik_tertaut_ke_akun_guru(): void
    {
        $guru = $this->pendidik();
        $akun = User::factory()->create(['guru_id' => $guru->id]);
        $akun->assignRole('guru');

        $this->actingAs($this->superAdmin)
            ->put(route('admin.guru.update', $guru), $this->dataGuru($guru, [
                'kategori' => KategoriGuru::TenagaKependidikan->value,
            ]))
            ->assertSessionHasErrors('kategori');

        $this->assertSame(KategoriGuru::Pendidik, $guru->fresh()->kategori);
        $this->assertTrue($akun->fresh()->hasRole('guru'));
    }

    private function pendidik(): Guru
    {
        return Guru::create([
            'nama' => 'Pendidik Aktif',
            'kategori' => KategoriGuru::Pendidik,
            'urutan' => 0,
            'aktif' => true,
        ]);
    }

    private function buatAkunGuru(Guru $guru, string $email): void
    {
        $this->actingAs($this->superAdmin)
            ->post(route('admin.pengguna.store'), [
                'name' => 'Guru Pertama',
                'email' => $email,
                'peran' => 'guru',
                'guru_id' => $guru->id,
                'password' => 'kata-sandi-uji-12',
                'password_confirmation' => 'kata-sandi-uji-12',
            ])
            ->assertSessionHasNoErrors();
    }

    /** @param array<string, mixed> $perubahan */
    private function dataGuru(Guru $guru, array $perubahan = []): array
    {
        return array_replace([
            'nama' => $guru->nama,
            'kategori' => $guru->kategori->value,
            'jenis_kelamin' => $guru->jenis_kelamin,
            'jabatan' => $guru->jabatan,
            'mata_pelajaran' => $guru->mata_pelajaran,
            'urutan' => $guru->urutan,
            'aktif' => $guru->aktif,
        ], $perubahan);
    }
}
