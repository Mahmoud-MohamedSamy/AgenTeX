const mid = await modId(); const o = {};
const sr = await api('POST', '/modules/' + mid + '/records/search', { criteria: { field: 'subject', op: 'startsWith', value: 'QA VR1112 BADMAIL' } });
o.search = sr.s + ' ' + E(sr).slice(0, 150);
o.tickets = arr(sr.j && sr.j.data).map(r => ({ id: r.id, created: r.created_at, layout: r.layout_id || r.created_with_layout_id, vals: (r.data || []).filter(x => /subject|channel|source|department|status/.test(x.field)).map(x => x.field + '=' + (x.value && x.value.value)) }));
const rl = I.g17 && (await getRule(mid, I.g17)).j.data; o.rule = rl && (rl.status + ' layout ' + rl.layoutId);
return o;
