const fb = page.getByRole('button', { name: /^Filter/ }).first(); await fb.click(); await sleep(1500);
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(1000);
await page.locator('[role=option], [role=listbox] li, [role=menuitem]').filter({ hasText: /^Created By$/ }).first().click(); await sleep(1500);
const row = await page.locator('main').innerText(); const seg = row.split('Created By')[1]?.slice(0, 300);
await shot('1788-06-created-by');
// pick the user value
const pick = page.locator('main input:not([type=checkbox])').last(); let picked = 'n/a';
const lbl = page.locator('label').filter({ hasText: /mahmoud\.mahamed1515/ }).first();
if (await lbl.count()) { await lbl.click(); picked = 'checkbox'; } else { await pick.click().catch(() => {}); await sleep(800); const o = page.locator('[role=option]').filter({ hasText: /mahmoud\.mahamed1515/ }).first(); if (await o.count()) { await o.click(); picked = 'option'; } }
await sleep(3500);
const tr = (await txt()).match(/Total Records (\d+)/);
await shot('1788-07-created-by-me');
await page.getByRole('button', { name: /Clear filters/ }).click().catch(() => {}); await sleep(2000);
return done({ seg, picked, total: tr && tr[1] });
