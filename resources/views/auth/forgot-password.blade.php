<x-guest-layout>
    <h1 class="font-heading text-xl font-semibold text-ink">Lupa Kata Sandi</h1>
    <p class="mt-2 text-sm text-ink-muted">
        Masukkan email akun Anda. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
    </p>

    <x-auth-session-status class="mt-4" :status="session('status')" />

    <form method="POST" action="{{ route('password.email') }}" class="mt-6 space-y-4">
        @csrf

        <div>
            <x-input-label for="email" value="Email" />
            <x-text-input id="email" name="email" type="email" class="mt-1 block w-full"
                          :value="old('email')" required autofocus />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div class="flex justify-end pt-2">
            <x-primary-button>Kirim Tautan Reset</x-primary-button>
        </div>
    </form>
</x-guest-layout>
