import { mergeAttributes, Node } from '@tiptap/react';

export type MediaGambarBerita = {
    id: number;
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
};

/**
 * Node gambar artikel yang menyimpan gambar dan caption sebagai satu figure.
 * API Node berasal dari @tiptap/react (yang mengekspor @tiptap/core), sehingga
 * tidak perlu menambah dependency hanya untuk satu node kecil ini.
 */
export const GambarBerita = Node.create({
    name: 'gambarBerita',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            mediaId: { default: null },
            src: { default: null },
            alt: { default: '' },
            caption: { default: '' },
            width: { default: null },
            height: { default: null },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'figure',
                getAttrs: (elemen) => {
                    const gambar = elemen.querySelector('img[data-media-id]');

                    if (!gambar) return false;

                    const width = gambar.getAttribute('width');
                    const height = gambar.getAttribute('height');

                    return {
                        mediaId: Number(gambar.getAttribute('data-media-id')),
                        src: gambar.getAttribute('src'),
                        alt: gambar.getAttribute('alt') ?? '',
                        caption: elemen.querySelector('figcaption')?.textContent ?? '',
                        width: width ? Number(width) : null,
                        height: height ? Number(height) : null,
                    };
                },
            },
        ];
    },

    renderHTML({ node }) {
        const gambar = [
            'img',
            mergeAttributes({
                'data-media-id': String(node.attrs.mediaId),
                src: node.attrs.src,
                alt: node.attrs.alt,
                width: node.attrs.width,
                height: node.attrs.height,
            }),
        ];

        return node.attrs.caption
            ? ['figure', gambar, ['figcaption', {}, String(node.attrs.caption)]]
            : ['figure', gambar];
    },
});
