import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { GambarBerita, type MediaGambarBerita } from '@/Components/GambarBerita';
import { Input, Label, Petunjuk, Tombol } from '@/Components/Ui';
import { TIPE_GAMBAR_DITERIMA, tipeGambarDapatDioptimalkan } from '@/lib/optimalkanGambar';

/**
 * Editor teks kaya untuk isi berita dan halaman.
 *
 * Keluarannya HTML dan tetap dinormalisasi serta disanitasi di server. Editor
 * mengatur apa yang nyaman diketik, bukan apa yang aman untuk dipercaya.
 */

type Props = {
    nilai: string;
    onUbah: (html: string) => void;
    onUnggahGambar?: (gambar: File, alt: string) => Promise<MediaGambarBerita>;
    onStatusUnggahBerubah?: (aktif: boolean) => void;
    placeholder?: string;
    id?: string;
};

function gambarSedangTerpilih(editor: Editor): boolean {
    const pilihan = editor.state.selection;

    return !pilihan.empty && editor.state.doc.nodeAt(pilihan.from)?.type.name === GambarBerita.name;
}

function TombolAlat({
    aktif,
    onClick,
    label,
    disabled = false,
    children,
}: {
    aktif?: boolean;
    onClick: () => void;
    label: string;
    disabled?: boolean;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={aktif}
            aria-label={label}
            title={label}
            disabled={disabled}
            className={`grid min-h-9 min-w-9 place-items-center rounded-sm px-2 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                aktif ? 'bg-brand text-on-brand' : 'text-ink-muted hover:bg-paper-sunken'
            }`}
        >
            <span aria-hidden="true">{children}</span>
        </button>
    );
}

function Toolbar({
    editor,
    bisaUnggahGambar,
    onPilihGambar,
}: {
    editor: Editor;
    bisaUnggahGambar: boolean;
    onPilihGambar: () => void;
}) {
    return (
        <div role="toolbar" aria-label="Pemformatan isi berita" className="flex flex-wrap gap-1 border-b border-line bg-paper-raised px-2 py-1.5">
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

            <TombolAlat label="Sisipkan gambar" disabled={!bisaUnggahGambar} onClick={onPilihGambar}>
                <ImagePlus className="h-4 w-4" />
            </TombolAlat>

            <span className="mx-1 w-px bg-line" aria-hidden="true" />

            <TombolAlat label="Urungkan" disabled={!editor.can().chain().undo().run()} onClick={() => editor.chain().focus().undo().run()}>
                ↶
            </TombolAlat>

            <TombolAlat label="Ulangi" disabled={!editor.can().chain().redo().run()} onClick={() => editor.chain().focus().redo().run()}>
                ↷
            </TombolAlat>
        </div>
    );
}

export default function EditorTeks({ nilai, onUbah, onUnggahGambar, onStatusUnggahBerubah, placeholder, id }: Props) {
    const inputGambar = useRef<HTMLInputElement>(null);
    const [gambarTertunda, setGambarTertunda] = useState<File | null>(null);
    const [pratinjau, setPratinjau] = useState<string | null>(null);
    const [alt, setAlt] = useState('');
    const [caption, setCaption] = useState('');
    const [galatGambar, setGalatGambar] = useState<string | null>(null);
    const [mengunggah, setMengunggah] = useState(false);

    function siapkanGambar(file: File): void {
        setGalatGambar(null);

        if (!onUnggahGambar) {
            setGalatGambar('Simpan berita terlebih dahulu, lalu tambahkan gambar dari halaman ubah.');

            return;
        }

        if (!tipeGambarDapatDioptimalkan(file.type)) {
            setGalatGambar('Gambar harus berformat JPG, PNG, atau WebP.');

            return;
        }

        setGambarTertunda(file);
        setAlt('');
        setCaption('');
    }

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
            }),
            GambarBerita,
            Placeholder.configure({ placeholder: placeholder ?? 'Tulis isi di sini…' }),
        ],
        content: nilai,
        onUpdate: ({ editor }) => onUbah(editor.getHTML()),
        editorProps: {
            attributes: {
                id: id ?? 'editor',
                class: 'min-h-64 px-4 py-3 focus:outline-none',
            },
            handleDrop: (_view, event, _slice, dipindahkan) => {
                if (dipindahkan) return false;

                const file = Array.from(event.dataTransfer?.files ?? []).find((berkas) => berkas.type.startsWith('image/'));

                if (!file) return false;

                event.preventDefault();
                siapkanGambar(file);

                return true;
            },
            handlePaste: (_view, event) => {
                const file = Array.from(event.clipboardData?.files ?? []).find((berkas) => berkas.type.startsWith('image/'));

                if (!file) return false;

                event.preventDefault();
                siapkanGambar(file);

                return true;
            },
            handleDOMEvents: {
                dragover: (_view, event) => {
                    if (Array.from(event.dataTransfer?.items ?? []).some((item) => item.type.startsWith('image/'))) {
                        event.preventDefault();
                    }

                    return false;
                },
            },
        },
    });

    useEffect(() => {
        if (!gambarTertunda) {
            setPratinjau(null);

            return;
        }

        const url = URL.createObjectURL(gambarTertunda);
        setPratinjau(url);

        return () => URL.revokeObjectURL(url);
    }, [gambarTertunda]);

    useEffect(() => {
        if (!editor || editor.getHTML() === nilai) return;

        editor.commands.setContent(nilai, { emitUpdate: false });
    }, [editor, nilai]);

    const gambarTerpilih = useEditorState({
        editor,
        selector: ({ editor }) => (editor ? gambarSedangTerpilih(editor) : false),
    });

    if (!editor) return null;

    const atributGambar = editor.getAttributes('gambarBerita');

    async function unggahGambar(): Promise<void> {
        if (!gambarTertunda || !onUnggahGambar || !alt.trim()) return;

        setMengunggah(true);
        onStatusUnggahBerubah?.(true);
        setGalatGambar(null);

        try {
            const media = await onUnggahGambar(gambarTertunda, alt.trim());

            editor
                .chain()
                .focus()
                .insertContent([
                    {
                        type: GambarBerita.name,
                        attrs: {
                            mediaId: media.id,
                            src: media.url,
                            alt: media.alt,
                            caption: caption.trim(),
                            width: media.width,
                            height: media.height,
                        },
                    },
                    { type: 'paragraph' },
                ])
                .run();

            setGambarTertunda(null);
            setAlt('');
            setCaption('');
        } catch (error) {
            setGalatGambar(error instanceof Error ? error.message : 'Gambar gagal diunggah. Coba lagi.');
        } finally {
            setMengunggah(false);
            onStatusUnggahBerubah?.(false);
        }
    }

    return (
        <div className="editor-teks mt-1 overflow-hidden rounded-md border border-line bg-paper shadow-card focus-within:border-brand">
            <Toolbar
                editor={editor}
                bisaUnggahGambar={Boolean(onUnggahGambar)}
                onPilihGambar={() => inputGambar.current?.click()}
            />

            <input
                ref={inputGambar}
                type="file"
                accept={TIPE_GAMBAR_DITERIMA}
                className="hidden"
                tabIndex={-1}
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) siapkanGambar(file);
                    event.target.value = '';
                }}
            />

            {!onUnggahGambar && (
                <p className="border-b border-line bg-paper-raised px-4 py-2 text-xs text-ink-muted">
                    Simpan berita terlebih dahulu untuk mengaktifkan seret-lepas gambar dan caption.
                </p>
            )}

            {gambarTertunda && (
                <div className="grid gap-4 border-b border-line bg-paper-raised p-4 sm:grid-cols-3">
                    {pratinjau && (
                        <img src={pratinjau} alt="" className="aspect-video w-full rounded-md border border-line object-cover" />
                    )}
                    <div className="space-y-3 sm:col-span-2">
                        <div>
                            <Label htmlFor={`${id ?? 'editor'}_alt_gambar`}>Teks alternatif</Label>
                            <Input
                                id={`${id ?? 'editor'}_alt_gambar`}
                                value={alt}
                                onChange={(event) => setAlt(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') event.preventDefault();
                                }}
                                maxLength={200}
                                required
                                autoFocus
                            />
                            <Petunjuk>Jelaskan informasi penting dalam gambar untuk pembaca layar.</Petunjuk>
                        </div>
                        <div>
                            <Label htmlFor={`${id ?? 'editor'}_caption_gambar`}>Caption (opsional)</Label>
                            <Input
                                id={`${id ?? 'editor'}_caption_gambar`}
                                value={caption}
                                onChange={(event) => setCaption(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') event.preventDefault();
                                }}
                                maxLength={300}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Tombol
                                type="button"
                                disabled={mengunggah || !alt.trim()}
                                className="gap-2"
                                onClick={() => void unggahGambar()}
                            >
                                <Upload aria-hidden="true" className="h-4 w-4" />
                                {mengunggah ? 'Menyiapkan dan mengunggah…' : 'Sisipkan gambar'}
                            </Tombol>
                            <Tombol type="button" variasi="garis" onClick={() => setGambarTertunda(null)}>
                                Batal
                            </Tombol>
                        </div>
                    </div>
                </div>
            )}

            {gambarTerpilih && (
                <div className="flex flex-wrap items-end gap-3 border-b border-line bg-paper-raised p-3">
                    <div className="min-w-64 flex-1">
                        <Label htmlFor={`${id ?? 'editor'}_caption_terpilih`}>Caption gambar terpilih</Label>
                        <Input
                            id={`${id ?? 'editor'}_caption_terpilih`}
                            value={String(atributGambar.caption ?? '')}
                            onChange={(event) => editor.chain().updateAttributes('gambarBerita', { caption: event.target.value }).run()}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') event.preventDefault();
                            }}
                        />
                        <Petunjuk>Teks alternatif: {String(atributGambar.alt ?? '')}</Petunjuk>
                    </div>
                    <Tombol
                        type="button"
                        variasi="bahaya"
                        className="gap-2"
                        onClick={() => {
                            editor.chain().focus().deleteSelection().run();
                        }}
                    >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        Lepas gambar
                    </Tombol>
                </div>
            )}

            <EditorContent editor={editor} />

            <p className="border-t border-line bg-paper-raised px-4 py-2 text-xs text-ink-muted">
                {onUnggahGambar
                    ? 'Seret atau tempel gambar ke area tulisan. Caption akan tetap menempel saat gambar dipindahkan.'
                    : 'Gambar dapat ditambahkan setelah penyimpanan pertama.'}
            </p>

            <p aria-live="polite" className="px-4 text-sm text-danger">
                {galatGambar}
            </p>
        </div>
    );
}
