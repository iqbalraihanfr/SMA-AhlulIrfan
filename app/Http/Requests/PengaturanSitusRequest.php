<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class PengaturanSitusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama_sekolah' => ['required', 'string', 'max:150'],
            'nama_yayasan' => ['nullable', 'string', 'max:150'],
            'semboyan' => ['nullable', 'string', 'max:200'],

            'alamat' => ['nullable', 'string', 'max:500'],
            'telepon' => ['nullable', 'string', 'max:30'],
            'whatsapp' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:150'],

            'peta_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'peta_lng' => ['nullable', 'numeric', 'between:-180,180'],

            'npsn' => ['nullable', 'string', 'max:20'],
            'akreditasi' => ['nullable', 'string', 'max:50'],

            'instagram' => ['nullable', 'url', 'max:255'],
            'facebook' => ['nullable', 'url', 'max:255'],
            'youtube' => ['nullable', 'url', 'max:255'],

            'logo' => ['nullable', File::image()->max(2 * 1024)],
            'logo_alt' => ['nullable', 'required_with:logo', 'string', 'max:200'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama_sekolah' => 'nama sekolah',
            'nama_yayasan' => 'nama yayasan',
            'peta_lat' => 'lintang peta',
            'peta_lng' => 'bujur peta',
            'logo_alt' => 'teks alternatif logo',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_sekolah.required' => 'Nama sekolah wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'peta_lat.between' => 'Lintang harus antara -90 dan 90.',
            'peta_lng.between' => 'Bujur harus antara -180 dan 180.',
            'instagram.url' => 'Alamat Instagram harus berupa URL lengkap, diawali https://',
            'facebook.url' => 'Alamat Facebook harus berupa URL lengkap, diawali https://',
            'youtube.url' => 'Alamat YouTube harus berupa URL lengkap, diawali https://',
            'logo.max' => 'Ukuran logo maksimal 2 MB.',
            'logo_alt.required_with' => 'Teks alternatif logo wajib diisi.',
        ];
    }
}
