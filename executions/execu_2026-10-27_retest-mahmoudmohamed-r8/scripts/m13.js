const out = {}; const ds = await api('GET', '/reporting/semantic-layer/datasets'); const L = arr(ds.j?.data); out.dsCount = ds.s + ' ' + L.length;
const d = L.find(x => /qa_rt_r8$|QA RT r8$/i.test(x.module_key || x.moduleKey || x.key || x.name || '')) || L.find(x => JSON.stringify(x).includes('064aa360'));
out.ds = d && JSON.stringify(d).slice(0, 400); out.sampleKeys = L[0] && Object.keys(L[0]);
if (d) { const D = d.id || d.dataset_id; const f = await api('GET', `/reporting/semantic-layer/datasets/${D}`); out.fields = f.s + " " + f.t.slice(0, 400);
  const q = await api('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: 14, dimensions: [{ dataset_id: D, field_key: 'name', grain: null }, { dataset_id: D, field_key: 'qa_rollup', grain: null }], measures: [], filters: [], sort: [], limit: 100, base_dataset_id: D });
  out.query = q.s + ' ' + q.t.slice(0, 700); }
return done(out);
