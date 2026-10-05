// Run after opening the site with playwright-cli:
// playwright-cli run-code --filename tests/check-mobile-menu.js
async (page) => {
  const origin = new URL(page.url()).origin
  const assert = (condition, message) => { if (!condition) throw new Error(message) }
  const dialog = page.locator('#menu-mobile')
  const open = async () => {
    await page.getByRole('button', { name: 'Buka menu', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('#menu-mobile').matches(':modal'))
    await dialog.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))) })
  }
  const close = async () => {
    await page.keyboard.press('Escape')
    await page.waitForFunction(() => !document.querySelector('#menu-mobile').open && document.body.style.overflow !== 'hidden')
    await dialog.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))) })
  }
  await page.goto(origin)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 })
    await open()
    assert(await dialog.evaluate(el => el.getBoundingClientRect().width === innerWidth && el.scrollWidth <= innerWidth), `Menu overflows at ${width}px`)
    assert(await page.evaluate(() => document.body.style.overflow === 'hidden'), 'Background scroll unlocked')
    assert(await dialog.evaluate(el => getComputedStyle(el).transitionDuration.includes('0.68s')), 'Panel transition missing')
    assert(await dialog.locator('nav > *').first().evaluate(el => getComputedStyle(el).animationName === 'mobile-menu-item-in'), 'Row animation missing')
    for (let i = 0; i < 24; i++) {
      await page.keyboard.press(i < 16 ? 'Tab' : 'Shift+Tab')
      // Native dialogs allow a tab stop in browser chrome, represented by body.
      assert(await dialog.evaluate(el => el.contains(document.activeElement) || document.activeElement === document.body), 'Keyboard reached background content')
    }
    await close()
    assert(await page.getByRole('button', { name: 'Buka menu', exact: true }).evaluate(el => el === document.activeElement), 'Focus did not return to trigger')
  }
  await page.setViewportSize({ width: 390, height: 520 })
  await page.evaluate(() => window.scrollTo(0, 250))
  const scroll = await page.evaluate(() => scrollY)
  await open()
  await dialog.locator('summary').filter({ hasText: 'Akademik' }).click()
  assert(await dialog.locator('details[open]').count() === 1, 'Accordion groups overlap')
  const contact = dialog.getByRole('link', { name: 'Kontak & kunjungan' })
  await contact.scrollIntoViewIfNeeded()
  assert(await contact.isVisible(), 'Bottom action inaccessible on short screen')
  await close()
  assert(await page.evaluate(() => scrollY) === scroll, 'Closing menu moved background page')
  await open()
  await dialog.getByRole('link', { name: 'Guru & Tenaga Kependidikan' }).click()
  await page.waitForURL('**/guru')
  await page.waitForFunction(() => !document.querySelector('#menu-mobile').open && document.body.style.overflow !== 'hidden')
  await open()
  await page.setViewportSize({ width: 1280, height: 844 })
  await page.waitForFunction(() => !document.querySelector('#menu-mobile').open && document.body.style.overflow !== 'hidden')
  assert(!await page.getByRole('button', { name: 'Buka menu', exact: true }).isVisible(), 'Mobile trigger visible on desktop')
  await page.getByRole('button', { name: 'Akademik', exact: true }).hover()
  assert(await page.getByRole('navigation', { name: 'Navigasi utama' }).getByRole('link', { name: 'Guru & Tenaga Kependidikan' }).isVisible(), 'Desktop dropdown broke')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open()
  assert(await dialog.evaluate(el => getComputedStyle(el).transitionDuration.split(',').every(value => parseFloat(value) <= 0.001)), 'Reduced motion ignored')
  assert(await dialog.locator('nav > *').first().evaluate(el => getComputedStyle(el).animationName === 'none'), 'Reduced motion still animates rows')
  await dialog.getByRole('button', { name: 'Tutup menu', exact: true }).click()
  await page.waitForFunction(() => !document.querySelector('#menu-mobile').open)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  return 'PASS: mobile sizing, animations, accordion, scrolling, keyboard, navigation, desktop and reduced motion'
}
