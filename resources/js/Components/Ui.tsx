import type {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from 'react';

/**
 * Primitif UI panel admin.
 *
 * ATURAN TOKEN berlaku penuh di sini: hanya nama token semantik
 * (bg-paper, text-ink, border-line, ...). Tidak ada kelas palet Tailwind
 * dan tidak ada nilai hex.
 */

/**
 * Judul di dalam halaman. Bilah sambutan dan navigasi sudah ditangani
 * kerangka admin, jadi komponen ini sengaja tidak punya latar maupun garis.
 */
export function PageHeader({ judul, keterangan, aksi }: { judul: string; keterangan?: string; aksi?: ReactNode }) {
    return (
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 className="font-heading text-xl font-semibold text-ink">{judul}</h1>
                {keterangan && <p className="mt-1 text-sm text-ink-muted">{keterangan}</p>}
            </div>
            {aksi}
        </header>
    );
}

export function Kartu({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`rounded-lg border border-line bg-paper p-6 shadow-card ${className}`}>{children}</div>;
}

export function Label({ children, className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label {...props} className={`block text-sm font-medium text-ink ${className}`}>
            {children}
        </label>
    );
}

const kelasKolom =
    'mt-1 block w-full rounded-md border-line bg-paper text-ink shadow-card placeholder:text-ink-faint focus:border-brand focus:ring-brand disabled:opacity-50';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`${kelasKolom} ${props.className ?? ''}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={`${kelasKolom} ${props.className ?? ''}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={`${kelasKolom} ${props.className ?? ''}`} />;
}

export function Petunjuk({ children }: { children: ReactNode }) {
    return <p className="mt-1 text-xs text-ink-muted">{children}</p>;
}

export function Galat({ pesan }: { pesan?: string }) {
    if (!pesan) return null;

    return <p className="mt-2 text-sm text-danger">{pesan}</p>;
}

export function Tombol({
    children,
    variasi = 'utama',
    ...props
}: { children: ReactNode; variasi?: 'utama' | 'garis' | 'bahaya' } & ButtonHTMLAttributes<HTMLButtonElement>) {
    const gaya = {
        utama: 'bg-brand text-on-brand hover:bg-brand-strong',
        garis: 'border border-line bg-paper text-ink hover:bg-paper-sunken',
        bahaya: 'text-danger hover:underline underline-offset-4',
    }[variasi];

    return (
        <button
            type="submit"
            {...props}
            className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${gaya} ${props.className ?? ''}`}
        >
            {children}
        </button>
    );
}

export function EmptyState({ judul, pesan }: { judul: string; pesan?: string }) {
    return (
        <div className="rounded-lg border border-dashed border-line bg-paper-raised px-6 py-12 text-center">
            <p className="font-heading text-lg font-semibold text-ink">{judul}</p>
            {pesan && <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{pesan}</p>}
        </div>
    );
}
