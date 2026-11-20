const o = {}; const ds = arr((await api('GET', '/reporting/semantic-layer/datasets')).j.data.data).find(x => x.module_key === 'leads'); o.ds = ds && ds.display_name;
const det = await api('GET', '/reporting/semantic-layer/datasets/' + ds.id); o.scoreInDataset = /"(field_key|key)":"score"/.test(det.t);
const dim = k => ({ dataset_id: ds.id, field_key: k, grain: null });
const r = await api('POST', '/reporting/reports', { name: P + 'score report4', folder_id: null, query_spec: { ir_version: 14, base_dataset_id: ds.id, dimensions: [dim('last_name'), dim('score')], measures: [], filters: [{ dataset_id: ds.id, field_key: 'last_name', operator: 'starts_with', value: 'QA RT20 SC' }], sort: [], limit: 2000 }, viz_spec: { report_type: 'tabular', config: {} } });
o.create = SR(r).slice(0, 250); const rid = r.j && r.j.data && (r.j.data.data || r.j.data).id;
if (rid) { LED('report "QA RT20 SC score report4" ' + rid); const q = await api('POST', '/reporting/reports/' + rid + '/query', {}); o.run = q.s; o.rows = (q.t.match(/QA RT20 SC [A-Za-z ]+?"[^\]]{0,40}/g) || []).slice(0, 10); o.sample = q.t.slice(0, 600);
  const g = await api('GET', '/reporting/reports/' + rid); const rev = g.j && g.j.data && ((g.j.data.data || g.j.data).revision); o.del = (await api('DELETE', '/reporting/reports/' + rid + '?expected_revision=' + rev)).s; LED('report ' + rid + ' deleted (' + o.del + ')'); }
for (const k of ['A', 'C', 'N', 'D', 'E', 'F', 'G']) o['s' + k] = await score(I[k]);
return o;
