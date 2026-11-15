const CON = '4b90180b-cd0d-44e5-914b-9c9fe2c85f45';
await go('/settings/channels/help-center/users', 10000);
const row = page.locator('tr').filter({ hasText: 'qa-gl-w5r-c1@example.com' }).first();
out.rowBtns = await row.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
await row.getByRole('button').last().click().catch(e => out.e = e.message.slice(0, 60)); await sleep(1500);
out.rowMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5r/W5-08-hc-user-menu'); await page.keyboard.press('Escape');
await go('/modules/' + CM + '/customers/' + CON, 12000); out.page = ((await mtxt()).match(/.{0,60}(Help Center|portal|invited|Invitation).{0,80}/gi) || []).slice(0, 5);
await page.locator('main').getByRole('button', { name: /More|actions/i }).first().click(); await sleep(1200); out.menu2 = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5r/W5-08-contact-after'); await page.keyboard.press('Escape');
return fin({ out });
