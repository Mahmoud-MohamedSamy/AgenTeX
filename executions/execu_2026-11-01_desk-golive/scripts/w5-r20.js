const body = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const c = t.indexOf('Email Providers'); return c > 0 ? t.slice(c + 15, c + 900) : t.slice(0, 900); };
const menu = async label => { await go('/settings/data/import', 5000); await page.getByRole('button', { name: label, exact: true }).first().click(); for (let i = 0; i < 10; i++) { await sleep(1500); if ((await body()).length > 200) break; } };
// W5-08 contact page: portal access
await go('/customers/' + C1, 12000); out.w08 = (await mtxt()).slice(0, 500);
const acts = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean)); out.w08btns = acts.slice(0, 40);
const more = page.locator('main').getByRole('button', { name: /More|actions/i }).first(); if (await more.count()) { await more.click(); await sleep(1200); out.w08menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); }
await shot('w5/W5-08-contact');
// W5-63b custom actions, W5-66 signals
await menu('Custom Actions'); out.w63 = page.url().replace(H, '') + ' | ' + await body(); await shot('w5/W5-63-custom-actions');
await menu('Signals'); out.w66 = page.url().replace(H, '') + ' | ' + await body(); await shot('w5/W5-66-signals');
await menu('Audit Log'); await sleep(4000); out.w68 = page.url().replace(H, '') + ' | ' + await body(); await shot('w5/W5-68-audit');
// W5-57 field dependency on tickets
await menu('Modules and Fields'); await page.getByText('Tickets', { exact: true }).first().click().catch(() => {}); await sleep(6000); out.w57 = page.url().replace(H, '') + ' | ' + (await body()).slice(0, 600);
out.w57tabs = await page.locator('main').last().getByRole('tab').allInnerTexts().catch(() => []); await shot('w5/W5-57-tickets-module');
// W5-70/71 profile menu
await page.getByRole('button', { name: 'Open profile' }).click(); await sleep(1500); out.profileMenu = (await page.locator('[role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-70-profile-menu'); await page.keyboard.press('Escape');
return fin({ out });
