<?php

namespace App\Http\Requests;

use App\Support\AturanGambar;
use Illuminate\Foundation\Http\FormRequest;

class UnggahGambarBeritaRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'gambar' => ['required', AturanGambar::statis(5 * 1024)],
            'alt' => ['required', 'string', 'max:200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'gambar' => 'gambar isi berita',
            'alt' => 'teks alternatif gambar',
        ];
    }

    public function messages(): array
    {
        return [
            'gambar.required' => 'Pilih gambar yang akan disisipkan.',
            'gambar.mimes' => 'Gambar isi berita harus berformat JPG, PNG, atau WebP.',
            'gambar.max' => 'Ukuran gambar isi berita maksimal 5 MB.',
            'alt.required' => 'Teks alternatif wajib diisi agar gambar terbaca pembaca layar.',
        ];
    }
}
