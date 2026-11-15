const R = {};
await page.goto(H + '/modules/' + MID + '/records', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.getByRole('button', { name: 'List view' }).click(); await sleep(4000);
R.tag = await page.evaluate(() => { const e = document.elementFromPoint(1280, 97); return e ? e.tagName + ' ' + (e.getAttribute('role') || '') + ' ' + (e.closest('select') ? 'SELECT' : '') : null; });
const sel = page.locator('select').filter({ hasText: 'Standard' }).first();
if (await sel.count()) { R.opts = await sel.locator('option').allInnerTexts(); await sel.selectOption({ label: 'QA RT18 Layout' }); }
else { await page.mouse.click(1280, 97); await sleep(1200); R.opts = await page.getByRole('option').allInnerTexts(); await page.getByRole('option', { name: 'QA RT18 Layout' }).first().click(); }
await sleep(6000);
R.rows = (await page.locator('main tbody tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').slice(0, 70)).slice(0, 5);
const rowsQ = page.locator('main tbody tr', { hasText: /QA RT18 (mass2|E6 keep)/ }); R.n = await rowsQ.count();
for (let i = 0; i < R.n; i++) await rowsQ.nth(i).locator('input[type=checkbox], button[role=checkbox]').first().click();
await sleep(1500);
R.btns = (await page.locator('main button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean))).filter(s => !/^(Edit field|Row actions|Sort by)/.test(s)).slice(0, 30);
await shot('2974-1-selected.png');
return R;
