const o = {};
await go('/approvals'); await sleep(5000);
const globe = page.getByRole('button', { name: /^(EN|English|Language)/i }).first(); o.globe = await globe.count();
if (!o.globe) { const g2 = page.locator('header button').filter({ hasText: /^\s*EN\s*$/ }).first(); o.globe2 = await g2.count(); if (o.globe2) await g2.click(); } else await globe.click();
await sleep(1200); o.menu = (await page.getByRole('menu').first().innerText().catch(() => page.getByRole('listbox').first().innerText().catch(() => ''))).slice(0, 200);
const ar = page.getByText(/العربية/).first(); o.arOpt = await ar.count(); if (o.arOpt) { await ar.click(); await sleep(5000); }
o.dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
o.lang = await page.evaluate(() => document.documentElement.lang);
const t = await page.locator('[data-testid="approvals-page"]').innerText().catch(() => ''); o.pageText = t.slice(0, 1300);
o.englishLeft = [...new Set((t.replace(/QA PA[^\n]*/g, '').match(/\b(Approvals|Waiting for me|Requested by me|Decided by me|Approve|Reject|Source|Overdue|Pending|Manual|Web form|Blueprint|Department|Status|Actions|Requested)\b/g) || []))];
o.numbersLtr = await page.locator('[data-testid^="approval-ticket-link-"]').first().evaluate(e => getComputedStyle(e).direction + ' ' + (e.closest('[dir]') ? e.closest('[dir]').getAttribute('dir') : '') + ' ' + e.innerText).catch(() => null);
await shot('ui12-B-approvals-ar');
const row = page.locator('[data-testid^="approval-row-"]').first(); await row.click(); await sleep(3000);
o.detail = (await page.locator('[data-testid="approval-detail"]').innerText().catch(() => '')).slice(0, 700); await shot('ui12-B-detail-ar');
await page.setViewportSize({ width: 400, height: 860 }); await page.keyboard.press('Escape'); await go('/approvals'); await sleep(4000); o.phoneScrollX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); await shot('ui12-B-ar-phone');
return o;
