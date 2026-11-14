const DS = '859edc6e-d273-4e25-99ab-4507ca5e7dc2';
const fl = await api('GET', '/reporting/datasets/' + DS); out.ds = fl.s + ' ' + (fl.t.match(/"key":"[a-z_]*(ticket_number|department|number|status_type|is_archived|is_deleted|is_spam)[a-z_]*"/g) || []).join(',').slice(0, 400);
const q = async dims => api('POST', '/reporting/query?limit=200&timezone=Africa%2FCairo', { query_spec: { ir_version: 14, dimensions: dims.map(k => ({ dataset_id: DS, field_key: k, grain: null })), measures: [], filters: [{ dataset_id: DS, field_key: 'status_type', operator: 'eq', value: 'open' }], sort: [], limit: 200, base_dataset_id: DS } });
let r = await q(['ticket_number', 'department']); out.q1 = r.s + ' ' + r.t.slice(0, 200);
const rows = (((r.j || {}).data || {}).data || {}).rows || []; out.n = rows.length; out.cs = rows.filter(x => /Customer Support|7e1ac409/.test(JSON.stringify(x))).map(x => x[0]);
return fin({ out });
