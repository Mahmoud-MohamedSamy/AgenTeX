const m = await api('GET', '/modules?page=1&page_size=200');
const L = arr(m.j?.data ?? m.j);
const pick = ['leads','contacts','accounts','deals'];
const out = {};
for (const k of pick) { const x = L.find(y => (y.moduleKey||'').toLowerCase() === k); if (!x) { out[k] = 'missing'; continue; }
  const f = await api('GET', `/modules/${x.id}/fields`); const F = arr(f.j?.data ?? f.j);
  out[k] = { id: x.id, fields: F.filter(z => z.required || /name|source|email|amount|stage|clos|account|company|phone|owner/i.test(z.fieldName||z.field_name||z.key)).map(z => `${z.fieldName||z.field_name||z.key}:${z.datatypeKey||z.datatype||z.type}${z.required?'*':''}`) };
}
fs.writeFileSync('../out/p07a-crm-modules.json', JSON.stringify({ modules: L.map(x => ({ id: x.id, key: x.moduleKey, app: x.appKey })), out }, null, 1));
return { n: L.length, sampleKeys: Object.keys(L[0]||{}), out };
