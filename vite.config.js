import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [
        laravel({
            // app.js  → situs publik (Alpine saja, tanpa React)
            // admin.tsx → panel admin (Inertia + React)
            //
            // Sengaja dua entry terpisah: pengunjung situs publik tidak boleh
            // ikut mengunduh React. Audiensnya orang tua di ponsel dengan
            // kuota terbatas.
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/admin.tsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'resources/js'),
        },
    },
});
