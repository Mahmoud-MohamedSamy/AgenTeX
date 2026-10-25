// Cleanup inventory (read-only): QA RT views, records, fields on Leads / Contacts / Deals / Tasks.
const M = { Leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', Contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', Deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', Tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065' };
const out = {};
const nameOf = r => { const d = r.data || []; for (const k of ['first_name', 'name', 'deal_name', 'subject', 'last_name']) { const v = d.find(x => x.field === k)?.value?.value; if (v) return v; } return ''; };
for (const [k, id] of Object.entries(M)) {
  const views = []; for (const kind of ['list', 'kanban']) { const v = await api('GET', `/modules/${id}/views?kind=${kind}`); for (const x of (v.j?.data?.views || [])) if (/^\s*qa rt/i.test(x.name || '')) views.push(x.id); }
  const recs = []; for (let p = 1; p < 60; p++) { const r = await api('GET', `/modules/${id}/records?page=${p}&per_page=200&sort=created_at&order=desc`); const a = arr(r.j?.data); for (const x of a) if (/^QA RT/.test(nameOf(x))) recs.push(x.id + ' ' + nameOf(x)); if (a.length < 200 || k === 'Leads' && p > 3) break; }
  const fields = arr((await api('GET', `/modules/${id}/fields`)).j?.data).filter(f => /^qa_rt/.test(f.fieldName)).map(f => f.id + ' ' + f.fieldName);
  out[k] = { views: views.length, viewIds: views, recs, fields };
}
return done(out);
