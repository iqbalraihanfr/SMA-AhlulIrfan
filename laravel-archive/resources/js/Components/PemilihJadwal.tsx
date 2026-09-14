import { CalendarDays, Clock3, RotateCcw } from 'lucide-react';
import { Input, Petunjuk, Tombol } from '@/Components/Ui';

type Props = {
    id: string;
    nilai: string;
    onUbah: (nilai: string) => void;
};

function nilaiLokalSekarang(): string {
    const bagian = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    })
        .formatToParts(new Date())
        .reduce<Record<string, string>>((hasil, item) => {
            hasil[item.type] = item.value;

            return hasil;
        }, {});

    return `${bagian.year}-${bagian.month}-${bagian.day}T${bagian.hour}:${bagian.minute}`;
}

export default function PemilihJadwal({ id, nilai, onUbah }: Props) {
    const [tanggal = '', waktu = '09:00'] = nilai.split('T');
    const idPetunjuk = `${id}_petunjuk`;

    return (
        <div className="mt-1 rounded-md border border-line bg-paper p-3 shadow-card focus-within:border-brand">
            <div className="grid gap-2 sm:grid-cols-2">
                <div className="relative block">
                    <CalendarDays
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-ink-muted"
                    />
                    <Input
                        id={`${id}_tanggal`}
                        type="date"
                        value={tanggal}
                        aria-describedby={idPetunjuk}
                        onChange={(e) => onUbah(e.target.value ? `${e.target.value}T${waktu}` : '')}
                        className="mt-0 pl-9"
                    />
                </div>

                <label className="relative block">
                    <span className="sr-only">Jam terbit</span>
                    <Clock3
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-ink-muted"
                    />
                    <Input
                        id={`${id}_waktu`}
                        type="time"
                        value={tanggal ? waktu : ''}
                        disabled={!tanggal}
                        aria-describedby={idPetunjuk}
                        onChange={(e) => onUbah(`${tanggal}T${e.target.value || '09:00'}`)}
                        className="mt-0 pl-9"
                    />
                </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <Tombol type="button" variasi="garis" onClick={() => onUbah(nilaiLokalSekarang())} className="gap-2 px-3 py-1.5">
                    <Clock3 aria-hidden="true" className="h-4 w-4" />
                    Sekarang
                </Tombol>
                {nilai && (
                    <Tombol type="button" variasi="garis" onClick={() => onUbah('')} className="gap-2 px-3 py-1.5">
                        <RotateCcw aria-hidden="true" className="h-4 w-4" />
                        Kosongkan
                    </Tombol>
                )}
            </div>

            <div id={idPetunjuk}>
                <Petunjuk>Waktu Indonesia Barat (WIB). Tanggal mendatang menjadwalkan berita.</Petunjuk>
            </div>
        </div>
    );
}
