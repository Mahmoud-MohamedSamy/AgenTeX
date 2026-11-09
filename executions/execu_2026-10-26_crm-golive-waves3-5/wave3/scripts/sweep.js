// Owner-free sweep of Lane A leftovers (CRM Admin A): every automation object and QA layout that is NOT in the baseline
// snapshot and whose name starts with "QA AEO " or "QA W3 ", the records on those QA layouts, then their bin items.
const fs = require('fs');
const W = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave3';
const base = JSON.parse(fs.readFileSync(W + '/baseline/snapshot.json', 'utf8'));
const qa = n => /^QA (AEO|W3) /.test(String(n || ''));
const known = k => new Set((base[k] && Array.isArray(base[k].data) ? base[k].data : []).map(x => x.id));
const MODS = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065' };
const log = [];
const list = async p => { const r = await call('GET', p); const d = r.j && r.j.data; return Array.isArray(d) ? d : (d && (d.items || d.layouts)) || []; };

// 1. workflow rules
const kr = known('/workflow/rules?take=500');
for (const x of await list('/workflow/rules?take=500')) if (qa(x.name) && !kr.has(x.id)) {
  await call('POST', `/workflow/rules/${x.id}/deactivate`);
  log.push('rule ' + x.name + ' -> ' + (await call('DELETE', `/workflow/rules/${x.id}`)).s);
}
// 2. assignment rules
const ka = known('/workflow/assignment-rules');
for (const x of await list('/workflow/assignment-rules')) if (qa(x.name) && !ka.has(x.id)) {
  if (x.isActive) await call('PATCH', `/workflow/assignment-rules/${x.id}`, { ...x, isActive: false });
  log.push('assignment ' + x.name + ' -> ' + (await call('DELETE', `/workflow/assignment-rules/${x.id}`)).s);
}
// 3. review processes (held records rejected)
const kv = known('/workflow/review-processes');
for (const x of await list('/workflow/review-processes')) if (qa(x.name) && !kv.has(x.id)) {
  const off = await call('PATCH', `/workflow/review-processes/${x.id}/active`, { isActive: false, pendingAction: 'reject_all' });
  log.push('review ' + x.name + ' off ' + off.s + ' delete ' + (await call('DELETE', `/workflow/review-processes/${x.id}`)).s);
}
// 4. approval processes (pending records rejected by an approver first)
const kp = known('/workflow/approval-processes');
for (const x of await list('/workflow/approval-processes')) if (qa(x.name) && !kp.has(x.id)) {
  for (const q of await list('/workflow/approvals/queue?take=200')) if (q.processId === x.id) {
    const st = await call('GET', `/workflow/approvals/records/${q.moduleId}/${q.recordId}`);
    const inst = st.j && st.j.data && st.j.data.instanceId;
    if (inst) log.push('  reject pending ' + q.recordId + ' -> ' + (await call('POST', `/workflow/approvals/${inst}/reject`, { comment: 'QA W3 cleanup' })).s);
  }
  const off = await call('PATCH', `/workflow/approval-processes/${x.id}/active`, { isActive: false });
  log.push('approval ' + x.name + ' off ' + off.s + ' delete ' + (await call('DELETE', `/workflow/approval-processes/${x.id}`)).t.slice(0, 160));
}
// 5. blueprints, records on QA layouts, QA layouts
const recIds = [];
for (const [k, m] of Object.entries(MODS)) {
  const kb = known(`/modules/${m}/blueprints`);
  for (const x of await list(`/modules/${m}/blueprints`)) {
    const nm = (x.definition && x.definition.name) || x.name;
    if (qa(nm) && !kb.has(x.id)) {
      if (x.isActive) await call('PATCH', `/modules/${m}/blueprints/${x.id}`, { isActive: false });
      log.push('blueprint ' + nm + ' -> ' + (await call('DELETE', `/modules/${m}/blueprints/${x.id}`)).s);
    }
  }
  const kl = known(`/modules/${m}/layouts`);
  for (const l of await list(`/modules/${m}/layouts`)) if (qa(l.name) && !kl.has(l.id)) {
    for (let p = 1; p <= 5; p++) {
      const r = await call('GET', `/modules/${m}/records?page=${p}&per_page=100&layout_id=${l.id}`);
      const rows = (r.j && r.j.data) || [];
      for (const x of rows) { const d = await call('DELETE', `/modules/${m}/records/${x.id}`); recIds.push(x.id); if (d.s !== 204) log.push('  record ' + k + ' ' + x.id + ' -> ' + d.s + ' ' + d.t.slice(0, 120)); }
      if (rows.length < 100) break;
    }
    const d = await call('DELETE', `/modules/${m}/layouts/${l.id}`);
    log.push('layout ' + k + ' ' + l.name + ' -> ' + d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 160) : ''));
  }
}
// 6. purge this lane's records from the bin (QA AEO / QA W3 labels deleted today)
const today = new Date().toISOString().slice(0, 10), items = [];
let cursor = null;
for (let i = 0; i < 30; i++) {
  const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''));
  const d = (r.j && (Array.isArray(r.j.data) ? r.j.data : r.j.data && r.j.data.items)) || [];
  for (const x of d) if ((qa(x.record_label) || recIds.includes(x.record_id)) && String(x.deleted_at || '').startsWith(today)) items.push(x.id);
  cursor = r.j && r.j.meta && r.j.meta.next_cursor; if (!cursor || !d.length) break;
}
for (let i = 0; i < items.length; i += 50) log.push('bin purge ' + Math.min(50, items.length - i) + ' -> ' + (await call('POST', '/audit/recycle-bin/delete', { ids: items.slice(i, i + 50) })).s);
log.push('records deleted on QA layouts: ' + recIds.length + '; bin items purged: ' + items.length);
return log;
