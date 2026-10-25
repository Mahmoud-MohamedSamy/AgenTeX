const out = {};
let dlg = page.locator('[role=dialog]').last();
if (!(await dlg.count())) { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(700); await page.getByText('Manage Columns', { exact: true }).click(); await sleep(1500); dlg = page.locator('[role=dialog]').last(); }
const s = dlg.locator('input').first(); await s.fill(''); await sleep(300);
out.manage = (await dlg.innerText()).slice(0, 600);
out.buttons = await dlg.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.title || e.innerText.trim()).slice(0, 40)).filter(Boolean));
await s.fill('Pri'); await sleep(700); out.afterType = await dlg.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.title || e.innerText.trim()).slice(0, 40)).filter(Boolean).slice(0, 8));
await shot('1819-07-manage-columns');
const cl = dlg.locator('button[aria-label*="lear" i], button[title*="lear" i]').first(); if (await cl.count()) { await cl.click(); await sleep(400); } out.searchAfterClear = await s.inputValue();
const close = dlg.getByRole('button', { name: /Cancel|Close|Done/ }).first(); await close.click(); await sleep(800);
out.closed = !(await page.locator('[role=dialog]').count());
return done(out);
