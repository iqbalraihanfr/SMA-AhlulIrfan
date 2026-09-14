'use client';

import { Tombol } from '@/components/Ui';
import { useRouter } from 'next/navigation';

export function DeleteButton({ id, judul }: { id: number; judul: string }) {
    const router = useRouter();

    const hapus = async () => {
        if (!confirm(`Hapus berita "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;

        const res = await fetch(`/api/admin/berita/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            router.refresh();
        } else {
            alert('Gagal menghapus berita.');
        }
    };

    return (
        <Tombol type="button" variasi="bahaya" onClick={hapus}>
            Hapus
        </Tombol>
    );
}
