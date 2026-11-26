// Zoho: formulas in use (sort, search criteria, COQL filter + SUM) and workflow field update recalculation. Unique labels, all deleted at the end.
const S = 'W' + Date.now().toString(36).slice(-4); const res = { suffix: S }; const M = { fields: [], leads: [], fu: [], wf: [] };
const fl = async () => (await zf('GET', '/crm/v8/settings/fields?module=Leads')).j.fields;
const mkField = async (label, def) => { const r = await zf('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: label + ' ' + S, ...def }] }); const f0 = r.j?.fields?.[0]; if (f0?.details?.id) M.fields.push(f0.details.id); return { id: f0?.details?.id, code: f0?.code, msg: f0?.message }; };
const apiOf = async id => (await fl()).find(f => f.id === id)?.api_name;
const lead = async vals => { const r = await zf('POST', '/crm/v8/Leads', { data: [vals] }); const id = r.j?.data?.[0]?.details?.id; if (id) M.leads.push(id); else log('lead err', r.t.slice(0, 200)); return id; };
const get = async id => (await zf('GET', `/crm/v8/Leads/${id}`)).j?.data?.[0] || {};
try {
  const num = await mkField('QA FX E Num', { data_type: 'integer', length: 9 }); const txt = await mkField('QA FX E Txt', { data_type: 'text', length: 100 });
  const NUM = await apiOf(num.id), TXT = await apiOf(txt.id);
  const F1 = await mkField('QA FX E F1', { data_type: 'formula', formula: { return_type: 'double', expression: '${' + NUM + '}*2' } }); const F1A = await apiOf(F1.id);
  const F2 = await mkField('QA FX E F2', { data_type: 'formula', formula: { return_type: 'text', expression: 'Upper(${' + TXT + '})' } }); const F2A = await apiOf(F2.id);
  const F3 = await mkField('QA FX E F3', { data_type: 'formula', formula: { return_type: 'boolean', expression: '${' + NUM + '}>10' } }); const F3A = await apiOf(F3.id);
  res.formulas = [F1.code, F2.code, F3.code];
  const ids = {}; for (const [k, n, t] of [['a', 2, 'alpha'], ['b', 10, 'beta'], ['c', 14, 'gamma'], ['d', null, null]]) ids[k] = await lead({ Last_Name: `QA FX E ${S} ${k}`, ...(n !== null ? { [NUM]: n } : {}), ...(t ? { [TXT]: t } : {}) });
  await sleep(4000);
  const vals = {}; for (const [k, id] of Object.entries(ids)) { const v = await get(id); vals[k] = { num: v[NUM], F1: v[F1A], F2: v[F2A], F3: v[F3A] }; } res.values = vals;
  // field metadata: can formulas be sorted / searched?
  const meta = (await fl()).filter(f => [F1.id, F2.id, F3.id].includes(f.id)).map(f => ({ label: f.field_label, sortable: f.sortable, searchable: f.searchable, filterable: f.filterable, view_type: f.view_type })); res.meta = meta;
  // sort
  const so = await zf('GET', `/crm/v8/Leads?fields=Last_Name,${F1A}&sort_by=${F1A}&sort_order=asc&per_page=200`); res.sort = so.s + ' ' + (so.j?.data ? so.j.data.filter(x => (x.Last_Name || '').includes(S)).map(x => x[F1A] ?? '∅').join(',') : so.t.slice(0, 200));
  // search criteria
  const se = await zf('GET', `/crm/v8/Leads/search?criteria=((${F1A}:greater_than:10)and(Last_Name:starts_with:QA FX E ${S}))`); res.search = se.s + ' ' + (se.j?.data ? se.j.data.map(x => x.Last_Name.slice(-1) + '=' + x[F1A]).join(',') : se.t.slice(0, 250));
  // COQL filter + aggregate
  const q1 = await zf('POST', '/crm/v8/coql', { select_query: `select Last_Name, ${F1A}, ${F2A} from Leads where ${F1A} > 10 and Last_Name like 'QA FX E ${S}%'` }); res.coqlFilter = q1.s + ' ' + (q1.j?.data ? q1.j.data.map(x => x.Last_Name.slice(-1) + '=' + x[F1A]).join(',') : q1.t.slice(0, 250));
  const q2 = await zf('POST', '/crm/v8/coql', { select_query: `select SUM(${F1A}) from Leads where Last_Name like 'QA FX E ${S}%'` }); res.coqlSum = q2.s + ' ' + q2.t.slice(0, 250);
  const q3 = await zf('POST', '/crm/v8/coql', { select_query: `select Last_Name from Leads where ${F2A} = 'BETA' and Last_Name like 'QA FX E ${S}%'` }); res.coqlText = q3.s + ' ' + q3.t.slice(0, 200);
  // workflow: field update on create -> formula recalculated?
  const fu = await zf('POST', '/crm/v8/settings/automation/field_updates', { field_updates: [{ name: 'QA FX E FU ' + S, module: { api_name: 'Leads' }, field: { api_name: NUM }, value: 7 }] }); res.fieldUpdate = fu.s + ' ' + fu.t.slice(0, 250);
  const fuId = fu.j?.field_updates?.[0]?.details?.id; if (fuId) M.fu.push(fuId);
  if (fuId) { const wf = await zf('POST', '/crm/v8/settings/automation/workflow_rules', { workflow_rules: [{ name: 'QA FX E WF ' + S, module: { api_name: 'Leads' }, execute_when: { type: 'create', details: { trigger_module: { api_name: 'Leads' } } },
      conditions: [{ sequence_number: 1, criteria_details: { criteria: { comparator: 'starts_with', field: { api_name: 'Last_Name' }, value: 'QA FX WF ' + S } }, instant_actions: { actions: [{ type: 'field_updates', id: fuId, name: 'QA FX E FU ' + S }] } }] }] });
    res.workflowRule = wf.s + ' ' + wf.t.slice(0, 300); const wfId = wf.j?.workflow_rules?.[0]?.details?.id; if (wfId) M.wf.push(wfId);
    if (wfId) { const L = await lead({ Last_Name: 'QA FX WF ' + S, [NUM]: 1, [TXT]: 'wf' }); let v; for (let i = 0; i < 10; i++) { await sleep(4000); v = await get(L); if (v[NUM] === 7) break; }
      res.workflowResult = { num: v[NUM], F1: v[F1A], F3: v[F3A], expected: { num: 7, F1: 14, F3: false } }; } }
} catch (e) { res.error = e.message; }
const cl = []; for (const id of M.wf) cl.push('wf ' + (await zf('DELETE', `/crm/v8/settings/automation/workflow_rules/${id}`)).s);
for (const id of M.fu) cl.push('fu ' + (await zf('DELETE', `/crm/v8/settings/automation/field_updates/${id}`)).s);
if (M.leads.length) cl.push('leads ' + (await zf('DELETE', `/crm/v8/Leads?ids=${M.leads.join(',')}`)).s);
for (const id of [...M.fields].reverse()) cl.push((await zf('DELETE', `/crm/v8/settings/fields/${id}?module=Leads`)).s);
res.cleanup = { calls: cl.join(','), left: (await fl()).filter(f => /^QA FX/i.test(f.field_label)).map(f => f.field_label) };
fs.writeFileSync(RUN + '/zoho/use.json', JSON.stringify(res, null, 1)); log(JSON.stringify(res, null, 1));
