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
    const [error, setError] = useState('');

    const hapus = async () => {
        const konfirmasi =
            pesan ||
            (judul
                ? `Hapus "${judul}"? Tindakan ini tidak bisa dibatalkan.`
                : 'Hapus data ini? Tindakan ini tidak bisa dibatalkan.');

        if (!confirm(konfirmasi)) return;

        setError('');
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
        } catch {
            setError('Kami belum dapat memastikan data sudah dihapus. Muat ulang halaman sebelum mencoba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <Tombol type="button" variasi="bahaya" onClick={hapus} disabled={loading}>
            {loading ? 'Menghapus...' : 'Hapus'}
        </Tombol>
        {error && <p role="alert" className="mt-2 max-w-xs text-sm text-danger">{error}</p>}
        </div>
    );
}
