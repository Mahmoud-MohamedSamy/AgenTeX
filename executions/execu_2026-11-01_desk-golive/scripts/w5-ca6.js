await page.goto(H + '/views/all/tickets/f64e2ab2-83ae-4ec8-9441-ee94d302d8bd', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(1000); if ((await page.locator('body').innerText()).includes('#3403')) break; } await sleep(3000);
const b = page.getByRole('button', { name: /Custom actions|Actions|Run action/i }); out.btns = await b.evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
const ca = page.getByRole('button', { name: /Custom actions/i }).first(); if (await ca.count()) { await ca.click(); await sleep(2000); out.menu = (await page.locator('[role=menu], [role=dialog], [role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-64-on-ticket'); await page.keyboard.press('Escape'); }
else { const mo = page.getByRole('button', { name: /^More/ }).first(); if (await mo.count()) { await mo.click(); await sleep(1500); out.more = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-64-on-ticket'); await page.keyboard.press('Escape'); } }
out.has = (await page.locator('body').innerText()).includes('QA GL W5 action');
out.delA = (await api('DELETE', '/workflow/custom-actions/dbbec2ff-298e-4f34-afbf-1a5d4ecf9084')).s; out.delS = (await api('DELETE', '/workflow/custom-actions/sources/339edf86-e0cf-4d8c-b25a-6f0c37f7b8e4')).s;
out.getA = (await api('GET', '/workflow/custom-actions/dbbec2ff-298e-4f34-afbf-1a5d4ecf9084')).s;
return fin({ out });
