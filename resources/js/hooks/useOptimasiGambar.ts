import { useCallback, useRef, useState } from 'react';
import { optimalkanGambar, pesanHasilOptimasi } from '@/lib/optimalkanGambar';

export function useOptimasiGambar(batasByte: number) {
    const [sedangMenyiapkan, setSedangMenyiapkan] = useState(false);
    const [pesanOptimasi, setPesanOptimasi] = useState<string | null>(null);
    const [melewatiBatas, setMelewatiBatas] = useState(false);
    const pilihanTerakhir = useRef(0);

    const pilihGambar = useCallback(async (berkas: File | null, simpan: (berkas: File | null) => void) => {
        const pilihan = ++pilihanTerakhir.current;

        if (!berkas) {
            simpan(null);
            setPesanOptimasi(null);
            setMelewatiBatas(false);
            setSedangMenyiapkan(false);

            return;
        }

        setSedangMenyiapkan(true);
        setPesanOptimasi('Menyiapkan gambar…');
        const hasil = await optimalkanGambar(berkas);

        if (pilihan !== pilihanTerakhir.current) return;

        simpan(hasil.berkas);
        setPesanOptimasi(pesanHasilOptimasi(hasil, batasByte));
        setMelewatiBatas(hasil.ukuranAkhir > batasByte);
        setSedangMenyiapkan(false);
    }, [batasByte]);

    return { pilihGambar, sedangMenyiapkan, pesanOptimasi, melewatiBatas };
}
