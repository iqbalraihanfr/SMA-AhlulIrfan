export function SectionHeading({
  kicker,
  judul,
  keterangan,
  tengah = false,
}: {
  kicker?: string
  judul: string
  keterangan?: string
  tengah?: boolean
}) {
  return (
    <div className={`section-heading ${tengah ? 'mx-auto text-center' : ''}`}>
      {kicker && <p className="section-heading__kicker">{kicker}</p>}
      <h2 className="section-heading__title">{judul}</h2>
      {keterangan && (
        <p className={`section-heading__copy ${tengah ? 'mx-auto' : ''}`}>{keterangan}</p>
      )}
    </div>
  )
}
