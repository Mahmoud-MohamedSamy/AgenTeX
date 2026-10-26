const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
const idx = await page.evaluate(() => [...document.querySelectorAll('thead th')].findIndex(t => t.innerText.trim() === 'Pipeline'));
const cell = page.locator('tbody tr').filter({ hasText: 'QA RT 1302 move' }).first().locator('td').nth(idx);
await cell.hover(); await cell.getByRole('button', { name: 'Edit field' }).click({ force: true }); await sleep(1500);
const opts = await page.evaluate(() => [...document.querySelectorAll('[role=option],[role=menuitem]')].map(e => e.innerText.trim()));
const dlg0 = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 300) || null);
await shot('1324-03-inline-options');
const one = page.locator('[role=option],[role=menuitem]').filter({ hasText: /^1$/ }).first();
let dlg = null, resp = [], toasts = [];
if (await one.count()) {
  await one.click(); await sleep(1500); dlg = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 400) || null); await shot('1324-04-modal');
  const f = async r => { const q = r.request(); if (/records/.test(q.url()) && q.method() !== 'GET') resp.push(q.method() + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 200)); }; page.on('response', f);
  const ok = page.getByRole('dialog').getByRole('button', { name: /Change pipeline|Save|Apply/ }).last(); if (await ok.count()) { await ok.click(); await sleep(4000); }
  page.off('response', f); toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim())); await shot('1324-05-after');
  await page.keyboard.press('Escape');
}
const stored = Object.fromEntries(((await api('GET', `/modules/${D}/records/${ID}`)).j?.data?.data || []).filter(x => /^(pipeline|stage)$/.test(x.field)).map(x => [x.field, x.value.value]));
return done({ opts, dlg0, dlg, resp, toasts, stored });
