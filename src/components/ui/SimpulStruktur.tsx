export type SimpulOrganisasi = {
  id: number
  label: string
  guru_id?: number | null
  atasan_id?: number | null
  tipe?: 'orang' | 'kelompok' | 'penasihat' | string | null
  nama_luar?: string | null
  baris?: number | null
  urutan?: number | null
  guru?: { nama: string } | null
  anak?: SimpulOrganisasi[]
}

export function SimpulStruktur({ simpul }: { simpul: SimpulOrganisasi }) {
  const nama = simpul.guru?.nama || simpul.nama_luar
  const samping = simpul.anak?.filter((a) => a.tipe === 'penasihat') || []
  const bawahan = simpul.anak?.filter((a) => a.tipe !== 'penasihat') || []

  // Kelompokkan anak bawah berdasarkan `baris`
  const barisMap = new Map<number, SimpulOrganisasi[]>()
  for (const anak of bawahan) {
    const barisKey = anak.baris || 1
    if (!barisMap.has(barisKey)) {
      barisMap.set(barisKey, [])
    }
    barisMap.get(barisKey)!.push(anak)
  }

  // Urutkan nomor baris
  const barisKeys = Array.from(barisMap.keys()).sort((a, b) => a - b)

  return (
    <li className="struktur-simpul">
      <div className="struktur-simpul__kepala">
        <div className="struktur-kartu surface-card px-4 py-3 text-center">
          <p className="font-heading text-sm font-semibold text-ink-deep">{simpul.label}</p>
          {nama && <p className="mt-0.5 text-xs text-ink-muted">{nama}</p>}
        </div>

        {samping.map((penasihat) => {
          const namaPenasihat = penasihat.guru?.nama || penasihat.nama_luar
          return (
            <div
              key={penasihat.id}
              className="struktur-penasihat rounded-md border border-dashed border-line-strong bg-paper-raised px-4 py-3 text-center"
            >
              <p className="font-heading text-sm font-semibold text-ink-deep">{penasihat.label}</p>
              {namaPenasihat && (
                <p className="mt-0.5 text-xs text-ink-muted">{namaPenasihat}</p>
              )}
            </div>
          )
        })}
      </div>

      {barisKeys.map((barisNum, idx) => (
        <ul key={barisNum} className="struktur-baris" data-baris={idx + 1}>
          {barisMap.get(barisNum)!.map((anak) => (
            <SimpulStruktur key={anak.id} simpul={anak} />
          ))}
        </ul>
      ))}
    </li>
  )
}
