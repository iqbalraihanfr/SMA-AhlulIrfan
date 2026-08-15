<?php

namespace Database\Seeders;

use App\Enums\KategoriGuru;
use App\Enums\TipeSimpul;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use App\Models\KontenHalaman;
use App\Models\PengaturanSitus;
use App\Models\StrukturOrganisasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Konten nyata sekolah. Sumber tunggal: docs/KONTEN-SEKOLAH.md
 *
 * TIDAK ADA NUPTK di sini, dan tidak boleh ditambahkan. Naskah aslinya
 * (WEBSITE.docx) memuat NUPTK 13 orang dan sengaja diblokir .gitignore.
 *
 * Idempoten — aman dijalankan berulang kali.
 */
class KontenSekolahSeeder extends Seeder
{
    public function run(): void
    {
        $this->pengaturan();
        $this->guru();
        $this->struktur();
        $this->ekstrakurikuler();
        $this->halaman();
    }

    private function pengaturan(): void
    {
        $p = PengaturanSitus::ambil();

        $p->fill([
            'nama_sekolah' => 'SMA Ahlul Irfan Bangsalsari',
            'nama_yayasan' => 'Yayasan Ahlul Irfan Al-Kholily',
            'semboyan' => 'Berilmu, Berakhlak Mulia, Berprestasi, dan Berdaya Saing Global',

            // Naskah sekolah hanya menyebut desa dan kecamatan. Alamat lengkap,
            // telepon, WhatsApp, email, dan koordinat BELUM diberikan — dan ini
            // satu-satunya kekurangan naskah yang MEMBLOKIR peluncuran.
            'alamat' => 'Desa Langkap, Kecamatan Bangsalsari, Kabupaten Jember, Jawa Timur',
            'fakta_terverifikasi' => false,
        ])->save();
    }

    private function guru(): void
    {
        $pendidik = [
            ['Fathur Rohman, S.P', 'L', 'Kepala Sekolah', null],
            // KONFLIK NAMA: bagan organisasi menulis "Fathur Rochman Hidayat",
            // tabel Data Guru menulis "Nur Rochman Hidayat". Dipakai versi
            // tabel; bagan diduga tertular nama Kepala Sekolah saat penyalinan.
            // Wajib dikonfirmasi ke sekolah — lihat docs/KONTEN-SEKOLAH.md.
            ['Nur Rochman Hidayat, S.Pd.', 'L', 'Wakil Kepala Sekolah', 'Sejarah'],
            ['Hilmi Fathiyatul Baroroh, S.Pd., Gr', 'P', 'Waka Kurikulum', 'Fisika'],
            ['Yeni Sri Astutik, S.Pd., Gr', 'P', 'Waka Kesiswaan', 'Biologi'],
            ['Anis Novi Rahayu, S.Pd., Gr', 'P', 'Waka Sarpras', 'Bahasa Indonesia'],
            ['Noviani, S.Pd., Gr', 'P', 'Bendahara', 'Bahasa Inggris'],
            ['Ahmad Saini, S.Pd., Gr', 'L', 'Operator Sekolah', 'Ekonomi'],
            ['Sofiatul Lailiyah, S.Pd., Gr', 'P', 'Bimbingan dan Konseling', null],
            ['Wiwindari Uswatul J, S.Pd., Gr', 'P', null, 'Geografi'],
            ['Nuruz Zakiya, M.Pd.', 'P', null, 'PKN'],
            ['Siti Habibah, S.Pd.', 'P', null, 'Matematika'],
            ['Firda Nurul Azizah, S.Ag', 'P', null, 'PAI'],
            ['Ika Nur Hasanah, S.Pd.', 'P', null, 'Bahasa Indonesia'],
        ];

        // KONFLIK NAMA: bagan menulis "Rofiatun", tabel menulis "Rofiyatun".
        $tendik = [
            ['Rofiyatun', 'P', 'Kepala TU'],
            ['Anik Purwanti', 'P', 'Staf TU'],
            ['Muflihatul Jannah', 'P', 'Staf TU'],
        ];

        foreach ($pendidik as $i => [$nama, $jk, $jabatan, $mapel]) {
            Guru::updateOrCreate(['nama' => $nama], [
                'kategori' => KategoriGuru::Pendidik,
                'jenis_kelamin' => $jk,
                'jabatan' => $jabatan,
                'mata_pelajaran' => $mapel,
                'urutan' => $i + 1,
                'aktif' => true,
            ]);
        }

        foreach ($tendik as $i => [$nama, $jk, $jabatan]) {
            Guru::updateOrCreate(['nama' => $nama], [
                'kategori' => KategoriGuru::TenagaKependidikan,
                'jenis_kelamin' => $jk,
                'jabatan' => $jabatan,
                'mata_pelajaran' => null,
                'urutan' => $i + 1,
                'aktif' => true,
            ]);
        }
    }

    /**
     * Bagan organisasi, ditranskrip dari gambar di WEBSITE.docx.
     * Simpul 'orang' menautkan ke tabel guru — nama tidak disalin ulang.
     */
    private function struktur(): void
    {
        $g = fn (string $nama) => Guru::where('nama', $nama)->value('id');

        $simpul = function (string $label, ?int $atasan, array $opsi = []) {
            return StrukturOrganisasi::updateOrCreate(
                ['label' => $label, 'atasan_id' => $atasan],
                array_merge(['tipe' => TipeSimpul::Orang, 'baris' => 1, 'urutan' => 0], $opsi)
            );
        };

        $kepala = $simpul('Kepala Sekolah', null, ['guru_id' => $g('Fathur Rohman, S.P')]);

        // Komite Sekolah bukan pegawai — digambar DI SAMPING Kepala Sekolah.
        // Namanya hanya ada di bagan, tidak ada di tabel Data Guru.
        $simpul('Komite Sekolah', $kepala->id, [
            'tipe' => TipeSimpul::Penasihat,
            'nama_luar' => 'Asmiatul Hosani, A. Akun.',
        ]);

        $wakil = $simpul('Wakil Kepala Sekolah', $kepala->id, [
            'guru_id' => $g('Nur Rochman Hidayat, S.Pd.'),
            'urutan' => 1,
        ]);

        $tu = $simpul('Kepala TU', $kepala->id, [
            'guru_id' => $g('Rofiyatun'),
            'urutan' => 2,
        ]);

        $simpul('Operator Sekolah', $tu->id, ['guru_id' => $g('Ahmad Saini, S.Pd., Gr')]);

        // Baris 1 di bawah Wakil: empat Waka sejajar.
        foreach ([
            ['Waka Kurikulum', 'Hilmi Fathiyatul Baroroh, S.Pd., Gr'],
            ['Waka Kesiswaan', 'Yeni Sri Astutik, S.Pd., Gr'],
            ['Waka Sarpras', 'Anis Novi Rahayu, S.Pd., Gr'],
            ['Bendahara', 'Noviani, S.Pd., Gr'],
        ] as $i => [$label, $nama]) {
            $simpul($label, $wakil->id, ['guru_id' => $g($nama), 'baris' => 1, 'urutan' => $i]);
        }

        // Baris 2 di bawah Wakil: menggantung pada garis mendatar di bawah
        // KEEMPAT Waka sekaligus, bukan pada salah satunya.
        $simpul('BK (Bimbingan Konseling)', $wakil->id, [
            'guru_id' => $g('Sofiatul Lailiyah, S.Pd., Gr'), 'baris' => 2, 'urutan' => 0,
        ]);

        $wali = $simpul('Wali Kelas', $wakil->id, [
            'tipe' => TipeSimpul::Kelompok, 'baris' => 2, 'urutan' => 1,
        ]);

        $simpul('Guru Mapel', $wakil->id, [
            'tipe' => TipeSimpul::Kelompok, 'baris' => 2, 'urutan' => 2,
        ]);

        $simpul('Siswa - Siswi', $wali->id, ['tipe' => TipeSimpul::Kelompok]);
    }

    private function ekstrakurikuler(): void
    {
        // Pembina dan jadwal BELUM ada di naskah sekolah — sengaja dibiarkan
        // null. Tampilkan hanya bila terisi.
        $daftar = ['Pramuka', 'Paskibra', 'Hadrah', 'Futsal', 'Voli', 'Tata Boga', 'Tata Rias'];

        foreach ($daftar as $i => $nama) {
            Ekstrakurikuler::updateOrCreate(['slug' => Str::slug($nama)], [
                'nama' => $nama,
                'urutan' => $i + 1,
            ]);
        }
    }

    private function halaman(): void
    {
        foreach ($this->naskahHalaman() as $kunci => [$judul, $isi]) {
            KontenHalaman::updateOrCreate(['kunci' => $kunci], [
                'judul' => $judul,
                'isi' => $isi,
                // Halaman tanpa naskah TIDAK diterbitkan — otomatis hilang dari
                // navigasi sampai sekolah mengirimkan isinya.
                'terbit' => filled($isi),
            ]);
        }
    }

    /** @return array<string, array{0: string, 1: ?string}> */
    private function naskahHalaman(): array
    {
        return [
            'sejarah' => ['Sejarah', $this->sejarah()],
            'visi_misi' => ['Visi dan Misi', $this->visiMisi()],
            'sambutan_kepsek' => ['Sambutan Kepala Sekolah', $this->sambutan()],
            'kurikulum' => ['Kurikulum', $this->kurikulum()],

            // Empat di bawah ini di WEBSITE.docx hanya berupa JUDUL KOSONG.
            // Jangan diisi karangan sendiri — tagih naskahnya ke sekolah.
            'prestasi' => ['Prestasi Siswa', null],
            'tata_tertib' => ['Tata Tertib Sekolah', null],
            'organisasi_siswa' => ['Organisasi Siswa', null],
            'e_learning' => ['E-Learning', null],
        ];
    }

    private function sejarah(): string
    {
        return <<<'HTML'
<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan menengah atas swasta yang berlokasi di Desa Langkap, Kecamatan Bangsalsari, Kabupaten Jember, Jawa Timur. Sekolah ini pertama kali didirikan pada tanggal 3 November 2003 berdasarkan Surat Keputusan Nomor 421/1334/463.41.6/2003 dengan nama SMA 06 Ma'arif Bangsalsari. Sejak awal berdirinya, sekolah berkomitmen memberikan layanan pendidikan yang berkualitas bagi masyarakat dengan menanamkan nilai-nilai keilmuan, akhlak, dan kebangsaan.</p>
<p>Seiring perkembangan zaman serta adanya perubahan dalam pengelolaan lembaga pendidikan, pada tahun 2022 sekolah resmi berganti nama menjadi SMA Ahlul Irfan Bangsalsari. Perubahan nama tersebut menjadi tonggak baru dalam perjalanan sekolah untuk memperkuat identitas sebagai lembaga pendidikan yang berada di bawah naungan Yayasan Ahlul Irfan Al-Kholily, dengan mengintegrasikan pendidikan umum dan nilai-nilai keislaman yang berlandaskan budaya pesantren.</p>
<p>Perubahan nama ini bukan sekadar pergantian identitas, tetapi juga menjadi awal transformasi menuju sekolah yang lebih maju, inovatif, dan berdaya saing. Berbagai pembenahan terus dilakukan, mulai dari peningkatan kualitas pembelajaran, pengembangan kompetensi guru, penyediaan sarana dan prasarana, hingga pemanfaatan teknologi informasi dalam mendukung proses pendidikan.</p>
<p>Sebagai sekolah yang berada dalam lingkungan Pondok Pesantren Ahlul Irfan Al-Kholily, SMA Ahlul Irfan Bangsalsari memiliki komitmen untuk membentuk peserta didik yang tidak hanya unggul dalam bidang akademik, tetapi juga memiliki akhlakul karimah, kedisiplinan, jiwa kepemimpinan, serta kepedulian sosial. Nilai-nilai religius menjadi bagian yang tidak terpisahkan dari seluruh aktivitas pendidikan di sekolah.</p>
<p>Memasuki era digital dan implementasi Kurikulum Merdeka, SMA Ahlul Irfan Bangsalsari terus berinovasi dalam menciptakan pembelajaran yang aktif, kreatif, dan menyenangkan. Sekolah juga mendorong peserta didik untuk berprestasi di bidang akademik maupun nonakademik serta siap melanjutkan pendidikan ke jenjang yang lebih tinggi.</p>
<p>Dengan semangat &ldquo;Berilmu, Berakhlak Mulia, Berprestasi, dan Berdaya Saing Global,&rdquo; SMA Ahlul Irfan Bangsalsari berkomitmen untuk terus menjadi lembaga pendidikan yang melahirkan generasi Islami, cerdas, berkarakter, dan mampu memberikan kontribusi terbaik bagi agama, bangsa, dan negara.</p>
HTML;
    }

    private function visiMisi(): string
    {
        return <<<'HTML'
<h3>Visi</h3>
<blockquote><p>Terwujudnya Peserta Didik yang Unggul dalam Keilmuan dan Keimanan, Berakhlakul Karimah, serta Berkarakter Pancasila.</p></blockquote>
<h3>Misi</h3>
<p>Untuk mewujudkan visi tersebut, SMA Ahlul Irfan Bangsalsari menetapkan misi sebagai berikut.</p>
<ol>
<li>Menyelenggarakan pembelajaran yang berkualitas, berpusat pada peserta didik, serta mengembangkan kemampuan literasi, numerasi, Pembelajaran Mendalam (PM), Kemampuan Kognitif Adaptif (KKA), STEM, dan literasi digital.</li>
<li>Menanamkan nilai-nilai keimanan, ketakwaan, akhlakul karimah, serta adab melalui integrasi pendidikan formal dan pembinaan kepesantrenan yang berlandaskan ajaran Ahlussunnah wal Jama'ah.</li>
<li>Mengembangkan potensi peserta didik sesuai bakat, minat, dan kemampuannya melalui kegiatan akademik, non akademik, riset, olahraga, seni, tahfiz Al-Qur'an, organisasi, dan kewirausahaan.</li>
<li>Mewujudkan budaya sekolah yang aman, nyaman, sehat, inklusif, disiplin, serta bebas dari perundungan, kekerasan, intoleransi, dan diskriminasi melalui pengasuhan yang humanis.</li>
<li>Menumbuhkan karakter Pancasila, kepemimpinan, kemandirian, kepedulian sosial, moderasi beragama, serta kecintaan terhadap bangsa dan negara melalui pembelajaran, pembiasaan, dan keteladanan.</li>
<li>Mengembangkan kemitraan yang harmonis antara sekolah, pondok pesantren, keluarga, masyarakat, perguruan tinggi, dunia usaha dan dunia industri, serta lembaga pemerintah dalam mendukung peningkatan mutu pendidikan.</li>
<li>Meningkatkan kompetensi pendidik dan tenaga kependidikan melalui pengembangan profesional berkelanjutan, budaya refleksi, inovasi pembelajaran, serta pemanfaatan teknologi secara bertanggung jawab.</li>
</ol>
HTML;
    }

    private function sambutan(): string
    {
        return <<<'HTML'
<p class="arab">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
<p>Assalamu'alaikum Warahmatullahi Wabarakatuh</p>
<p>Alhamdulillahirabbil 'alamin, segala puji bagi Allah SWT atas limpahan rahmat, taufik, dan hidayah-Nya sehingga Website Resmi SMA Ahlul Irfan Bangsalsari dapat menjadi media informasi, komunikasi, dan pelayanan bagi seluruh warga sekolah serta masyarakat luas.</p>
<p>Selamat datang di Website SMA Ahlul Irfan Bangsalsari.</p>
<p>Di era digital saat ini, kehadiran website sekolah merupakan salah satu bentuk komitmen kami dalam memberikan layanan pendidikan yang terbuka, informatif, dan mudah diakses. Melalui website ini, kami berharap masyarakat dapat memperoleh informasi mengenai profil sekolah, program akademik, kegiatan kesiswaan, prestasi, layanan administrasi, hingga berbagai informasi penting lainnya secara cepat dan akurat.</p>
<p>SMA Ahlul Irfan Bangsalsari merupakan lembaga pendidikan yang berada di bawah naungan Pondok Pesantren Ahlul Irfan Al-Kholily. Kami berkomitmen untuk menyelenggarakan pendidikan yang mampu menyeimbangkan keunggulan akademik, pembentukan karakter Islami, serta pengembangan potensi peserta didik sehingga lahir generasi yang beriman, berilmu, berakhlakul karimah, mandiri, dan siap menghadapi tantangan zaman.</p>
<p>Kami meyakini bahwa keberhasilan pendidikan merupakan hasil sinergi antara sekolah, orang tua, masyarakat, dan seluruh pemangku kepentingan. Oleh karena itu, kami mengajak semua pihak untuk terus menjalin kerja sama yang harmonis dalam mendukung tumbuh kembang peserta didik menuju masa depan yang lebih baik.</p>
<p>Terima kasih kepada seluruh guru, tenaga kependidikan, peserta didik, alumni, orang tua, dan masyarakat atas kepercayaan serta dukungan yang telah diberikan kepada SMA Ahlul Irfan Bangsalsari. Semoga website ini dapat memberikan manfaat dan menjadi jembatan komunikasi yang efektif bagi kita semua.</p>
<p>Akhir kata, semoga Allah SWT senantiasa memberikan kemudahan, keberkahan, dan kesuksesan dalam setiap langkah pengabdian kita di dunia pendidikan.</p>
<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
HTML;
    }

    private function kurikulum(): string
    {
        return <<<'HTML'
<h3>Kurikulum Berbasis Merdeka dan Nilai-Nilai Keislaman</h3>
<p>SMA Ahlul Irfan Bangsalsari menerapkan Kurikulum Merdeka sebagai dasar penyelenggaraan pendidikan yang dipadukan dengan pendidikan karakter Islami. Kurikulum ini dirancang untuk membentuk peserta didik yang memiliki kompetensi akademik, berakhlakul karimah, berwawasan kebangsaan, serta mampu menghadapi tantangan perkembangan ilmu pengetahuan dan teknologi.</p>
<p>Proses pembelajaran dilaksanakan secara aktif, kreatif, inovatif, dan menyenangkan dengan memberikan ruang bagi peserta didik untuk mengembangkan potensi, minat, dan bakat sesuai Profil Pelajar Pancasila.</p>
<h3>Program Pembelajaran</h3>
<ul>
<li>Mata pelajaran umum sesuai Kurikulum Merdeka.</li>
<li>Pembelajaran berbasis proyek (Project Based Learning).</li>
<li>Projek Penguatan Profil Pelajar Pancasila (P5).</li>
<li>Penguatan pendidikan karakter dan budaya sekolah.</li>
<li>Integrasi nilai-nilai keislaman dalam kegiatan pembelajaran.</li>
</ul>
<h3>Penguatan Pendidikan Keagamaan</h3>
<p>Sebagai sekolah yang berada dalam lingkungan Yayasan Ahlul Irfan Al-Kholily, peserta didik mendapatkan pembinaan keagamaan melalui berbagai kegiatan, antara lain:</p>
<ul>
<li>Pembiasaan membaca Al-Qur'an.</li>
<li>Shalat berjamaah.</li>
<li>Pembinaan akhlak dan karakter Islami.</li>
<li>Peringatan hari-hari besar Islam.</li>
<li>Kegiatan keagamaan dan sosial kemasyarakatan.</li>
</ul>
HTML;
    }
}
