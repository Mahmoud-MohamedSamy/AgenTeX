const d = page.locator('[role=dialog]').last();
await page.getByLabel('Select QA GL W5 Imp T1').check(); await sleep(800);
const sb = page.locator('[role=dialog]').last().getByRole('button', { name: /^(Select|Choose|Done|Add|Confirm)/ }); out.selBtns = await page.locator('[role=dialog]').last().getByRole('button').allInnerTexts(); if (await sb.count()) { await sb.last().click(); await sleep(1500); }
const d2 = page.locator('[role=dialog]').last(); out.d2 = (await d2.innerText()).replace(/s+/g, ' ').slice(0, 300);
await d2.locator('textarea').fill('QA GL W5 legal hold test');
let n0 = NET.length; await d2.getByRole('button', { name: 'Place hold' }).click(); await sleep(3000);
out.place = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
const m = out.place.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) CREATED.push({ kind: 'legal-hold', id: m[1], name: 'QA GL W5 legal hold' }); out.hid = m && m[1];
const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.list = t.slice(t.indexOf('Legal holds'), t.indexOf('Legal holds') + 400); await shot('w5/W5-48-held');
// try delete the held ticket (by hand) — expect allowed per page wording; restore right after
const del = await api('DELETE', '/desk/tickets/a9a4c545-cd24-451a-ae7d-6025f16b4797'); out.del = del.s + ' ' + del.t.slice(0, 200);
if (del.s < 300) { const rb = await api('GET', '/audit/recycle-bin/items?limit=30&app=desk'); const it = arr(D(rb.j)).find(i => i.record_id === 'a9a4c545-cd24-451a-ae7d-6025f16b4797'); if (it) out.restore = (await api('POST', '/audit/recycle-bin/restore', { item_ids: [it.id], ids: [it.id] })).s; }
out.after = (await api('GET', '/desk/tickets/a9a4c545-cd24-451a-ae7d-6025f16b4797')).s;
// release hold
await go('/settings/data/retention', 12000);
const row = page.locator('tr, [role=row], li').filter({ hasText: /QA GL W5 Imp T1|#3460/ }).first(); out.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.rowBtns = await row.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
return fin({ out });
