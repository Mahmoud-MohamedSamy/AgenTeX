const CON = '4b90180b-cd0d-44e5-914b-9c9fe2c85f45';
// ticket SLA from plan


// W5-08 invite
await go('/modules/' + CM + '/customers/' + CON, 12000);
const more = page.locator('main').getByRole('button', { name: /More|actions/i }).first(); out.btns = await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(0, 30));
await more.click(); await sleep(1200); out.menu1 = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const inv = page.getByRole('menuitem', { name: /Invite to Help Center/i }).first();
if (await inv.count()) { await inv.click(); await sleep(2000); const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); const n0 = NET.length; await d.getByRole('button', { name: /^(Invite|Send invitation|Send)/i }).last().click().catch(e => out.invErr = e.message.slice(0, 80)); await sleep(5000); out.invNet = NET.slice(n0).filter(x => x.m !== 'GET').map(x => x.m + ' ' + x.u.replace(/^https:\/\/[^/]+/, '') + ' ' + x.s + ' ' + x.t.slice(0, 200)); }
else await page.keyboard.press('Escape');
await go('/modules/' + CM + '/customers/' + CON, 12000); out.page = ((await mtxt()).match(/.{0,60}(Help Center|portal|invited|Invitation).{0,80}/gi) || []).slice(0, 5);
await more.click().catch(() => {}); await sleep(1200); out.menu2 = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5r/W5-08-contact-menu-after'); await page.keyboard.press('Escape');
// Help Center users page
for (const u of ['/settings/channels/help-center/users', '/settings/channels/help-center', '/settings/help-center/users']) { await go(u, 9000); const t = await mtxt(); out['hc ' + u] = page.url().replace(H, '') + ' | ' + t.slice(0, 300); if (/qa-gl-w5r|users/i.test(t)) { await shot('w5r/W5-08-hc-' + u.split('/').pop()); } }
return fin({ out });
