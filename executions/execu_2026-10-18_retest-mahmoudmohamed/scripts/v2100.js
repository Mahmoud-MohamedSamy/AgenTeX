const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = { r2100: [], r2102: [], created: [] };
const name = (await api('GET', '/iam/me')).j.data.display_name; out.user = name;
const mk = async (n, cond) => { const p = await api('POST', '/modules/' + D + '/views', { name: n, kind: 'list', visibility: 'private', settings: { criteria: { conditions: [cond] } } });
  const id = p.j && p.j.data && p.j.data.id; if (id) out.created.push(id);
  let stored = null, recs = null; if (id) { const g = await api('GET', '/modules/' + D + '/views/' + id); stored = JSON.stringify(g.j.data.settings.criteria.conditions[0].value); const r = await api('GET', '/modules/' + D + '/records?view_id=' + id + '&page=1&per_page=50'); recs = arr(r.j && r.j.data).map(x => ((x.data || []).find(f => f.field === 'deal_name') || { value: {} }).value.value); }
  return { status: p.s, err: p.s >= 400 ? (p.j && p.j.error && JSON.stringify(p.j.error.details || p.j.error.message)) : undefined, stored, recs }; };
for (const v of ['15,000', '1e9', 'abc', '١٥٠٠٠', '15 000', '1.2.3', '-1', '15000']) out.r2100.push({ v, ...(await mk('QA RT amt ' + v, { field: 'amount', operator: 'equals', value: v })) });
for (const op of ['contains', 'starts_with', 'equals', 'greater_than', 'is_empty']) out.r2102.push({ op, ...(await mk('QA RT op ' + op, { field: 'amount', operator: op, value: op === 'is_empty' ? undefined : (op === 'contains' || op === 'starts_with' ? '100' : 100) })) });
return done(out);
