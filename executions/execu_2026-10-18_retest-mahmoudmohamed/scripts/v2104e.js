// NDC-2104 round 2: UI evidence — view grid with "Last Activity is today", and Work Queue My Leads Last Activity column.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = {};
await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 });
for (let i = 0; i < 40; i++) { await sleep(1000); const t = await txt(); if (/QA RT tz-day/.test(t) && /\d+ records?/.test(t) && !/Loading/.test(t)) break; }
await sleep(2500); out.grid = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
await shot('NDC-2104-r2-view-today');
const e = page.getByRole('button', { name: /Edit view|Edit criteria|Criteria/i }).first(); out.editBtn = await e.count();
if (out.editBtn) { await e.click(); await sleep(3000); out.editor = (await page.locator('[role=dialog], main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 800); await shot('NDC-2104-r2-criteria'); await page.keyboard.press('Escape'); await sleep(800); }
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^My Leads/ }).first().click();
const row = page.locator('main tbody tr', { hasText: 'QA RT tz L2' }).first();
for (let i = 0; i < 30 && !(await row.count()); i++) await sleep(1000);
out.wqHead = (await page.locator('main thead').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
out.wqL2 = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.wqL1 = (await page.locator('main tbody tr', { hasText: 'QA RT tz L1' }).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
if (await row.count()) await row.scrollIntoViewIfNeeded();
await shot('NDC-2104-r2-workqueue');
return done(out);
