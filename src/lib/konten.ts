import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

export function cleanHtml(html?: string | null): string {
  if (!html) return ''
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'sub', 'sup',
      'h2', 'h3', 'h4', 'blockquote',
      'ul', 'ol', 'li',
      'a', 'img', 'figure', 'figcaption',
      'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'data-media-id', 'loading'],
      span: ['class', 'lang', 'dir'],
      p: ['class', 'lang', 'dir'],
      div: ['class'],
    },
    allowedClasses: {
      '*': ['arab'],
    },
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.href && (attribs.href.startsWith('http://') || attribs.href.startsWith('https://'))) {
          attribs.target = '_blank'
          attribs.rel = 'noopener noreferrer'
        }
        return { tagName, attribs }
      },
    },
  })
}


export const tanggalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal tidak valid.').refine(
  (value) => Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value,
  'Tanggal tidak valid.',
)

const idSchema = z.preprocess((value) => value || undefined, z.coerce.number().int().positive().optional())
const gambarSchema = z.string().url('Alamat gambar tidak valid.').refine((value) => /^https?:\/\//.test(value), 'Alamat gambar tidak valid.')
const gambarOpsional = z.preprocess((value) => value || null, gambarSchema.nullable())
const slugSchema = z.string().trim().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.').or(z.literal(''))

export const beritaSchema = z.object({
  id: idSchema,
  judul: z.string().trim().min(1, 'Judul wajib diisi.').max(200),
  slug: slugSchema.default(''),
  ringkasan: z.string().trim().max(300).default(''),
  isi: z.string().trim().min(1, 'Isi berita wajib diisi.').max(500_000),
  status: z.enum(['draft', 'terbit']),
  diterbitkan_pada: z.string().default('').refine((value) => !value || (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
    tanggalSchema.safeParse(value.slice(0, 10)).success &&
    value.slice(11, 13) <= '23' && value.slice(14, 16) <= '59'
  ), 'Tanggal atau jam terbit tidak valid.'),
  image_url: gambarOpsional,
})

export const albumSchema = z.object({
  id: idSchema,
  judul: z.string().trim().min(1, 'Judul album wajib diisi.').max(200),
  slug: slugSchema.default(''),
  deskripsi: z.string().trim().max(2000).default(''),
  urutan: z.coerce.number().int().min(0).max(999),
  foto_urls: z.array(gambarSchema).max(50, 'Maksimal 50 foto per album.'),
})

export function buatSlug(judul: string): string {
  return judul.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function jadwalPublikasi(status: string, nilai: string, sekarang = new Date()): string | null {
  return nilai ? new Date(`${nilai}:00+07:00`).toISOString() : status === 'terbit' ? sekarang.toISOString() : null
}

export function nomorWhatsApp(nomor: string): string {
  const digits = nomor.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}
