// NDC-1316: select the two QA RT 1302 move deals → Mass Update → Pipeline.
await page.keyboard.press('Escape'); await sleep(300); await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {}); await sleep(800);
const rows = page.locator('tbody tr').filter({ hasText: 'QA RT 1302 move' });
const n = await rows.count(); for (let i = 0; i < n; i++) { await rows.nth(i).locator('input[type=checkbox]').first().check({ force: true }); await sleep(300); }
await sleep(800);
const bar = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(t => /mass|update|selected|action|delete/i.test(t)).slice(0, 12));
await shot('1316-01-selected');
return done({ n, bar });
