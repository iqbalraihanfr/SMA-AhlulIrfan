@php
    $baru = ! $berita->exists;
    $aksi = $baru ? route('admin.berita.store') : route('admin.berita.update', $berita);
    $sampul = $berita->exists ? $berita->getFirstMedia('sampul') : null;
@endphp

<x-app-layout>
    <x-slot name="header">
        <h1 class="font-heading text-xl font-semibold text-ink">
            {{ $baru ? 'Tulis Berita' : 'Ubah Berita' }}
        </h1>
        <p class="mt-1 text-sm text-ink-muted">
            <a href="{{ route('admin.berita.index') }}" class="underline underline-offset-4">&larr; Kembali ke daftar berita</a>
        </p>
    </x-slot>

    <div class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">

        <x-admin.notifikasi />

        <form method="POST" action="{{ $aksi }}" enctype="multipart/form-data"
              class="space-y-6 rounded-lg border border-line bg-paper p-6 shadow-card">
            @csrf
            @unless ($baru) @method('PUT') @endunless

            <div>
                <x-input-label for="judul" value="Judul" />
                <x-text-input id="judul" name="judul" class="mt-1 block w-full"
                              :value="old('judul', $berita->judul)" required autofocus />
                <x-input-error :messages="$errors->get('judul')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="slug" value="Slug (opsional)" />
                <x-text-input id="slug" name="slug" class="mt-1 block w-full"
                              :value="old('slug', $berita->slug)" placeholder="dibuat otomatis dari judul" />
                <p class="mt-1 text-xs text-ink-muted">
                    Bagian alamat halaman berita. Kosongkan saja bila ragu — sistem membuatnya dari judul.
                </p>
                <x-input-error :messages="$errors->get('slug')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="ringkasan" value="Ringkasan (opsional)" />
                <textarea id="ringkasan" name="ringkasan" rows="2"
                          class="mt-1 block w-full rounded-md border-line bg-paper text-ink shadow-card focus:border-brand focus:ring-brand"
                          maxlength="300">{{ old('ringkasan', $berita->ringkasan) }}</textarea>
                <p class="mt-1 text-xs text-ink-muted">Tampil di kartu berita dan hasil pencarian. Maksimal 300 karakter.</p>
                <x-input-error :messages="$errors->get('ringkasan')" class="mt-2" />
            </div>

            <div>
                <x-input-label for="isi" value="Isi Berita" />
                <textarea id="isi" name="isi" rows="14" required
                          class="mt-1 block w-full rounded-md border-line bg-paper font-mono text-sm text-ink shadow-card focus:border-brand focus:ring-brand">{{ old('isi', $berita->isi) }}</textarea>
                <p class="mt-1 text-xs text-ink-muted">
                    Tulis paragraf di antara tag <code>&lt;p&gt;</code>. Editor teks kaya menyusul; sementara ini isi
                    disanitasi otomatis sebelum ditampilkan, jadi tag berbahaya akan dibuang.
                </p>
                <x-input-error :messages="$errors->get('isi')" class="mt-2" />
            </div>

            <div class="grid gap-6 sm:grid-cols-2">
                <div>
                    <x-input-label for="status" value="Status" />
                    <select id="status" name="status"
                            class="mt-1 block w-full rounded-md border-line bg-paper text-ink shadow-card focus:border-brand focus:ring-brand">
                        @foreach (\App\Enums\StatusBerita::cases() as $status)
                            <option value="{{ $status->value }}"
                                @selected(old('status', $berita->status?->value) === $status->value)>
                                {{ $status->label() }}
                            </option>
                        @endforeach
                    </select>
                    <x-input-error :messages="$errors->get('status')" class="mt-2" />
                </div>

                <div>
                    <x-input-label for="diterbitkan_pada" value="Tanggal Terbit" />
                    <x-text-input id="diterbitkan_pada" name="diterbitkan_pada" type="datetime-local"
                                  class="mt-1 block w-full"
                                  :value="old('diterbitkan_pada', $berita->diterbitkan_pada?->format('Y-m-d\TH:i'))" />
                    <p class="mt-1 text-xs text-ink-muted">
                        Kosongkan untuk terbit sekarang. Tanggal di masa depan berarti berita baru muncul pada waktu itu.
                    </p>
                    <x-input-error :messages="$errors->get('diterbitkan_pada')" class="mt-2" />
                </div>
            </div>

            <fieldset class="space-y-3 border-t border-line pt-6">
                <legend class="text-sm font-semibold text-ink">Gambar Sampul</legend>

                @if ($sampul)
                    <img src="{{ $sampul->getUrl('card') }}"
                         alt="{{ $sampul->getCustomProperty('alt') }}"
                         width="320" height="200" class="rounded-md border border-line object-cover">
                    <p class="text-xs text-ink-muted">Unggah berkas baru untuk mengganti gambar ini.</p>
                @endif

                <div>
                    <x-input-label for="sampul" value="Berkas gambar" />
                    <input id="sampul" name="sampul" type="file" accept="image/*"
                           class="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-paper-sunken file:px-4 file:py-2 file:text-sm file:font-medium file:text-ink">
                    <p class="mt-1 text-xs text-ink-muted">Maksimal 5 MB. Ukuran ideal minimal 1600 piksel lebarnya.</p>
                    <x-input-error :messages="$errors->get('sampul')" class="mt-2" />
                </div>

                <div>
                    <x-input-label for="sampul_alt" value="Teks alternatif gambar" />
                    <x-text-input id="sampul_alt" name="sampul_alt" class="mt-1 block w-full"
                                  :value="old('sampul_alt', $sampul?->getCustomProperty('alt'))" />
                    <p class="mt-1 text-xs text-ink-muted">
                        Jelaskan isi gambar dalam satu kalimat. Wajib diisi — inilah yang dibacakan
                        pembaca layar dan yang tampil bila gambar gagal dimuat.
                    </p>
                    <x-input-error :messages="$errors->get('sampul_alt')" class="mt-2" />
                </div>
            </fieldset>

            <div class="flex items-center gap-3 border-t border-line pt-6">
                <x-primary-button>{{ $baru ? 'Simpan Berita' : 'Simpan Perubahan' }}</x-primary-button>
                <a href="{{ route('admin.berita.index') }}"
                   class="text-sm text-ink-muted underline underline-offset-4">Batal</a>
            </div>
        </form>
    </div>
</x-app-layout>
