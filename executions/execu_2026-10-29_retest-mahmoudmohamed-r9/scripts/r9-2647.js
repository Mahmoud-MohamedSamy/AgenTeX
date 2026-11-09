// NDC-2647: rollup summary value in a report. QA parent + child modules (teamspace "Anyware Staging"), rollup = SUM(child.qa_amount) = 12;
// report with name + qa_rollup, run at once and over ~6 min. Modules, records and report are kept for the round cleanup (ledger).
const out = {}; const TS = '6c2194d9-cf25-4dea-bf5e-3fad5a221c1c'; const t = String(Date.now()).slice(-5);
const mk = async (key, label) => { const r = await api('o', 'POST', `/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: label }, pluralForm: label, singularForm: label + ' record', description: 'QA RT r9 NDC-2647, deleted at cleanup' }); if (r.j?.data?.id) ledger(`module ${r.j.data.id} "${label}" (${key}) — delete with ?cascade=true + purge its bin items`); return r; };
const lay = async m => { const d = (await api('o', 'GET', `/modules/${m}/layouts`)).j?.data; return (Array.isArray(d) ? d : d?.layouts)?.[0]?.id; };
const P = await mk('qa_rt_r9p_' + t, 'QA RT r9 Rollup ' + t); out.parent = P.s + ' ' + (P.j?.data?.id || P.t.slice(0, 200)); const mod = P.j?.data?.id; if (!mod) return out;
const C = await mk('qa_rt_r9c_' + t, 'QA RT r9 Rollup child ' + t); out.child = C.s; const child = C.j?.data?.id; if (!child) return out;
const cf = await api('o', 'POST', `/modules/${child}/fields`, { fields: [
  { fieldName: 'qa_parent', labels: { en: 'QA Parent' }, datatypeKey: 'lookup', required: false, unique: false, datatypeOptions: { target_module_id: mod, related_list_title: 'QA children' } },
  { fieldName: 'qa_amount', labels: { en: 'QA Amount' }, datatypeKey: 'number', required: false, unique: false }] }); out.childFields = cf.s + (cf.s > 299 ? ' ' + cf.t.slice(0, 200) : '');
const rf = await api('o', 'POST', `/modules/${mod}/fields`, { fields: [{ fieldName: 'qa_rollup', labels: { en: 'QA Rollup' }, datatypeKey: 'rollup_summary', required: false, unique: false, datatypeOptions: { target_module_id: child, relation_field: 'qa_parent', target_field: 'qa_amount', aggregation: 'sum' } }] });
out.rollupField = rf.s + (rf.s > 299 ? ' ' + rf.t.slice(0, 200) : '');
const L = await lay(mod), LC = await lay(child);
const enc = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const rec = async (m, l, f) => api('o', 'POST', `/modules/${m}/records`, { layout_id: l, data: Object.entries(f).map(([k, v]) => ({ field: k, value: enc(v) })) });
const pr = await rec(mod, L, { name: 'QA RT r9 rollup parent' }); const pid = pr.j?.data?.id; out.parentRecord = pr.s + ' ' + pid;
for (const a of [5, 7]) out['child ' + a] = (await rec(child, LC, { name: 'QA RT r9 child ' + a, qa_parent: pid, qa_amount: a })).s;
const val = async () => { const d = (await api('o', 'GET', `/modules/${mod}/records/${pid}`)).j?.data?.data || []; const f = d.find(x => x.field === 'qa_rollup'); return f?.value?.value ?? f?.value; };
await X.waitFor(45, async () => String(await val()).startsWith('12')); out.recordRollup = await val();
let ds = null; for (let i = 0; i < 20 && !ds; i++) { const l = (await api('o', 'GET', '/reporting/semantic-layer/datasets')).j?.data; ds = (l?.data || l || []).find?.(d => d.module_key === 'qa_rt_r9p_' + t)?.id; if (!ds) await sleep(10000); }
out.dataset = ds || 'no dataset after ~200 s'; if (!ds) return out;
const spec = { ir_version: 14, base_dataset_id: ds, dimensions: [{ dataset_id: ds, field_key: 'name', grain: null }, { dataset_id: ds, field_key: 'qa_rollup', grain: null }], measures: [], filters: [], sort: [], limit: 100 };
const rp = await api('o', 'POST', '/reporting/reports', { name: 'QA RT r9 rollup ' + t, folder_id: null, query_spec: spec, viz_spec: { report_type: 'tabular', config: {} } });
const rid = rp.j?.data?.data?.id || rp.j?.data?.id; out.report = rp.s + ' ' + (rid || rp.t.slice(0, 300)); if (!rid) return out; ledger(`report ${rid} "QA RT r9 rollup ${t}" (delete needs ?expected_revision=1)`);
out.runs = [];
for (const wait of [0, 60, 120, 180]) { if (wait) await sleep(60000); const q = await api('o', 'POST', `/reporting/reports/${rid}/query`, {}); const rows = q.j?.data?.data?.rows || q.j?.data?.rows || [];
  const row = rows.find(r => String(r[0]) === 'QA RT r9 rollup parent'); out.runs.push({ atSec: [0, 60, 120, 180].slice(0, out.runs.length + 1).reduce((a, b) => a + b, 0), status: q.s, rollup: row ? row[1] : (q.s > 299 ? q.t.slice(0, 160) : 'no row') }); }
out.ids = { mod, child, pid };
return out;
