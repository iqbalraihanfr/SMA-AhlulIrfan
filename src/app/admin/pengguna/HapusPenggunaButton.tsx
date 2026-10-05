'use client';

import { useState, useTransition } from 'react';
import { Tombol } from '@/components/Ui';
import { deletePengguna } from './actions';

interface HapusPenggunaButtonProps {
    id: string;
    email: string;
}

export function HapusPenggunaButton({ id, email }: HapusPenggunaButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const handleHapus = () => {
        setError('');
        const input = window.prompt(`Hapus akun ${email}? Akun tidak bisa dipulihkan. Ketik ${email} untuk melanjutkan.`);
        if (input === null) return;
        if (input.trim() !== email) { setError('Email belum cocok. Akun tidak dihapus.'); return; }

        startTransition(async () => {
            try {
                await deletePengguna(id, input);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Akun belum berhasil dihapus. Silakan coba lagi.');
            }
        });
    };

    return (
        <div>
        <Tombol
            type="button"
            variasi="bahaya"
            onClick={handleHapus}
            disabled={isPending}
        >
            {isPending ? 'Menghapus...' : 'Hapus'}
        </Tombol>
        {error && <p role="alert" className="mt-2 max-w-xs text-sm text-danger">{error}</p>}
        </div>
    );
}
