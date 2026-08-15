import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, type ReactNode } from 'react';

/**
 * Editor teks kaya untuk isi berita dan halaman.
 *
 * Pilihan ekstensi mengikuti editor situs pesantren
 * (PP_ahlulirfan/src/components/admin/rich-text-editor.tsx), tetapi ditulis
 * ulang tanpa shadcn, lucide, dan dialog media Supabase yang tidak ada di sini.
 *
 * Keluarannya HTML dan TETAP disanitasi mews/purifier di sisi server sebelum
 * dirender. Editor mengatur apa yang bisa diketik, bukan apa yang aman.
 */

type Props = {
    nilai: string;
    onUbah: (html: string) => void;
    placeholder?: string;
    id?: string;
};

function TombolAlat({
    aktif,
    onClick,
    label,
    children,
}: {
    aktif?: boolean;
    onClick: () => void;
    label: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={aktif}
            title={label}
            className={`rounded-sm px-2 py-1 text-sm font-medium transition ${
                aktif ? 'bg-brand text-on-brand' : 'text-ink-muted hover:bg-paper-sunken'
            }`}
        >
            <span aria-hidden="true">{children}</span>
            <span className="sr-only">{label}</span>
        </button>
    );
}

function Toolbar({ editor }: { editor: Editor }) {
    return (
        <div className="flex flex-wrap gap-1 border-b border-line bg-paper-raised px-2 py-1.5">
            <TombolAlat label="Tebal" aktif={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                <strong>B</strong>
            </TombolAlat>

            <TombolAlat label="Miring" aktif={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <em>I</em>
            </TombolAlat>

            <TombolAlat
                label="Sub-judul"
                aktif={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                H
            </TombolAlat>

            <TombolAlat label="Daftar berpoin" aktif={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                •
            </TombolAlat>

            <TombolAlat label="Daftar bernomor" aktif={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                1.
            </TombolAlat>

            <TombolAlat label="Kutipan" aktif={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                ❝
            </TombolAlat>

            <TombolAlat
                label={editor.isActive('link') ? 'Hapus tautan' : 'Tambah tautan'}
                aktif={editor.isActive('link')}
                onClick={() => {
                    if (editor.isActive('link')) {
                        editor.chain().focus().unsetLink().run();

                        return;
                    }

                    const url = window.prompt('Alamat tautan (contoh: https://…)');

                    if (!url) return;

                    editor.chain().focus().setLink({ href: url }).run();
                }}
            >
                🔗
            </TombolAlat>

            <span className="mx-1 w-px bg-line" aria-hidden="true" />

            <TombolAlat label="Urungkan" onClick={() => editor.chain().focus().undo().run()}>
                ↶
            </TombolAlat>

            <TombolAlat label="Ulangi" onClick={() => editor.chain().focus().redo().run()}>
                ↷
            </TombolAlat>
        </div>
    );
}

export default function EditorTeks({ nilai, onUbah, placeholder, id }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
            }),
            Placeholder.configure({ placeholder: placeholder ?? 'Tulis isi di sini…' }),
        ],
        content: nilai,
        onUpdate: ({ editor }) => onUbah(editor.getHTML()),
        editorProps: {
            attributes: {
                id: id ?? 'editor',
                class: 'min-h-64 px-4 py-3 focus:outline-none',
            },
        },
    });

    // Saat server mengembalikan nilai baru (mis. setelah validasi gagal),
    // isi editor harus ikut. Tanpa ini yang diketik ulang bisa hilang.
    useEffect(() => {
        if (!editor || editor.getHTML() === nilai) return;

        editor.commands.setContent(nilai, { emitUpdate: false });
    }, [editor, nilai]);

    if (!editor) return null;

    return (
        <div className="mt-1 overflow-hidden rounded-md border border-line bg-paper shadow-card focus-within:border-brand">
            <Toolbar editor={editor} />

            <EditorContent
                editor={editor}
                className="[&_.tiptap]:text-ink [&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-ink-faint [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_ul]:list-disc [&_ul]:pl-6"
            />
        </div>
    );
}
