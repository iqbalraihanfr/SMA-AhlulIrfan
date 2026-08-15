@php
    // Tiap menu membawa izinnya sendiri, sehingga admin sekolah tidak melihat
    // menu yang tidak boleh ia buka. Menu lain menyusul saat CRUD-nya dibangun.
    $menu = [
        ['Dasbor', route('dashboard'), null],
        ['Berita', route('admin.berita.index'), \App\Enums\Izin::KelolaBerita->value],
    ];
@endphp

<nav x-data="{ buka: false }" class="border-b border-line bg-paper">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        <div class="flex items-center gap-6">
            <a href="{{ route('dashboard') }}" class="font-heading text-base font-semibold text-ink">
                Panel Admin
            </a>

            <ul class="hidden items-center gap-1 sm:flex">
                @foreach ($menu as [$label, $tautan, $izin])
                    @if (! $izin || auth()->user()?->can($izin))
                        <li>
                            <a href="{{ $tautan }}"
                               @class([
                                   'rounded-md px-3 py-2 text-sm font-medium transition hover:bg-paper-sunken',
                                   'text-brand' => str_starts_with(request()->url(), $tautan),
                                   'text-ink-muted' => ! str_starts_with(request()->url(), $tautan),
                               ])>{{ $label }}</a>
                        </li>
                    @endif
                @endforeach
            </ul>
        </div>

        <div class="flex items-center gap-2">
            <a href="{{ route('beranda') }}" target="_blank" rel="noopener"
               class="hidden rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-sunken sm:block">
                Lihat situs
            </a>

            <a href="{{ route('profile.edit') }}"
               class="rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-sunken">
                {{ auth()->user()?->name }}
            </a>

            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit"
                        class="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-paper-sunken">
                    Keluar
                </button>
            </form>
        </div>
    </div>
</nav>
