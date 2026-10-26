const out = {};
for (const k of ['leads', 'contacts', 'deals']) { const r = await call('GET', `/modules/${MODS[k]}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`); out[k] = (r.j.data || []).filter(x => x.created_at >= '2026-10-25T20:30').map(x => { const v = f => ((x.data.find(e => e.field === f) || {}).value || {}).value; return (v('first_name') || v('name') || v('deal_name')) + ' | by ' + (x.created_by_name || x.created_by || '?'); }); }
const t = await call('GET', `/modules/${MODS.leads}/tags`); out.leadTags = ((t.j.data.tags || t.j.data.items || t.j.data) || []).map(x => x.name + '@' + (x.created_at || '').slice(0, 16)).filter(s => s.includes('2026-10-25T2') || s.includes('2026-10-26'));
return out;
