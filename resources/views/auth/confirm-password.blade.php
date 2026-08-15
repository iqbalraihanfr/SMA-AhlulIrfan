<x-guest-layout>
    <h1 class="font-heading text-xl font-semibold text-ink">Konfirmasi Kata Sandi</h1>
    <p class="mt-2 text-sm text-ink-muted">
        Bagian ini memerlukan konfirmasi. Masukkan kembali kata sandi Anda untuk melanjutkan.
    </p>

    <form method="POST" action="{{ route('password.confirm') }}" class="mt-6 space-y-4">
        @csrf

        <div>
            <x-input-label for="password" value="Kata Sandi" />
            <x-text-input id="password" name="password" type="password" class="mt-1 block w-full"
                          required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <div class="flex justify-end pt-2">
            <x-primary-button>Konfirmasi</x-primary-button>
        </div>
    </form>
</x-guest-layout>
