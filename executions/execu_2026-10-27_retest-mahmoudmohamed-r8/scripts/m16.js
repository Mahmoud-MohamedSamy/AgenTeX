const D = '94e22466-8688-4b6b-aedc-fb141212cc81'; const out = {};
const f = (await api('GET', `/reporting/semantic-layer/datasets/${D}`)).j?.data; const inner = f?.data || f; out.innerKeys = Object.keys(inner || {});
const fl = inner?.fields || inner?.dataset?.fields || []; out.fields = fl.map(x => (x.field_key || x.key) + ':' + (x.data_type || x.type || '') ).slice(0, 40);
for (const v of [14, 15, 16, 13, 12]) { const q = await api('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: v, dimensions: [{ dataset_id: D, field_key: 'name', grain: null }, { dataset_id: D, field_key: 'qa_rollup', grain: null }], measures: [], filters: [], sort: [], limit: 100, base_dataset_id: D }); out['v' + v] = q.s + ' ' + q.t.slice(0, 500); if (q.s === 200) break; }
return done(out);
