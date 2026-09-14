import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import Layout from '@/Layouts/Layout';
import type { ReactElement } from 'react';

const namaAplikasi = import.meta.env.VITE_APP_NAME ?? 'Panel Admin';

/**
 * ATURAN TOKEN berlaku juga di JavaScript: warna dibaca dari variabel CSS,
 * tidak ditulis keras. Saat grand design mengganti nilai token, bilah progres
 * ikut berubah tanpa menyentuh berkas ini.
 */
const warnaBrand = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || 'currentColor';

createInertiaApp({
    title: (judul) => (judul ? `${judul} — ${namaAplikasi}` : namaAplikasi),

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).then((modul) => {
            const halaman = modul as { default: { layout?: unknown } };

            // Layout dipasang sekali di sini, bukan diulang di tiap halaman.
            // Halaman yang butuh tampilan telanjang cukup men-set `layout = null`.
            halaman.default.layout ??= (anak: ReactElement) => <Layout>{anak}</Layout>;

            return halaman;
        }) as never,

    setup({ el, App, props }) {
        if (!el) return;

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: warnaBrand(),
    },
});
