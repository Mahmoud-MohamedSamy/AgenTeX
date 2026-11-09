// NDC-2647 re-check on the build live now: fresh QA modules, rollup 5 + 7, report query, then full cleanup
const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e', t = String(Date.now() % 100000);
const res = { t };
const mk = async (key, label) => (await call('POST', `/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: label }, pluralForm: label, singularForm: label + ' record', description: 'QA R2W5 recheck' })).j.data.id;
const M = await mk('qa_r2w5_rc' + t, 'QA R2W5 RC ' + t), C = await mk('qa_r2w5_rcc' + t, 'QA R2W5 RC child ' + t);
const f = (n, l, d, o) => ({ fieldName: n, labels: { en: l }, datatypeKey: d, required: false, unique: false, ...(o ? { datatypeOptions: o } : {}) });
await call('POST', `/modules/${C}/fields`, { fields: [f('qa_parent', 'QA Parent', 'lookup', { target_module_id: M, related_list_title: 'QA kids' }), f('qa_amount', 'QA Amount', 'number')] });
res.rollupField = (await call('POST', `/modules/${M}/fields`, { fields: [f('qa_rollup', 'QA Rollup', 'rollup_summary', { target_module_id: C, relation_field: 'qa_parent', target_field: 'qa_amount', aggregation: 'sum' })] })).s;
const L = async m => { const r = await call('GET', `/modules/${m}/layouts`); return (Array.isArray(r.j.data) ? r.j.data : r.j.data.layouts)[0].id; };
const ML = await L(M), CL = await L(C);
const S = v => ({ kind: 'string', value: v }), N = v => ({ kind: 'number', value: v });
const p = (await call('POST', `/modules/${M}/records`, { layout_id: ML, data: [{ field: 'name', value: S('QA R2W5 RC parent') }] })).j.data.id;
for (const a of [5, 7]) await call('POST', `/modules/${C}/records`, { layout_id: CL, data: [{ field: 'name', value: S('QA R2W5 RC c' + a) }, { field: 'qa_parent', value: S(p) }, { field: 'qa_amount', value: N(a) }] });
await sleep(10000);
const rec = await call('GET', `/modules/${M}/records/${p}`); res.recordRollup = JSON.stringify((rec.j.data.data || []).find(x => x.field === 'qa_rollup'));
let ds = null; for (let i = 0; i < 6 && !ds; i++) { const d = await call('GET', '/reporting/semantic-layer/datasets'); ds = ((d.j.data.data || [])).find(x => x.module_key === 'qa_r2w5_rc' + t); if (!ds) await sleep(5000); }
if (ds) { const spec = { ir_version: 14, base_dataset_id: ds.id, dimensions: [{ dataset_id: ds.id, field_key: "name", grain: null }, { dataset_id: ds.id, field_key: "qa_rollup", grain: null }], measures: [], filters: [], sort: [], limit: 100 };
  const q0 = await call("POST", "/reporting/query?limit=100&timezone=Africa%2FCairo", spec); res.adhoc = q0.s + " " + q0.t.slice(0, 300);
  const rp = await call("POST", "/reporting/reports", { name: "QA R2W5 RC " + t, folder_id: null, query_spec: spec, viz_spec: { report_type: "tabular", config: {} } }); res.reportCreate = rp.s + " " + rp.t.slice(0, 200);
  const rid = rp.j && rp.j.data && (rp.j.data.data || rp.j.data).id;
  if (rid) { const q = await call("POST", "/reporting/reports/" + rid + "/query", {}); res.query = q.s + " " + JSON.stringify(q.j && q.j.data && (q.j.data.data || q.j.data).rows); res.delReport = (await call("DELETE", "/reporting/reports/" + rid + "?expected_revision=1")).s; }
} else res.query = "no dataset";
// cleanup
const ids = [];
for (const m of [C, M]) { const r = await call('GET', `/modules/${m}/records?page=1&per_page=50`); for (const x of (r.j.data || [])) { await call('DELETE', `/modules/${m}/records/${x.id}`); ids.push(x.id); } }
await sleep(3000);
const bin = await call('GET', '/audit/recycle-bin/items?limit=200'); const bi = (Array.isArray(bin.j.data) ? bin.j.data : bin.j.data.items).filter(x => ids.includes(x.record_id)).map(x => x.id);
res.purge = bi.length ? (await call('POST', '/audit/recycle-bin/delete', { ids: bi })).s + ' (' + bi.length + ')' : 'none';
res.delC = (await call('DELETE', `/modules/${C}?cascade=true`)).s; res.delM = (await call('DELETE', `/modules/${M}?cascade=true`)).s;
return res;
