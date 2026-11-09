const f = await api('GET', '/audit/events/facets?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail');
const d = f.j?.data || {}; const keys = Object.keys(d); const ent = d.entity_types || d.entityTypes || d.entities || d[keys.find(k => /entit/i.test(k))] || [];
const opts = arr(ent).map(x => typeof x === 'string' ? x : (x.label || x.name || x.value) + (x.value && x.label ? ' [' + x.value + ']' : ''));
return done({ s: f.s, keys, n: opts.length, suspicious: opts.filter(o => /^[a-z0-9_]+( \[|$)|row|pin|23c1a6|^Test|qa_/i.test(o)), all: opts });
