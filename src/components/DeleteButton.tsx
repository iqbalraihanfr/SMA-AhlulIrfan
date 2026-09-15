'use client';

import { Tombol } from '@/components/Ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({
    id,
    judul,
    pesan,
    endpoint,
    onDelete,
}: {
    id?: number | string;
    judul?: string;
    pesan?: string;
    endpoint?: string;
    onDelete?: () => Promise<void>;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const hapus = async () => {
        const konfirmasi =
            pesan ||
            (judul
                ? `Hapus "${judul}"? Tindakan ini tidak bisa dibatalkan.`
                : 'Hapus data ini? Tindakan ini tidak bisa dibatalkan.');

        if (!confirm(konfirmasi)) return;

        setLoading(true);
        try {
            if (onDelete) {
                await onDelete();
            } else {
                const url = endpoint || `/api/admin/berita/${id}`;
                const res = await fetch(url, { method: 'DELETE' });
                if (!res.ok) throw new Error('Gagal menghapus data.');
            }
            router.refresh();
        } catch (err: any) {
            alert(err.message || 'Gagal menghapus.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tombol type="button" variasi="bahaya" onClick={hapus} disabled={loading}>
            {loading ? 'Menghapus...' : 'Hapus'}
        </Tombol>
    );
}
