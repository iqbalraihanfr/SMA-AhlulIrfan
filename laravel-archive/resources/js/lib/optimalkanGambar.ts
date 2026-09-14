export type HasilOptimasiGambar = {
    berkas: File;
    dikompres: boolean;
    status: 'dikompres' | 'dilewati' | 'tidak-perlu' | 'gagal';
    ukuranAwal: number;
    ukuranAkhir: number;
};

export type PemrosesGambar = (berkas: File) => Promise<Blob | null>;

const DIMENSI_MAKSIMAL = 2560;
const UKURAN_SUMBER_MAKSIMAL = 20 * 1024 * 1024;
const PIKSEL_MAKSIMAL = 40_000_000;
const TIPE_YANG_DIDUKUNG = new Set(['image/jpeg', 'image/png', 'image/webp']);
export const TIPE_GAMBAR_DITERIMA = 'image/jpeg,image/png,image/webp';

type GambarTerurai = {
    sumber: CanvasImageSource;
    lebar: number;
    tinggi: number;
    tutup: () => void;
};

export function hitungUkuranTarget(
    lebar: number,
    tinggi: number,
    dimensiMaksimal = DIMENSI_MAKSIMAL,
): { lebar: number; tinggi: number } {
    const skala = Math.min(1, dimensiMaksimal / Math.max(lebar, tinggi));

    return {
        lebar: Math.max(1, Math.round(lebar * skala)),
        tinggi: Math.max(1, Math.round(tinggi * skala)),
    };
}

export function tipeGambarDapatDioptimalkan(tipe: string): boolean {
    return TIPE_YANG_DIDUKUNG.has(tipe.toLowerCase());
}

function hasilAsli(berkas: File, status: HasilOptimasiGambar['status']): HasilOptimasiGambar {
    return { berkas, dikompres: false, status, ukuranAwal: berkas.size, ukuranAkhir: berkas.size };
}

function namaWebp(nama: string): string {
    const tanpaEkstensi = nama.replace(/\.[^.]+$/, '');

    return `${tanpaEkstensi || 'gambar'}.webp`;
}

function memuatTeks(data: Uint8Array, teks: string): boolean {
    const target = Array.from(teks, (karakter) => karakter.charCodeAt(0));

    return data.some((nilai, indeks) => target.every((kode, offset) => data[indeks + offset] === kode));
}

async function gambarBeranimasi(berkas: File): Promise<boolean> {
    if (berkas.type !== 'image/png' && berkas.type !== 'image/webp') return false;

    const kepala = new Uint8Array(await berkas.slice(0, 64 * 1024).arrayBuffer());

    return berkas.type === 'image/png' ? memuatTeks(kepala, 'acTL') : memuatTeks(kepala, 'ANIM');
}

async function uraikanGambar(berkas: File): Promise<GambarTerurai> {
    if (typeof createImageBitmap === 'function') {
        try {
            const bitmap = await createImageBitmap(berkas, { imageOrientation: 'from-image' });

            return {
                sumber: bitmap,
                lebar: bitmap.width,
                tinggi: bitmap.height,
                tutup: () => bitmap.close(),
            };
        } catch {
            // Safari lama dan gambar tertentu perlu jalur elemen <img>.
        }
    }

    // Elemen <img> pada browser lama tidak konsisten menerapkan metadata
    // orientasi JPEG, PNG, maupun WebP saat dirasterisasi ke canvas. Jika
    // ImageBitmap tidak tersedia, pertahankan sumber asli agar tidak berputar.
    throw new Error('Decoder gambar yang mempertahankan orientasi tidak tersedia.');
}

async function prosesGambarDiBrowser(berkas: File): Promise<Blob | null> {
    if (await gambarBeranimasi(berkas)) return null;

    const gambar = await uraikanGambar(berkas);

    try {
        if (gambar.lebar <= 0 || gambar.tinggi <= 0 || gambar.lebar * gambar.tinggi > PIKSEL_MAKSIMAL) return null;

        const target = hitungUkuranTarget(gambar.lebar, gambar.tinggi);
        const kanvas = document.createElement('canvas');
        kanvas.width = target.lebar;
        kanvas.height = target.tinggi;

        const konteks = kanvas.getContext('2d', { alpha: true });
        if (!konteks) return null;

        konteks.imageSmoothingEnabled = true;
        konteks.imageSmoothingQuality = 'high';
        konteks.drawImage(gambar.sumber, 0, 0, target.lebar, target.tinggi);

        return await new Promise<Blob | null>((resolve) => kanvas.toBlob(resolve, 'image/webp', 0.82));
    } finally {
        gambar.tutup();
    }
}

export async function optimalkanGambar(
    berkas: File,
    proses: PemrosesGambar = prosesGambarDiBrowser,
): Promise<HasilOptimasiGambar> {
    if (!tipeGambarDapatDioptimalkan(berkas.type) || berkas.size > UKURAN_SUMBER_MAKSIMAL) {
        return hasilAsli(berkas, 'dilewati');
    }

    try {
        const hasil = await proses(berkas);
        if (!hasil) return hasilAsli(berkas, 'dilewati');
        if (hasil.type !== 'image/webp' || hasil.size >= berkas.size) return hasilAsli(berkas, 'tidak-perlu');

        const teroptimasi = new File([hasil], namaWebp(berkas.name), {
            type: 'image/webp',
            lastModified: berkas.lastModified,
        });

        return {
            berkas: teroptimasi,
            dikompres: true,
            status: 'dikompres',
            ukuranAwal: berkas.size,
            ukuranAkhir: teroptimasi.size,
        };
    } catch {
        return hasilAsli(berkas, 'gagal');
    }
}

export function formatUkuranBerkas(byte: number): string {
    if (byte < 1024 * 1024) return `${Math.max(1, Math.round(byte / 1024))} KB`;

    return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

export function pesanHasilOptimasi(hasil: HasilOptimasiGambar, batasByte?: number): string {
    if (batasByte && hasil.ukuranAkhir > batasByte) {
        return `Berkas ${formatUkuranBerkas(hasil.ukuranAkhir)} melebihi batas ${formatUkuranBerkas(batasByte)}. Pilih gambar lain.`;
    }

    if (hasil.status === 'gagal') {
        return `Kompresi browser tidak tersedia; berkas asli akan digunakan (${formatUkuranBerkas(hasil.ukuranAkhir)}).`;
    }

    if (!hasil.dikompres) return `Berkas asli siap diunggah (${formatUkuranBerkas(hasil.ukuranAkhir)}).`;

    const penghematan = Math.round((1 - hasil.ukuranAkhir / hasil.ukuranAwal) * 100);

    return `Ukuran diperkecil ${penghematan}%: ${formatUkuranBerkas(hasil.ukuranAwal)} menjadi ${formatUkuranBerkas(hasil.ukuranAkhir)}.`;
}
