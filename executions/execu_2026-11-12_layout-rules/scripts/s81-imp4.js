const mid = await modId(); const s = await api('GET', '/modules/' + mid + '/import/' + I.imp); const d = s.j.data; const out = { keys: Object.keys(d).join(','), stats: JSON.stringify(d).slice(0, 900) };
const sr = await api('POST', '/modules/' + mid + '/records/search', { criteria: { field: 'first_name', op: 'startsWith', value: 'QA LR1112 imp' } }); out.search = SR(sr).slice(0, 60);
return out;
