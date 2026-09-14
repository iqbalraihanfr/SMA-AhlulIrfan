@if (session('sukses'))
    <div role="status" class="rounded-md border border-line bg-paper px-4 py-3 text-sm text-success shadow-card">
        {{ session('sukses') }}
    </div>
@endif

@if ($errors->any())
    <div role="alert" class="rounded-md border border-danger bg-paper px-4 py-3 shadow-card">
        <p class="text-sm font-semibold text-danger">Periksa kembali isian berikut:</p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            @foreach ($errors->all() as $pesan)
                <li>{{ $pesan }}</li>
            @endforeach
        </ul>
    </div>
@endif
