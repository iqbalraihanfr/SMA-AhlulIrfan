'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MenuItem = {
  label: string
  href?: string
  anak?: [string, string][]
}

function IkonMenu({ buka }: { buka: boolean }) {
  return <svg className="hamburger-icon size-5" data-open={buka} fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <g className="hamburger-icon__top"><path d="M8 6h12" /></g>
    <g className="hamburger-icon__middle"><path d="M5 12h15" /></g>
    <g className="hamburger-icon__bottom"><path d="M3 18h17" /></g>
  </svg>
}

export function Navbar({
  situs,
  halamanTerbit = ['sejarah', 'visi_misi', 'sambutan_kepsek', 'kurikulum'],
}: {
  situs: any
  halamanTerbit?: string[]
}) {
  const [buka, setBuka] = useState(false)
  const [menuTerbuka, setMenuTerbuka] = useState<number | null>(null)
  const pathname = usePathname()
  const menuRef = useRef<HTMLUListElement>(null)
  const mobileRef = useRef<HTMLDialogElement>(null)

  const adaNaskah = (kunci: string) => halamanTerbit.includes(kunci)

  const menu: MenuItem[] = [
    { label: 'Beranda', href: '/' },
    {
      label: 'Profil',
      anak: [
        ...(adaNaskah('sejarah') || adaNaskah('visi_misi') ? [['Profil Sekolah', '/profil'] as [string, string]] : []),
        ['Struktur Organisasi', '/profil/struktur-organisasi'] as [string, string],
      ],
    },
    {
      label: 'Akademik',
      anak: [
        ...(adaNaskah('kurikulum') ? [['Kurikulum', '/kurikulum'] as [string, string]] : []),
        ['Guru & Tenaga Kependidikan', '/guru'] as [string, string],
        ['Ekstrakurikuler', '/ekstrakurikuler'] as [string, string],
        ['Galeri', '/galeri'] as [string, string],
        ...(adaNaskah('prestasi') ? [['Prestasi Siswa', '/prestasi'] as [string, string]] : []),
        ...(adaNaskah('organisasi_siswa') ? [['Organisasi Siswa', '/organisasi-siswa'] as [string, string]] : []),
        ...(adaNaskah('tata_tertib') ? [['Tata Tertib', '/tata-tertib'] as [string, string]] : []),
      ],
    },
    { label: 'Berita', href: '/berita' },
    { label: 'Kontak', href: '/kontak' },
  ].filter((item) => !item.anak || item.anak.length > 0)

  const tautanAktif = (href: string): boolean => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBuka(false)
        setMenuTerbuka(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuTerbuka(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setBuka(false)
    setMenuTerbuka(null)
  }, [pathname])

  useEffect(() => {
    const dialog = mobileRef.current
    if (!buka || !dialog) return
    dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (desktop.matches) setBuka(false) }
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [buka])

  return (
    <header className="site-nav sticky top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6" aria-label="Navigasi utama">
        <Link href="/" className="site-nav__brand flex min-w-0 items-center gap-3 rounded-md">
          {situs?.logo_url ? (
            <img
              src={situs.logo_url}
              alt={`Logo ${situs.nama_sekolah || 'SMA Ahlul Irfan'}`}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />
          ) : (
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand font-heading text-sm font-semibold text-on-brand">
              AI
            </span>
          )}
          <span className="truncate font-heading text-base font-semibold leading-tight text-ink sm:text-lg">
            {situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'}
          </span>
        </Link>

        <ul
          className="hidden items-center gap-1 lg:flex"
          ref={menuRef}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setMenuTerbuka(null)
            }
          }}
        >
          {menu.map((item, index) => {
            if (item.href) {
              const aktif = tautanAktif(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-aktif={aktif ? 'true' : 'false'}
                    aria-current={aktif ? 'page' : undefined}
                    className="site-nav__link rounded-md px-3 py-3 text-sm font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            } else {
              const apakahAktif = item.anak?.some(([, tautan]) => tautanAktif(tautan))
              const isOpen = menuTerbuka === index
              return (
                <li
                  key={index}
                  className="relative"
                  onMouseEnter={() => setMenuTerbuka(index)}
                  onMouseLeave={() => setMenuTerbuka(null)}
                  onFocus={() => setMenuTerbuka(index)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    onClick={() => setMenuTerbuka(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="site-nav__link inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-3 text-sm font-semibold"
                    data-aktif={apakahAktif ? 'true' : 'false'}
                  >
                    {item.label}
                    <svg
                      className={`h-4 w-4 opacity-60 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full z-50 w-64 pt-2">
                      <ul className="rounded-md border border-line bg-paper p-2 shadow-card">
                        {item.anak?.map(([label, tautan]) => {
                          const subAktif = tautanAktif(tautan)
                          return (
                            <li key={tautan}>
                              <Link
                                href={tautan}
                                data-aktif={subAktif ? 'true' : 'false'}
                                aria-current={subAktif ? 'page' : undefined}
                                className={`block rounded-sm px-3 py-2.5 text-sm ${
                                  subAktif
                                    ? 'bg-brand-soft font-semibold text-brand'
                                    : 'text-ink-muted hover:bg-paper-sunken hover:text-ink'
                                }`}
                              >
                                {label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              )
            }
          })}
        </ul>

        <button
          type="button"
          onClick={() => setBuka(!buka)}
          aria-expanded={buka}
          aria-controls="menu-mobile"
          aria-haspopup="dialog"
          className="grid size-12 shrink-0 place-items-center rounded-md text-ink-muted transition hover:bg-paper-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
        >
          <span className="sr-only">{buka ? 'Tutup menu' : 'Buka menu'}</span>
          <IkonMenu buka={buka} />
        </button>
      </nav>

      <dialog ref={mobileRef} id="menu-mobile" className="mobile-menu"
        aria-labelledby="menu-mobile-title" aria-describedby="menu-mobile-description"
        onClose={() => setBuka(false)}>
        <h2 id="menu-mobile-title" className="sr-only">Menu navigasi SMA Ahlul Irfan</h2>
        <p id="menu-mobile-description" className="sr-only">Pilih halaman yang ingin Anda kunjungi, atau tutup menu untuk kembali.</p>
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-5 sm:px-8 sm:py-7">
          <Link href="/" aria-label="Beranda SMA Ahlul Irfan" onClick={() => setBuka(false)}
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <img src={situs?.logo_url || '/logo-sma.webp'} alt="Logo SMA Ahlul Irfan" width={40} height={40} className="size-10 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-ink-muted sm:block">Menu utama</span>
            <button type="button" autoFocus onClick={() => setBuka(false)} aria-label="Tutup menu"
              className="grid size-12 place-items-center rounded-full border border-line text-ink transition hover:bg-paper-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
              <IkonMenu buka={buka} />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-8 sm:py-7">
          <div className="mx-auto flex min-h-full max-w-6xl flex-col">
            <p className="mb-3 text-sm font-semibold text-brand">Jelajahi SMA Ahlul Irfan</p>
            <nav aria-label="Navigasi seluler" className="mb-8">
              {menu.map((item, index) => {
                const label = <>
                  <span className="w-8 shrink-0 font-mono text-xs tracking-widest text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mobile-menu__heading font-heading">{item.label}</span>
                </>
                const row = 'flex min-h-16 w-full items-center gap-3 py-3.5 text-left text-ink transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:py-4'
                if (item.href) return (
                  <div key={item.href} className="border-b border-line">
                    <Link href={item.href} onClick={() => setBuka(false)} aria-current={tautanAktif(item.href) ? 'page' : undefined} className={row}>
                      {label}
                      <span className="ml-auto text-xl text-ink-muted" aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                )
                const aktif = item.anak?.some(([, href]) => tautanAktif(href))
                return (
                  <details key={item.label} name="menu-mobile-sections" open={aktif || (pathname === '/' && item.label === 'Profil')}
                    className="group border-b border-line">
                    <summary className={row + ' cursor-pointer list-none [&::-webkit-details-marker]:hidden'} aria-controls={`menu-mobile-section-${index}`}>
                      {label}
                      <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink-muted" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </summary>
                    <div id={`menu-mobile-section-${index}`} className="mb-4 ml-11 grid border-l border-brand/40 pl-5 sm:grid-cols-2 sm:gap-x-8">
                      {item.anak?.map(([label, href]) => <Link key={href} href={href} onClick={() => setBuka(false)}
                        aria-current={tautanAktif(href) ? 'page' : undefined}
                        className={`flex min-h-11 items-center py-2 text-sm transition-colors hover:text-brand focus-visible:outline-none focus-visible:underline ${tautanAktif(href) ? 'font-semibold text-brand' : 'text-ink-muted'}`}>
                        {label}
                      </Link>)}
                    </div>
                  </details>
                )
              })}
            </nav>
            <Link href="/kontak" onClick={() => setBuka(false)}
              className="mt-auto flex min-h-12 items-center justify-between gap-3 rounded-full bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              Kontak &amp; kunjungan <span aria-hidden="true">&rarr;</span>
            </Link>
            <p className="pt-4 text-xs text-ink-muted">Bangsalsari · Jember</p>
          </div>
        </div>
      </dialog>
    </header>
  )
}
