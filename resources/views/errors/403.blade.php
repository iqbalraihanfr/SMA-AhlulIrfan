@extends('errors.layout')

@section('kode', '403')
@section('judul', 'Akses tidak diizinkan')
@section('pesan', 'Anda tidak memiliki izin untuk membuka halaman ini. Jika menurut Anda ini keliru, silakan masuk dengan akun yang sesuai.')

@section('aksi')
    <a href="{{ route('beranda') }}"
       class="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
        Kembali ke beranda
    </a>
@endsection
