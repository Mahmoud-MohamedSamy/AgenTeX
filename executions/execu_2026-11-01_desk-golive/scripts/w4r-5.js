const ID = '0f472a78-e303-4644-9cd7-ef35c013382d';
const d = await api('DELETE', '/desk/email-templates/' + ID); out.del = d.s + ' ' + d.t.slice(0, 150);
out.get = (await api('GET', '/desk/email-templates/' + ID)).s;
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const pick = items.filter(x => x.record_id === ID); out.bin = pick.map(x => [x.id, x.record_label]);
if (pick.length && /QA GL W4/.test(pick[0].record_label || '')) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: [pick[0].id], ids: [pick[0].id] }); out.purge = p.s; }
await go('/settings/channels/email/domains', 12000);
out.dom = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(600, 2200);
out.domNet = NET.filter(x => /domain/.test(x.u)).map(x => x.m + ' ' + x.u.replace(/^https:\/\/[^/]+/, '') + ' ' + x.s + ' ' + x.t.slice(0, 600));
await shot('w4/r-domains');
return fin({ out });
