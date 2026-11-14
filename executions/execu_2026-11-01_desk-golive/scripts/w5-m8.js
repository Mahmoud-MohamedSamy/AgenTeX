const row = page.locator('tr').filter({ hasText: 'w5-contacts.csv' }).first();
await row.locator('button').last().click(); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: /Undo/ }).first().click(); await sleep(2000);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-36-confirm');
const n0 = NET.length; await cd.getByRole('button', { name: /Undo/ }).last().click().catch(e => out.uErr = e.message.slice(0, 60));
for (let i = 0; i < 15; i++) { await sleep(3000); if (/Undone/.test(await row.innerText().catch(() => ''))) break; }
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 120));
out.rowAfter = (await row.innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5/W5-36-undone');
for (const id of ['67d7f0e6-e5e6-45e9-9bdf-2ef4cae3564b', '3b33f689-8a3f-4793-a16d-415a458df952']) out['c' + id.slice(0, 4)] = (await api('GET', '/modules/' + CM + '/records/' + id)).s;
return fin({ out });
