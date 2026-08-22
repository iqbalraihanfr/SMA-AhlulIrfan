<?php

namespace App\Policies;

use App\Enums\Izin;
use App\Models\Kelas;
use App\Models\User;
use Carbon\CarbonImmutable;

class PresensiPolicy
{
    public function view(User $user, Kelas $kelas): bool
    {
        return $user->can(Izin::KelolaPresensi->value)
            || ($user->can(Izin::IsiPresensi->value)
                && $user->guru_id !== null
                && $kelas->wali_kelas_id === $user->guru_id);
    }

    public function save(User $user, Kelas $kelas, CarbonImmutable $tanggal): bool
    {
        if ($this->tanggalMasaDepan($tanggal)) {
            return false;
        }

        return $user->can(Izin::KelolaPresensi->value)
            || ($tanggal->setTimezone('Asia/Jakarta')->isSameDay(CarbonImmutable::now('Asia/Jakarta'))
                && $user->can(Izin::IsiPresensi->value)
                && $user->guru_id !== null
                && $kelas->wali_kelas_id === $user->guru_id);
    }

    public function correct(User $user, Kelas $kelas, CarbonImmutable $tanggal): bool
    {
        return $user->can(Izin::KelolaPresensi->value) && ! $this->tanggalMasaDepan($tanggal);
    }

    public function export(User $user, Kelas $kelas): bool
    {
        return $user->can(Izin::KelolaPresensi->value);
    }

    private function tanggalMasaDepan(CarbonImmutable $tanggal): bool
    {
        return $tanggal->setTimezone('Asia/Jakarta')->startOfDay()
            ->greaterThan(CarbonImmutable::now('Asia/Jakarta')->startOfDay());
    }
}
