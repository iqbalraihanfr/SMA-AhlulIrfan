@extends('errors.layout')

@section('kode', '404')
@section('judul', 'Halaman tidak ditemukan')
@section('pesan', 'Halaman yang Anda cari belum tersedia, telah dipindahkan, atau alamatnya tidak tepat.')

@section('aksi')
    <a href="{{ route('beranda') }}"
       class="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
        Kembali ke beranda
    </a>
    <a href="{{ route('kontak') }}"
       class="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
        Hubungi sekolah
    </a>
@endsection
