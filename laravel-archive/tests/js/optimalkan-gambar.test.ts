import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    hitungUkuranTarget,
    optimalkanGambar,
    pesanHasilOptimasi,
    tipeGambarDapatDioptimalkan,
    type PemrosesGambar,
} from '../../resources/js/lib/optimalkanGambar.ts';

describe('optimalkanGambar', () => {
    it('mengecilkan dimensi secara proporsional tanpa memperbesar gambar kecil', () => {
        assert.deepEqual(hitungUkuranTarget(4000, 3000), { lebar: 2560, tinggi: 1920 });
        assert.deepEqual(hitungUkuranTarget(1200, 800), { lebar: 1200, tinggi: 800 });
    });

    it('hanya memproses raster yang aman dan mempertahankan SVG serta GIF', () => {
        assert.equal(tipeGambarDapatDioptimalkan('image/jpeg'), true);
        assert.equal(tipeGambarDapatDioptimalkan('image/png'), true);
        assert.equal(tipeGambarDapatDioptimalkan('image/webp'), true);
        assert.equal(tipeGambarDapatDioptimalkan('image/svg+xml'), false);
        assert.equal(tipeGambarDapatDioptimalkan('image/gif'), false);
    });

    it('menggunakan WebP hanya ketika hasilnya lebih kecil', async () => {
        const asli = new File([new Uint8Array(1_000)], 'kegiatan.sekolah.jpg', { type: 'image/jpeg', lastModified: 123 });
        const proses: PemrosesGambar = async () => new Blob([new Uint8Array(400)], { type: 'image/webp' });

        const hasil = await optimalkanGambar(asli, proses);

        assert.equal(hasil.dikompres, true);
        assert.equal(hasil.berkas.name, 'kegiatan.sekolah.webp');
        assert.equal(hasil.berkas.type, 'image/webp');
        assert.equal(hasil.berkas.size, 400);
        assert.equal(hasil.berkas.lastModified, 123);
    });

    it('mempertahankan berkas asli bila hasil tidak lebih kecil atau proses gagal', async () => {
        const asli = new File([new Uint8Array(500)], 'logo.png', { type: 'image/png' });
        const lebihBesar: PemrosesGambar = async () => new Blob([new Uint8Array(600)], { type: 'image/webp' });
        const gagal: PemrosesGambar = async () => {
            throw new Error('Canvas tidak tersedia');
        };

        assert.equal((await optimalkanGambar(asli, lebihBesar)).berkas, asli);

        const hasilGagal = await optimalkanGambar(asli, gagal);
        assert.equal(hasilGagal.berkas, asli);
        assert.equal(hasilGagal.status, 'gagal');
    });

    it('memperingatkan ketika hasil tetap melebihi batas server', () => {
        const hasil = {
            berkas: new File([new Uint8Array(6 * 1024 * 1024)], 'besar.jpg', { type: 'image/jpeg' }),
            dikompres: false,
            status: 'dilewati' as const,
            ukuranAwal: 6 * 1024 * 1024,
            ukuranAkhir: 6 * 1024 * 1024,
        };

        assert.match(pesanHasilOptimasi(hasil, 5 * 1024 * 1024), /melebihi batas 5\.0 MB/);
    });
});
