// Log in first, then: playwright-cli run-code --filename tests/check-admin-feedback.js
async (page) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const site = new URL(page.url()).origin;
  await page.goto(`${site}/admin/berita`);
  const deleteButton = page.getByRole('button', { name: 'Hapus', exact: true }).first();
  if (await deleteButton.count()) {
    await page.route('**/api/admin/berita/*', route => route.fulfill({ status: 503, json: { error: 'Simulated failure' } }));
    try {
      page.once('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.getByRole('alert').filter({ hasText: 'Muat ulang halaman sebelum mencoba lagi' }).waitFor();
      if (!await deleteButton.isEnabled()) throw new Error('Delete must allow retry after an error');
    } finally { await page.unroute('**/api/admin/berita/*'); }
  }
  await page.goto(`${site}/admin/guru/form`);
  await page.locator('input[type="file"]').evaluate(input => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([new Uint8Array(6 * 1024 * 1024)], 'oversize.jpg', { type: 'image/jpeg' }));
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.getByRole('alert').filter({ hasText: 'Foto terlalu besar' }).waitFor();
  await page.route('**/api/auth/logout', route => route.fulfill({ status: 503, json: { error: 'Simulated failure' } }));
  try {
    await page.getByRole('button', { name: 'Keluar', exact: true }).click();
    await page.getByRole('alert').filter({ hasText: 'Belum berhasil keluar' }).waitFor();
    if (!page.url().includes('/admin')) throw new Error('Failed logout must keep the current page');
  } finally { await page.unroute('**/api/auth/logout'); }
  await page.getByRole('button', { name: 'Keluar', exact: true }).click();
  await page.waitForURL(`${site}/login`);
  await page.goto(`${site}/admin`);
  await page.waitForURL(`${site}/login`);
}
