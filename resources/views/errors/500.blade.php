@extends('errors.layout')

@section('kode', '500')
@section('judul', 'Layanan sedang terganggu')
@section('pesan', 'Kami mengalami kendala saat menampilkan halaman ini. Silakan coba kembali beberapa saat lagi.')

@section('aksi')
    <a href="{{ url()->current() }}"
       class="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong">
        Coba lagi
    </a>
    <a href="{{ route('beranda') }}"
       class="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-sunken">
        Kembali ke beranda
    </a>
@endsection
