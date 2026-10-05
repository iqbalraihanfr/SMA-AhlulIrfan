import { cleanHtml } from '@/lib/konten'

export function Prosa({ html, className = '' }: { html?: string | null; className?: string }) {
  if (!html) return null
  const cleaned = cleanHtml(html)
  return (
    <div
      className={`prose-school ${className}`}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  )
}
