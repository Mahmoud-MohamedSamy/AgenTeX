const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e';
const sv = v => v === null || v === undefined ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(sv) } : typeof v === 'object' ? (v.kind ? v : { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, sv(x)])) }) : { kind: 'string', value: String(v) };
const unv = v => !v ? v : v.kind === 'array' ? (v.items || []).map(unv) : v.kind === 'object' ? Object.fromEntries(Object.entries(v.properties || {}).map(([k, x]) => [k, unv(x)])) : v.kind === 'null' ? null : v.value;
const data = o => Object.entries(o).map(([k, v]) => ({ field: k, value: sv(v) }));
const fdef = (n, l, d, o) => ({ fieldName: n, labels: { en: l }, datatypeKey: d, required: false, unique: false, ...(o ? { datatypeOptions: o } : {}) });
const flat = d => { const o = {}; for (const x of (d || [])) o[x.field] = unv(x.value); return o; };
const getRec = async (m, id) => { const r = await api('GET', `/modules/${m}/records/${id}`); return flat(r.j?.data?.data); };
