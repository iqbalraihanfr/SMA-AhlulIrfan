<x-guest-layout>
    <h1 class="font-heading text-xl font-semibold text-ink">Masuk Panel Admin</h1>
    <p class="mt-1 text-sm text-ink-muted">Khusus pengelola situs sekolah.</p>

    <x-auth-session-status class="mt-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}" class="mt-6 space-y-4">
        @csrf

        <div>
            <x-input-label for="email" value="Email" />
            <x-text-input id="email" name="email" type="email" class="mt-1 block w-full"
                          :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div>
            <x-input-label for="password" value="Kata Sandi" />
            <x-text-input id="password" name="password" type="password" class="mt-1 block w-full"
                          required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <label for="remember_me" class="inline-flex items-center gap-2">
            <input id="remember_me" name="remember" type="checkbox"
                   class="rounded border-line text-brand shadow-card focus:ring-brand">
            <span class="text-sm text-ink-muted">Ingat saya</span>
        </label>

        <div class="flex items-center justify-between gap-4 pt-2">
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}"
                   class="rounded-md text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
                    Lupa kata sandi?
                </a>
            @endif

            <x-primary-button>Masuk</x-primary-button>
        </div>
    </form>
</x-guest-layout>
