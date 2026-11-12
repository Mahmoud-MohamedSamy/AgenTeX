const r = await api('GET', '/web-forms?limit=100'); const a = arr(r.j && (r.j.data && (r.j.data.items || r.j.data))); const out = { s: r.s, n: a.length };
const f = a.find(x => x.id === '639914b8-a2af-4d37-94dd-a55a9585b3f6'); out.keys = f ? Object.keys(f).join(',') : 'not in list'; out.kinds = [...new Set(a.map(x => x.kind))];
if (f) { out.f = JSON.stringify(Object.fromEntries(Object.entries(f).filter(([k]) => !/definition/.test(k)))).replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 900); out.defKeys = Object.keys(f.definition || {}).join(','); }
const g = await api('GET', '/web-forms/639914b8-a2af-4d37-94dd-a55a9585b3f6'); out.get = g.s; if (g.j && g.j.data) { const d = g.j.data; out.full = JSON.stringify({ kind: d.kind, layout_id: d.layout_id, module_id: d.module_id, dept: d.department_id, defKeys: Object.keys(d.definition || {}), fields: (d.definition && (d.definition.fields || [])).map(x => x.key || x.field || x.fieldName) }).slice(0, 900); }
return out;
