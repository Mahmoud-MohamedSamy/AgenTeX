// NDC-2104 round 2: open the view's criteria editor to show "Last Activity — Today".
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = {};
await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 });
for (let i = 0; i < 40; i++) { await sleep(1000); const t = await txt(); if (/QA RT tz-day/.test(t) && /\d+ records?/.test(t) && !/Loading/.test(t)) break; }
await page.getByRole('button', { name: /QA RT tz-day/ }).first().click(); await sleep(1500);
out.menu = (await page.locator('[role=menu], [role=listbox], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const ed = page.getByRole('menuitem', { name: /Edit/i }).first(); out.ed = await ed.count();
if (!out.ed) { await page.keyboard.press('Escape'); await page.locator('button:has-text("…"), button[aria-label*="ore"]').first().click().catch(() => {}); await sleep(1200); out.menu2 = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); }
const ed2 = page.getByRole('menuitem', { name: /Edit/i }).first();
if (await ed2.count()) { await ed2.click(); await sleep(5000); out.editor = (await page.locator('main, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); await shot('NDC-2104-r2-criteria'); }
return done(out);
