'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type MenuItem = {
  label: string
  href?: string
  anak?: [string, string][]
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
          className="rounded-md p-2 text-ink-muted transition hover:bg-paper-sunken hover:text-ink lg:hidden"
        >
          <span className="sr-only">{buka ? 'Tutup menu' : 'Buka menu'}</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            {!buka ? (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            ) : (
              <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
            )}
          </svg>
        </button>
      </nav>

      {buka && (
        <div id="menu-mobile" className="border-t border-line bg-paper lg:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            {menu.map((item, index) => {
              if (item.href) {
                const aktif = tautanAktif(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setBuka(false)}
                      aria-current={aktif ? 'page' : undefined}
                      className={`block rounded-md px-3 py-3 text-sm font-semibold ${
                        aktif ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-paper-sunken'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              } else {
                return (
                  <li key={index} className="pt-2">
                    <p className="px-3 pb-1 text-xs font-bold uppercase tracking-widest text-ink-muted">{item.label}</p>
                    <ul>
                      {item.anak?.map(([label, tautan]) => {
                        const subAktif = tautanAktif(tautan)
                        return (
                          <li key={tautan}>
                            <Link
                              href={tautan}
                              onClick={() => setBuka(false)}
                              aria-current={subAktif ? 'page' : undefined}
                              className={`block rounded-md px-3 py-3 text-sm ${
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
                  </li>
                )
              }
            })}
          </ul>
        </div>
      )}
    </header>
  )
}

