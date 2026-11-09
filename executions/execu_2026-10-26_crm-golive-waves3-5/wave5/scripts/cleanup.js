const out = {}, M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b';
// W5-B6 evidence: delete a module that still has records
const d1 = await call('DELETE', `/modules/${M}`); out.B6_plainDelete = d1.s + ' ' + d1.t.slice(0, 260);
const d2 = await call('DELETE', `/modules/${M}?cascade=true`); out.B6_cascadeDelete = d2.s + ' ' + d2.t.slice(0, 260);
// report, dashboard, API client, skills, datatype, teamspaces
out.report = (await call('DELETE', '/reporting/reports/392b1cea-f75a-4d44-bb3e-1d3ef42f63c0')).s;
out.dashboard = (await call('DELETE', '/reporting/dashboards/8eb349aa-544e-4330-8785-1645fb3a36ad')).s;
const cl = (await call('GET', '/iam/integrations/clients')).j.data; const mine = (cl.items || cl).filter(c => /^QA W5/.test(c.name)); out.clients = [];
for (const c of mine) out.clients.push((await call('DELETE', '/iam/integrations/clients/' + encodeURIComponent(c.client_id))).s);
out.skills = (await call('DELETE', '/iam/skills/categories/17ab7873-33e5-4030-90d7-bcbd15c8352e?confirm=true')).s;
out.datatype = (await call('DELETE', '/custom-datatypes/qa_w5_dt')).s;
for (const t of ['797ad4d2-9724-4c60-b8dd-f3c6aab1b6fc', 'e0d979c9-1fba-4198-b99a-986df70220ae']) out['ts ' + t.slice(0, 8)] = (await call('DELETE', `/teamspaces/${t}?cascade=true`)).s;
// modules: records -> purge from bin -> cascade delete (child first)
const allBin = async () => { const all = []; let cur = null; for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; } return all; };
const delMod = async id => { const ids = []; for (let p = 0; p < 20; p++) { const r = await call('GET', `/modules/${id}/records?page=1&per_page=100`); const rows = r.s === 200 ? r.j.data : []; if (!rows || !rows.length) break; for (const x of rows) { await call('DELETE', `/modules/${id}/records/${x.id}`); ids.push(x.id); } }
  await new Promise(z => setTimeout(z, 3000)); const bin = await allBin(); const items = bin.filter(x => ids.includes(x.record_id) || x.module_key === (id === M ? 'qa_w5_module' : 'qa_w5_noplural')).map(x => x.id);
  for (let i = 0; i < items.length; i += 50) await call('POST', '/audit/recycle-bin/delete', { ids: items.slice(i, i + 50) });
  const d = await call('DELETE', `/modules/${id}?cascade=true`); return ids.length + ' records, ' + items.length + ' purged, module ' + d.s + ' ' + d.t.slice(0, 120); };
out.M2 = await delMod(M2); out.M = await delMod(M);
// remaining QA W5 items in the bin (records of other modules, e.g. the blank Customers)
const bin = await allBin(); const blank = ['5f835ee4-500f-4b86-bbb7-dc710a4fd055', '342cbb87-9771-4ea9-b44c-34d64de2ddf4', '27c18ad0-81a6-4923-86ef-c88ca0fa96ee'];
const left = bin.filter(x => /QA W5/i.test(x.record_label || '') || blank.includes(x.record_id) || /qa_w5/.test(x.module_key || ''));
if (left.length) { const p = await call('POST', '/audit/recycle-bin/delete', { ids: left.map(x => x.id) }); out.purgeLeft = left.length + ' -> ' + p.s + ' ' + p.t.slice(0, 200); } else out.purgeLeft = 0;
return out;
