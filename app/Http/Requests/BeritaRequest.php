<?php

namespace App\Http\Requests;

use App\Enums\StatusBerita;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class BeritaRequest extends FormRequest
{
    public function rules(): array
    {
        $berita = $this->route('berita');

        return [
            'judul' => ['required', 'string', 'max:200'],
            'slug' => [
                'nullable', 'string', 'max:200', 'alpha_dash',
                Rule::unique('berita', 'slug')->ignore($berita),
            ],
            'ringkasan' => ['nullable', 'string', 'max:300'],
            'isi' => ['required', 'string'],
            'status' => ['required', Rule::enum(StatusBerita::class)],
            'diterbitkan_pada' => ['nullable', 'date'],

            'sampul' => ['nullable', File::image()->max(5 * 1024)],
            // Alt text wajib begitu ada gambar yang diunggah — ini syarat
            // aksesibilitas, bukan pelengkap. Lihat Definisi Selesai.
            'sampul_alt' => ['nullable', 'required_with:sampul', 'string', 'max:200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'judul' => 'judul',
            'slug' => 'slug',
            'ringkasan' => 'ringkasan',
            'isi' => 'isi berita',
            'status' => 'status',
            'diterbitkan_pada' => 'tanggal terbit',
            'sampul' => 'gambar sampul',
            'sampul_alt' => 'teks alternatif gambar',
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required' => 'Judul berita wajib diisi.',
            'isi.required' => 'Isi berita wajib diisi.',
            'slug.alpha_dash' => 'Slug hanya boleh berisi huruf, angka, dan tanda hubung.',
            'slug.unique' => 'Slug tersebut sudah dipakai berita lain.',
            'sampul.image' => 'Berkas sampul harus berupa gambar.',
            'sampul.max' => 'Ukuran gambar sampul maksimal 5 MB.',
            'sampul_alt.required_with' => 'Teks alternatif wajib diisi agar gambar terbaca pembaca layar.',
        ];
    }
}
