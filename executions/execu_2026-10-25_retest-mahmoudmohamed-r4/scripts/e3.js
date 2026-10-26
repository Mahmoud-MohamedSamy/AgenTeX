// NDC-1602: the items left after Empty Bin — what are they, and what does the page say now.
let cur = '', left = []; for (let i = 0; i < 60; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); const a = arr(r.j?.data); left.push(...a); cur = r.j?.meta?.next_cursor; if (!cur || !a.length) break; }
const one = left[0] ? Object.keys(left[0]) : [];
const items = left.map(x => ({ id: x.id.slice(0, 8), label: x.record_label, app: x.app_key, mod: x.module_label || x.module_key || x.entity_type, by: x.deleted_by_name, at: x.deleted_at, canDel: x.can_delete ?? x.permissions }));
// try one leftover by API to see the reason
const tr = left[0] ? await api('POST', '/audit/recycle-bin/delete', { ids: [left[0].id] }) : null;
await shot('1602-r2-07-left');
const notif = (await txt()).split('\n').filter(l => /empt|removed|deleted|failed|could not|items/i.test(l)).slice(0, 8);
return done({ keys: one, items, tryOne: tr && { s: tr.s, t: tr.t.slice(0, 400) }, notif });
