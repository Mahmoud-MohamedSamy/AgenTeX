// NDC-2104 round 2 probe: which field is "Last Activity", and the QA RT tz leads' current modified times.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = {};
const f = await api('GET', '/modules/' + L + '/fields'); out.shape = f.t.slice(0, 400);
out.hits = (f.t.match(/.{0,160}(Last Activity|last_activity|last_modified|Modified)[^}]{0,160}/g) || []).slice(0, 8);
const g = await api('GET', '/modules/' + L + '/views/' + V);
await api('PATCH', '/modules/' + L + '/views/' + V, { settings: { ...g.j.data.settings, criteria: { pattern: '1', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }] } }, row_version: g.j.data.row_version });
const r = await api('GET', '/modules/' + L + '/records?view_id=' + V + '&page=1&per_page=20'); out.recs = arr(r.j && r.j.data).map(x => ({ id: x.id, lm: x.last_modified_at, n: ((x.data || []).find(d => d.field === 'first_name') || { value: {} }).value.value }));
return done(out);
