const mid = await modId(); const id = 'd6a5dc8b-b8ce-412d-8ce0-cace7f8595a8'; I.recs.push([mid, id]); SAVE();
const out = {};
for (const q of ['/audit/events?entity_id=' + id + '&limit=10', '/audit/events?record_id=' + id + '&limit=10']) { const r = await api('GET', q); out[q.slice(14, 30)] = r.s + ' ' + arr(r.j && r.j.data).map(e => JSON.stringify(e).match(/confirm[^,]{0,120}|warning[^,]{0,120}/gi)).join(' ; ').slice(0, 500) + ' n=' + arr(r.j && r.j.data).length; }
const g = await api('GET', '/modules/' + mid + '/records/' + id); out.vals = JSON.stringify((g.j.data.data || []).filter(x => /qa_vr_pct|qa_vr_pick/.test(x.field)).map(x => x.field + '=' + x.value.value));
return out;
