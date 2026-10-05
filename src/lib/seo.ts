import schoolImage from '@/app/opengraph-image.png'

export const schoolName = 'SMA Ahlul Irfan Bangsalsari'
export const schoolDescription = 'Situs resmi SMA Ahlul Irfan Bangsalsari, Jember. Informasi profil sekolah, pembelajaran, berita, dan dokumentasi kegiatan siswa.'

// Metadata is shallowly merged: every page that sets openGraph must retain these fields.
export const schoolOpenGraph = {
  siteName: schoolName,
  images: [{
    url: schoolImage.src,
    width: schoolImage.width,
    height: schoolImage.height,
    alt: `Logo asli ${schoolName} Jember`,
  }],
}

export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
