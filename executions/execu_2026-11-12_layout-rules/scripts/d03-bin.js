let cursor = null; const hit = [];
for (let p = 0; p < 40; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); for (const i of arr(r.j.data && (r.j.data.items || r.j.data))) if (i.record_id === '14c7e304-d511-45b6-bb22-b322a3db5010') hit.push(i); cursor = r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
const out = { hit: hit.map(i => i.module_key + ':' + i.record_label) }; if (hit.length === 1) out.purge = SR(await api('POST', '/audit/recycle-bin/delete', { ids: [hit[0].id] }));
// final state
const T = I.mod_desk_tickets; out.rules = arr((await api('GET', '/modules/' + T + '/layout-rules')).j.data).map(x => x.name);
return out;
