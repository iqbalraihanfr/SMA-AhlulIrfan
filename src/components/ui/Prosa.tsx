import sanitizeHtml from 'sanitize-html'

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
