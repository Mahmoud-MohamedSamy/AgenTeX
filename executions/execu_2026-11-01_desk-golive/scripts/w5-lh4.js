const TM = '88e8ea44-1658-4df3-9930-d0902b91073d', T = 'a9a4c545-cd24-451a-ae7d-6025f16b4797';
const del = await api('DELETE', '/modules/' + TM + '/records/' + T); out.del = del.s + ' ' + del.t.slice(0, 200);
if (del.s < 300) { await sleep(2000); const rb = await api('GET', '/audit/recycle-bin/items?limit=30&app=desk'); const it = arr(D(rb.j)).find(i => i.record_id === T); out.inBin = !!it; if (it) out.restore = (await api('POST', '/audit/recycle-bin/restore', { item_ids: [it.id], ids: [it.id] })).s; await sleep(2000); }
out.after = (await api('GET', '/modules/' + TM + '/records/' + T)).s;
await go('/settings/data/retention', 12000);
const row = page.locator('tr, [role=row], li').filter({ hasText: '#3460 QA GL W5 Imp T1' }).first();
await row.getByRole('button', { name: 'Release' }).click(); await sleep(1500);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); if (await cd.count()) { out.conf = (await cd.innerText()).replace(/\s+/g, ' ').slice(0, 200); await cd.getByRole('button', { name: /Release/ }).last().click(); } await sleep(3000);
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.list = t.slice(t.indexOf('Legal holds'), t.indexOf('Legal holds') + 300); await shot('w5/W5-48-released');
return fin({ out });
