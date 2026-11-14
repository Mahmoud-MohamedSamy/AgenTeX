await go('/settings/data/import', 10000);
await page.getByRole('button', { name: /^Import history$/ }).first().click(); await sleep(5000);
const row = page.locator('tr, [role=row]').filter({ hasText: 'w5-contacts.csv' }).first(); out.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.rowBtns = await row.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
await row.getByRole('button').last().click().catch(() => {}); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const u = page.getByRole('menuitem', { name: /Undo/ }).first(); if (await u.count()) { await u.click(); await sleep(1500); } else { const b = row.getByRole('button', { name: /Undo/ }); if (await b.count()) await b.click(); await sleep(1500); }
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
const n0 = NET.length; await cd.getByRole('button', { name: /Undo/ }).last().click().catch(e => out.uErr = e.message.slice(0, 60));
for (let i = 0; i < 15; i++) { await sleep(3000); if (/Undone/.test(await row.innerText().catch(() => ''))) break; }
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s);
out.rowAfter = (await row.innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5/W5-36-undone');
for (const id of ['67d7f0e6-e5e6-45e9-9bdf-2ef4cae3564b', '3b33f689-8a3f-4793-a16d-415a458df952']) out['c' + id.slice(0, 4)] = (await api('GET', '/modules/' + CM + '/records/' + id)).s;
return fin({ out });
