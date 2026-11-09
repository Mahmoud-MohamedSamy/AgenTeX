const D = '94e22466-8688-4b6b-aedc-fb141212cc81'; const out = {}; const q = b => api('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: 14, filters: [], sort: [], limit: 100, base_dataset_id: D, ...b });
const tries = {
  a: { dimensions: [{ dataset_id: D, field_key: 'name', grain: null }], measures: [{ dataset_id: D, field_key: 'qa_rollup', aggregation: 'sum' }] },
  b: { dimensions: [{ dataset_id: D, field_key: 'name' }, { dataset_id: D, field_key: 'qa_rollup' }], measures: [] },
  c: { dimensions: [{ dataset_id: D, field_key: 'name', grain: null }], measures: [{ dataset_id: D, field_key: 'id', aggregation: 'count' }] } };
for (const [k, b] of Object.entries(tries)) { const r = await q(b); out[k] = r.s + ' ' + r.t.slice(0, 600); }
return done(out);
