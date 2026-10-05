// playwright-cli run-code --filename tests/check-news-layout.js
async (page) => {
  const assert = { ok(value, message) { if (!value) throw new Error(message); }, equal(actual, expected, message) { if (actual !== expected) throw new Error(message); } };
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const cards = await page.locator('article').evaluateAll(elements => elements.filter(element => element.querySelector('[id^="berita-"]')).map(card => {
      const rect = card.getBoundingClientRect(), title = card.querySelector('h3').getBoundingClientRect();
      const summary = card.querySelector('p')?.getBoundingClientRect();
      const image = card.querySelector('.media-frame').getBoundingClientRect();
      return { title: card.querySelector('h3').textContent, bottom: rect.bottom, titleBottom: title.bottom,
        summaryBottom: summary?.bottom, imageRatio: image.width / image.height, links: card.querySelectorAll('a').length };
    }));
    if (!cards.length) assert.ok(await page.getByText('Belum ada berita', { exact: true }).count(), 'Empty state must explain that there are no published stories');
    for (const card of cards) {
      assert.ok(card.title.trim());
      assert.ok(card.titleBottom <= card.bottom, `Headline clipped at ${width}px`);
      if (card.summaryBottom) assert.ok(card.summaryBottom <= card.bottom, `Summary clipped at ${width}px`);
      assert.ok(Math.abs(card.imageRatio - 1.6) < 0.03, `Image proportion at ${width}px`);
      assert.equal(card.links, 1, 'Each card should have one keyboard focus target');
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    console.log(`${width}px: ${cards.length} news cards checked`);
  }
}
