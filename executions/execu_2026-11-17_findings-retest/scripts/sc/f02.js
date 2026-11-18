const o = { t: new Date().toISOString() };
const ds = arr((await api('GET', '/reporting/semantic-layer/datasets')).j.data.data).find(x => x.module_key === 'leads');
const dim = k => ({ dataset_id: ds.id, field_key: k, grain: null });
let rid = I.rep;
if (!rid) { const r = await api('POST', '/reporting/reports', { name: P + 'score report', folder_id: null, query_spec: { ir_version: 14, base_dataset_id: ds.id, dimensions: [dim('last_name'), dim('score')], measures: [], filters: [{ dataset_id: ds.id, field_key: 'last_name', operator: 'starts_with', value: 'QA RT21 SC' }], sort: [], limit: 2000 }, viz_spec: { report_type: 'tabular', config: {} } });
  o.create = SR(r).slice(0, 200); rid = r.j && r.j.data && (r.j.data.data || r.j.data).id; if (rid) { I.rep = rid; SAVE(); LED('report "QA RT21 SC score report" ' + rid); } }
const q = await api('POST', '/reporting/reports/' + rid + '/query', {}); o.run = q.s; o.rows = (q.t.match(/QA RT21 SC [A-Za-z ]+?"[^\]]{0,40}/g) || []).slice(0, 10);
if (!o.rows.length) o.sample = q.t.slice(0, 800);
o.recA = await score(I.A); o.recC = await score(I.C);
if (process.env.DO_PUT) { const g = (await getRule(I.R1)).j.data; const e2 = g.entries.map(e => ({ field_key: e.field_key, operator: e.operator, value: e.value, points: 25 }));
  const p = await api('PUT', '/scoring-rules/' + I.R1, { name: g.name, description: g.description, module_id: L, is_active: true, entries: e2, row_version: g.row_version, update_existing_records: true }); o.put = SR(p) ; o.putAt = new Date().toISOString(); LED('scoring rule R1 ' + I.R1 + ' points 10->25 with update_existing_records (background rescore of all leads)'); I.putAt = o.putAt; SAVE(); }
return o;
