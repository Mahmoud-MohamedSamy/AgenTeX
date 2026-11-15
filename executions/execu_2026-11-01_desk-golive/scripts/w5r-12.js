const CON = '4b90180b-cd0d-44e5-914b-9c9fe2c85f45';
await go('/modules/' + CM + '/customers/' + CON, 12000);
await page.locator('main').getByRole('button', { name: /More|actions/i }).first().click(); await sleep(1200);
await page.getByRole('menuitem', { name: /Invite to Help Center/i }).first().click(); await sleep(2000);
const d = page.locator('[role=dialog]').last(); await shot('w5r/W5-08-invite-dialog');
const fn = d.getByLabel(/First name/i).first(); if (await fn.count() && !(await fn.inputValue())) await fn.fill('QA GL W5R');
const ln = d.getByLabel(/Last name/i).first(); if (await ln.count() && !(await ln.inputValue())) await ln.fill('Contact');
const n0 = NET.length; await d.getByRole('button', { name: /Send invitations/i }).click().catch(e => out.e = e.message.slice(0, 80)); await sleep(6000);
out.dlgAfter = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
out.net = NET.slice(n0).filter(x => x.m !== 'GET').map(x => x.m + ' ' + x.u.replace(/^https:\/\/[^/]+/, '') + ' ' + x.s + ' ' + x.t.slice(0, 250));
await page.keyboard.press('Escape');
await go('/modules/' + CM + '/customers/' + CON, 12000); out.page = ((await mtxt()).match(/.{0,60}(Help Center|portal|invited|Invitation).{0,80}/gi) || []).slice(0, 5);
await page.locator('main').getByRole('button', { name: /More|actions/i }).first().click(); await sleep(1200); out.menu2 = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); await shot('w5r/W5-08-contact-after');
await go('/settings/channels/help-center/users', 10000); out.users = (await mtxt()).slice(0, 900);
const row = page.locator('tr').filter({ hasText: 'qa-gl-w5r-c1@example.com' }).first();
if (await row.count()) { await row.getByRole('button').last().click().catch(() => {}); await sleep(1500); out.rowMenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5r/W5-08-hc-user-menu'); await page.keyboard.press('Escape'); }
return fin({ out });
