// Wave 5 cleanup: reporting objects, rules, modules (records -> bin purge -> cascade delete), teamspace, bin sweep.
const res = {};
const one = async (m, p, b) => { const r = await call(m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); };
const MOD = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', CHILD = '2a8802cb-7c22-4c51-91ab-277457a0b498', DLG = 'b66f7a3b-fecb-48a7-8228-d45e05a059c6', TS = '81428421-ff3d-41b7-9e2a-8d0b2fbfd017';
// schedules
const sc = await call('GET', '/reporting/schedules'); const scl = (sc.j.data.data || sc.j.data || []);
res.schedules = [];
for (const s of scl.filter(x => /QA R2W5/.test(x.name))) { const g = await call('GET', '/reporting/schedules/' + s.id); const rev = g.j && g.j.data && (g.j.data.data || g.j.data).revision; res.schedules.push(s.name + ' -> ' + await one('DELETE', `/reporting/schedules/${s.id}?expected_revision=${rev ?? 1}`)); }
// dashboards
const db = await call('GET', '/reporting/dashboards'); res.dash = [];
for (const d of (db.j.data.data || []).filter(x => /QA R2W5/.test(x.name))) res.dash.push(d.name + ' -> ' + await one('DELETE', `/reporting/dashboards/${d.id}?expected_revision=${d.revision ?? 1}`));
// joined reports
const jr = await call('GET', '/reporting/joined-reports'); res.joined = [];
for (const d of (jr.j.data.data || []).filter(x => /Untitled joined report|QA R2W5/.test(x.name) && x.owner_id === '7e5e7c27-46e4-4bf6-b021-7bd219d34472')) res.joined.push(d.name + ' -> ' + await one('DELETE', `/reporting/joined-reports/${d.id}?expected_revision=${d.revision ?? 1}`));
// reports
const rp = await call('GET', '/reporting/reports'); res.reports = [];
for (const d of (rp.j.data.data || []).filter(x => /QA R2W5/.test(x.name))) res.reports.push(d.name + ' -> ' + await one('DELETE', `/reporting/reports/${d.id}?expected_revision=${d.revision ?? 1}`));
// module-level objects
res.rules = [];
for (const sub of ['validation-rules', 'dependency-maps', 'buttons', 'links', 'layout-rules']) { const l = await call('GET', `/modules/${MOD}/${sub}`); for (const x of ((l.j && l.j.data) || [])) res.rules.push(sub + ' ' + await one('DELETE', `/modules/${MOD}/${sub}/${x.id}`)); }
// teamspace
res.ts = await one('DELETE', `/teamspaces/${TS}?cascade=true`);
// modules
const allBin = async () => { const all = []; let cur = null; for (let p = 0; p < 30; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : (r.j.data.items || []); all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; } return all; };
const delMod = async (id, key) => { await call('PUT', `/modules/${id}`, { status: 'active' }); const ids = []; for (let p = 0; p < 20; p++) { const r = await call('GET', `/modules/${id}/records?page=1&per_page=100`); const rows = r.s === 200 ? r.j.data : []; if (!rows || !rows.length) break; for (const x of rows) { await call('DELETE', `/modules/${id}/records/${x.id}`); ids.push(x.id); } }
  await sleep(3000); const bin = await allBin(); const items = bin.filter(x => ids.includes(x.record_id) || x.module_key === key).map(x => x.id);
  for (let i = 0; i < items.length; i += 50) await call('POST', '/audit/recycle-bin/delete', { ids: items.slice(i, i + 50) });
  return ids.length + ' records, ' + items.length + ' purged, delete -> ' + await one('DELETE', `/modules/${id}?cascade=true`); };
res.child = await delMod(CHILD, 'qa_r2w5_child');
res.mod = await delMod(MOD, 'qa_r2w5_mod');
res.dlg = await delMod(DLG, 'qa_r2w5_dialog');
// bin sweep for anything of this lane
const bin = await allBin();
const left = bin.filter(x => /QA R2W5/i.test(x.record_label || x.name || '') || /qa_r2w5/.test(x.module_key || ''));
res.binLeft = left.length;
if (left.length) res.binPurge = await one('POST', '/audit/recycle-bin/delete', { ids: left.map(x => x.id) });
// blank Customers records made by the Java runs (record ids from the logs)
const blanks = ['2571ccd4-2db0-4872-87e5-bbdc6cbe88be', 'bcea01e2-c62d-45cc-bdb7-374bbe4e16c2'];
res.blankInBin = bin.filter(x => blanks.includes(x.record_id)).map(x => x.id);
if (res.blankInBin.length) res.blankPurge = await one('POST', '/audit/recycle-bin/delete', { ids: res.blankInBin });
for (const b of blanks) res['customer ' + b.slice(0, 8)] = (await call('GET', `/modules/6f553963-01d6-4b68-9fb3-143d23044c41/records/${b}`)).s;
return res;
