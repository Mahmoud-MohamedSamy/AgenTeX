const histRow = await page.locator('tr').filter({ hasText: 'QA-RT-leads-imp.xlsx' }).first().innerText().catch(() => 'n/a');
await shot('1587-03-history-after-undo');
await go('/settings', 9000);
await page.getByText('Recycle Bin', { exact: true }).first().click(); await sleep(8000);
const s = page.getByPlaceholder(/Search/i).last(); if (await s.count()) { await s.fill('QA RT imp'); await sleep(3000); }
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 1500);
await shot('1587-04-recycle-bin');
return done({ histRow, url: page.url(), t });
