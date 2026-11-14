const wz = async () => { const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('Email Providers'); return t.slice(i > 0 ? i + 15 : -1500).slice(0, 1500); };
await go('/settings/data/import', 10000);
await page.getByRole('button', { name: /^Import history$/ }).first().click(); await sleep(5000);
const row = page.locator('tr, [role=row]').filter({ hasText: 'w5-contacts.csv' }).first();
await row.getByRole('button', { name: 'Manage' }).click(); await sleep(4000);
out.manage = await wz(); out.btns = await page.getByRole('button').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(x => /undo|revert|roll/i.test(x)));
await shot('w5/W5-36-manage');
const ub = page.getByRole('button', { name: /Undo/ }).first();
if (await ub.count()) { await ub.click(); await sleep(2000); const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
  const n0 = NET.length; await cd.getByRole('button', { name: /Undo/ }).last().click().catch(e => out.uErr = e.message.slice(0, 60)); await sleep(8000);
  out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 120)); out.after = await wz(); await shot('w5/W5-36-undone'); }
for (const id of ['67d7f0e6-e5e6-45e9-9bdf-2ef4cae3564b', '3b33f689-8a3f-4793-a16d-415a458df952']) out['c' + id.slice(0, 4)] = (await api('GET', '/modules/' + CM + '/records/' + id)).s;
return fin({ out });
