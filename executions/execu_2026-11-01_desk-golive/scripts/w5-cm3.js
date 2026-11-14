const MID = '01f7df91-4300-495f-ae3e-5de49189195a';
await go('/settings/modules-and-fields', 12000);
const row = page.locator('tr, [role=row]').filter({ hasText: 'QA GL W5 Modules' }).first(); out.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.rb = await row.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
await row.getByRole('button').last().click().catch(() => {}); await sleep(1200); out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: /Delete/ }).click().catch(e => out.mErr = e.message.slice(0, 60)); await sleep(1500);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-51-delete-confirm');
const inp = cd.locator('input'); if (await inp.count()) { await inp.first().fill('QA GL W5 Modules'); await sleep(500); }
const n0 = NET.length; await cd.getByRole('button', { name: /Delete/ }).last().click().catch(e => out.dErr = e.message.slice(0, 60)); await sleep(5000);
out.del = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 160));
out.after = (await api('GET', '/modules/' + MID + '/records?limit=1')).s; out.listed = (await mtxt()).includes('QA GL W5 Modules');
return fin({ out });
