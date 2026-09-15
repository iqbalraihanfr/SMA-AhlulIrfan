import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StrukturFormClient from './StrukturFormClient';

export const metadata = {
    title: 'Tambah/Ubah Simpul Struktur | Admin',
};

export default async function StrukturFormPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    let simpul = null;

    if (searchParams.id) {
        const { data } = await supabase.from('struktur_organisasi').select('*').eq('id', searchParams.id).single();
        if (data) {
            simpul = {
                id: data.id,
                label: data.label,
                guru_id: data.guru_id,
                atasan_id: data.atasan_id,
                tipe: data.tipe,
                nama_luar: data.nama_luar,
                baris: data.baris ?? 1,
                urutan: data.urutan ?? 0,
            };
        }
    }

    // Fetch teachers
    const { data: daftarGuru } = await supabase
        .from('guru')
        .select('id, nama')
        .eq('aktif', true)
        .order('nama', { ascending: true });

    // Fetch potential parent nodes
    let queryAtasan = supabase.from('struktur_organisasi').select('id, label').order('baris').order('urutan');
    if (searchParams.id) {
        queryAtasan = queryAtasan.neq('id', searchParams.id);
    }
    const { data: daftarAtasan } = await queryAtasan;

    const pilihan = {
        guru: (daftarGuru ?? []).map((g) => ({ value: g.id, label: g.nama })),
        atasan: (daftarAtasan ?? []).map((a) => ({ value: a.id, label: a.label })),
        tipe: [
            { value: 'orang', label: 'Orang' },
            { value: 'kelompok', label: 'Kelompok' },
            { value: 'penasihat', label: 'Penasihat' },
        ],
    };

    return <StrukturFormClient simpul={simpul} pilihan={pilihan} />;
}
