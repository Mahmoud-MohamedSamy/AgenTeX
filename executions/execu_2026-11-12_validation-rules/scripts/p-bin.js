// Recycle Bin: QA VR1112 items by exact record id (ids file) or label; PURGE=1 deletes them
const mine = new Set((I.recs || []).map(x => x[1])); const mod = APP === 'desk' ? 'desk_tickets' : 'leads';
let items = [], cur = null;
for (let k = 0; k < 40; k++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items = items.concat(arr(b.j && b.j.data)); cur = b.j && (b.j.meta && (b.j.meta.next_cursor || b.j.meta.nextCursor)) || b.j.next_cursor; if (!cur) break; }
const inMod = items.filter(x => x.module_key === mod);
const pick = inMod.filter(x => mine.has(x.record_id) || /VR1112/.test(x.record_label || ''));
const o = { total: items.length, inMod: inMod.length, pick: pick.length, byId: pick.filter(x => mine.has(x.record_id)).length, labels: Object.entries(pick.reduce((a, x) => (a[x.record_label] = (a[x.record_label] || 0) + 1, a), {})), dates: [...new Set(pick.map(x => String(x.deleted_at).slice(0, 13)))],
  othersToday: Object.entries(inMod.filter(x => !pick.includes(x) && String(x.deleted_at) >= '2026-11-12T15').reduce((a, x) => (a[x.record_label + ' | ' + x.deleted_by_label + ' ' + String(x.deleted_at).slice(11, 16)] = 1, a), {})).map(x => x[0]).slice(0, 40) };
if (process.env.PURGE === '1' && pick.length) {
  for (let i = 0; i < pick.length; i += 50) { const ch = pick.slice(i, i + 50).map(x => x.id); const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: ch, ids: ch }); o['purge' + i] = SR(p).slice(0, 150); }
  LED('purged ' + pick.length + ' bin items (QA VR1112)');
}
return o;
