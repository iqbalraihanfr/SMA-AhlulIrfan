// node tests/check-seo.mjs [site URL] — audits rendered metadata, assets, sitemap, and private routes.
import assert from 'node:assert/strict'

const site = new URL(process.argv[2] || 'https://www.smaahlulirfan.sch.id')
const decode = text => text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, value => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'" }[value]))
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1], decode(match[2] ?? match[3])]))
async function get(path, options) {
  const response = await fetch(new URL(path, site), { signal: AbortSignal.timeout(20000), ...options })
  return response
}
const robots = await get('/robots.txt')
assert.equal(robots.status, 200)
const rules = await robots.text()
assert.ok(rules.includes('Allow: /') && rules.includes(new URL('/sitemap.xml', site).href))
for (const path of ['/admin', '/api/', '/login', '/setup']) assert.ok(rules.includes(`Disallow: ${path}`))

const sitemap = await get('/sitemap.xml')
assert.equal(sitemap.status, 200)
const xml = await sitemap.text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]))
assert.ok(urls.length >= 8)
assert.equal(new Set(urls).size, urls.length)
const images = new Map(), icons = new Set(), titles = new Set()
for (const url of urls) {
  assert.equal(new URL(url).origin, site.origin, 'Sitemap must use the canonical origin')
  assert.ok(!/\/(admin|api|login|setup)(\/|$)/.test(new URL(url).pathname))
  const response = await get(url, { headers: { 'User-Agent': 'Googlebot' } })
  assert.equal(response.status, 200, url)
  const html = await response.text()
  const tags = [...html.matchAll(/<(meta|link)\b[^>]*>/g)].map(match => attributes(match[0]))
  const meta = key => tags.find(tag => tag.property === key || tag.name === key)?.content
  const canonical = tags.find(tag => tag.rel === 'canonical')?.href
  assert.equal(new URL(canonical).href, new URL(url).href, `Canonical: ${url}`)
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || '').trim()
  assert.ok(title && !titles.has(title), `Missing or duplicate title: ${url}`)
  titles.add(title)
  assert.ok(meta('description')?.trim(), `Description: ${url}`)
  assert.ok(!/noindex/.test(meta('robots') || ''), `Published page cannot be noindex: ${url}`)
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `One primary heading: ${url}`)
  assert.ok(/<html[^>]*lang="id"/.test(html))
  assert.ok(meta('og:title') && meta('og:description') && meta('og:site_name'))
  assert.equal(new URL(meta('og:url')).href, new URL(url).href)
  assert.ok(meta('og:image:alt')?.includes('Logo asli'))
  assert.equal(meta('og:image:width'), '1200')
  assert.equal(meta('og:image:height'), '630')
  assert.equal(meta('twitter:card'), 'summary_large_image')
  assert.ok(meta('twitter:title') && meta('twitter:description') && meta('twitter:image:alt')?.includes('Logo asli'))
  for (const key of ['og:image', 'twitter:image']) images.set(meta(key), url)
  for (const tag of tags.filter(tag => ['icon', 'apple-touch-icon'].includes(tag.rel))) icons.add(new URL(tag.href, site).href)
  assert.ok(!html.includes('081234567890') && !html.includes('6281234567890'), `Placeholder phone: ${url}`)
  const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
  if (new URL(url).pathname === '/') {
    const graph = structured.flatMap(data => data['@graph'] || [data])
    assert.ok(graph.some(data => data['@type'] === 'WebSite'))
    assert.ok(graph.some(data => data['@type'] === 'School' && data.logo === new URL('/logo-sma.webp', site).href))
  }
  if (new URL(url).pathname.startsWith('/berita/')) assert.ok(structured.some(data => data['@type'] === 'NewsArticle'))
  console.log(`OK ${new URL(url).pathname}`)
}
for (const [url, page] of images) {
  assert.ok(url, `Missing sharing image: ${page}`)
  const response = await get(url)
  assert.equal(response.status, 200, url)
  const png = Buffer.from(await response.arrayBuffer())
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
  assert.ok(png.length < 5 * 1024 * 1024)
}
assert.ok(icons.size >= 2, 'Favicon and Apple touch icon must be present')
for (const url of icons) assert.equal((await get(url)).status, 200, url)
for (const path of ['/admin', '/admin/berita/form', '/admin/galeri/form']) {
  const response = await get(path, { redirect: 'manual' })
  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), '/login')
}
assert.match(await (await get('/login')).text(), /name="robots" content="noindex, nofollow"/)
const missing = await get('/berita/seo-missing-resource')
assert.ok(missing.status === 404 || missing.status === 200)
assert.match(await missing.text(), /name="robots" content="noindex"/)
console.log(`SEO passed: ${urls.length} public pages; images, icons, structured data, sitemap, robots, and admin protection checked.`)
