import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function SectionHeading({ kicker, judul }: { kicker: string, judul: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand">{kicker}</p>
      <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-ink-deep sm:text-3xl">{judul}</h2>
    </div>
  )
}

function PageHero({ judul, keterangan }: { judul: string, keterangan: string }) {
  return (
    <div className="bg-brand py-12 text-on-brand sm:py-20">
      <div className="section-shell">
        <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{judul}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-brand/90">{keterangan}</p>
      </div>
    </div>
  )
}

export default async function Profil() {
  const supabase = await createClient()
  const [
    { data: sejarah },
    { data: visiMisi },
    { data: sambutan }
  ] = await Promise.all([
    supabase.from('konten_halaman').select('*').eq('slug', 'sejarah').single(),
    supabase.from('konten_halaman').select('*').eq('slug', 'visi-misi').single(),
    supabase.from('konten_halaman').select('*').eq('slug', 'sambutan').single()
  ])

  const noData = !sejarah && !visiMisi && !sambutan

  return (
    <>
      <PageHero judul="Profil Sekolah" keterangan="Sejarah, visi dan misi, serta sambutan Kepala Sekolah." />

      <div className="section-shell space-y-20 py-14 sm:py-20">
        {sejarah && (
          <section id="sejarah">
            <SectionHeading kicker="Perjalanan sekolah" judul={sejarah.judul} />
            <div className="mt-8 prose max-w-none text-ink-muted prose-headings:text-ink-deep prose-a:text-brand" dangerouslySetInnerHTML={{ __html: sejarah.konten }} />
          </section>
        )}

        {visiMisi && (
          <section id="visi-misi">
            <SectionHeading kicker="Arah pendidikan" judul={visiMisi.judul} />
            <div className="mt-8 prose max-w-none text-ink-muted prose-headings:text-ink-deep prose-a:text-brand" dangerouslySetInnerHTML={{ __html: visiMisi.konten }} />
          </section>
        )}

        {sambutan && (
          <section id="sambutan">
            <SectionHeading kicker="Kepala sekolah" judul={sambutan.judul} />
            <div className="mt-8 prose max-w-none text-ink-muted prose-headings:text-ink-deep prose-a:text-brand" dangerouslySetInnerHTML={{ __html: sambutan.konten }} />
          </section>
        )}

        {noData && (
          <div className="rounded-xl border border-line border-dashed p-10 text-center">
            <h3 className="font-heading text-lg font-semibold text-ink-deep">Profil sedang disiapkan</h3>
            <p className="mt-2 text-sm text-ink-muted">Naskah profil sekolah belum tersedia. Silakan kembali lagi nanti.</p>
          </div>
        )}

        <p className="border-t border-line pt-8">
          <Link href="/struktur" className="text-sm font-semibold text-brand underline-offset-4 hover:underline">
            Lihat struktur organisasi sekolah &rarr;
          </Link>
        </p>
      </div>
    </>
  )
}
