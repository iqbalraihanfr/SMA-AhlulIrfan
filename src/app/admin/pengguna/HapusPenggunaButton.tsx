'use client';

import { useTransition } from 'react';
import { Tombol } from '@/components/Ui';
import { deletePengguna } from './actions';

interface HapusPenggunaButtonProps {
    id: string;
    email: string;
}

export function HapusPenggunaButton({ id, email }: HapusPenggunaButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleHapus = () => {
        const input = window.prompt('Ketik email pengguna (contoh: ' + email + ') untuk menghapus:');
        if (!input || input.trim() !== email) {
            return;
        }

        startTransition(async () => {
            try {
                await deletePengguna(id, input);
            } catch (err: unknown) {
                alert(err instanceof Error ? err.message : 'Gagal menghapus akun pengguna.');
            }
        });
    };

    return (
        <Tombol
            type="button"
            variasi="bahaya"
            onClick={handleHapus}
            disabled={isPending}
        >
            {isPending ? 'Menghapus...' : 'Hapus'}
        </Tombol>
    );
}
