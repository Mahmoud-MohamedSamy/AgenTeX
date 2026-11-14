const body = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const c = t.indexOf('Email Providers'); return c > 0 ? t.slice(c + 15, c + 900) : t.slice(0, 900); };
// W5-57 tickets module in Modules and Fields
await go('/settings/modules-and-fields', 12000);
await page.locator('main tr, main [role=row]').filter({ hasText: /^Tickets/ }).first().click().catch(async () => await page.locator('main').getByText('Tickets', { exact: true }).last().click()); await sleep(8000);
out.w57url = page.url().replace(H, ''); out.w57 = (await body()).slice(0, 500); out.w57tabs = await page.getByRole('tab').allInnerTexts().catch(() => []);
out.w57dep = (await page.locator('body').innerText()).match(/[^.]{0,40}(Dependen|dependen)[^.]{0,80}/g); await shot('w5/W5-57-tickets-module');
// W5-68 audit log filter by user
await go('/settings/security/audit-log', 12000); out.w68f = await page.locator('main').last().getByRole('button').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(x => /All |Any time|Export/.test(x)));
await page.getByRole('button', { name: /^All Actions$/ }).click().catch(() => {}); await sleep(1500); out.w68actions = (await page.locator('[role=listbox], [role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); await page.keyboard.press('Escape');
// W5-71 my profile, W5-70 accessibility
await page.getByRole('button', { name: 'Open profile' }).click(); await sleep(1500); await page.getByText('My Profile', { exact: true }).click(); await sleep(8000); out.w71 = page.url().replace(H, '') + ' | ' + (await body()).slice(0, 700); await shot('w5/W5-71-profile');
await page.getByRole('button', { name: 'Open profile' }).click(); await sleep(1500); await page.getByText('Accessibility', { exact: true }).last().click(); await sleep(6000); out.w70 = page.url().replace(H, '') + ' | ' + (await body()).slice(0, 900); await shot('w5/W5-70-accessibility');
return fin({ out });
