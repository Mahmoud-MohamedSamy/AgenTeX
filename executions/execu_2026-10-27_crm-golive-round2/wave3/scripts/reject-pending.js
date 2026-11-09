// Rejects every record pending under a QA AEO / QA W3 approval process that THIS account may reject (approver or process
// admin), so the processes, records and QA layouts can be deleted without the owner's status reset.
const fs = require('fs');
const W = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave3';
const base = JSON.parse(fs.readFileSync(W + '/baseline/snapshot.json', 'utf8'));
const qa = n => /^QA (AEO|W3) /.test(String(n || ''));
const known = new Set(base['/workflow/approval-processes'].data.map(x => x.id));
const MODS = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065' };
const list = async p => { const r = await call('GET', p); const d = r.j && r.j.data; return Array.isArray(d) ? d : (d && (d.items || d.layouts)) || []; };
const procs = new Set((await list('/workflow/approval-processes')).filter(x => qa(x.name) && !known.has(x.id)).map(x => x.id));
const cand = new Map();   // recordId -> moduleId
for (const q of await list('/workflow/approvals/queue?take=200')) if (procs.has(q.processId)) cand.set(q.recordId, q.moduleId);
const kl = new Set(Object.values(MODS).flatMap(m => (base[`/modules/${m}/layouts`] || { data: [] }).data.map(l => l.id)));
for (const m of Object.values(MODS))
  for (const l of await list(`/modules/${m}/layouts`)) if (qa(l.name) && !kl.has(l.id))
    for (let p = 1; p <= 3; p++) {
      const r = await call('GET', `/modules/${m}/records?page=${p}&per_page=100&layout_id=${l.id}`);
      const rows = (r.j && r.j.data) || []; rows.forEach(x => cand.set(x.id, m)); if (rows.length < 100) break;
    }
const res = [];
for (const [rid, m] of cand) {
  const st = await call('GET', `/workflow/approvals/records/${m}/${rid}`);
  const d = (st.j && st.j.data) || {};
  if (d.state !== 'pending_approval') continue;
  if (!(d.canReject || d.canApprove)) { res.push(rid + ' pending, not mine (' + d.viewerDecisionBlockedReason + ')'); continue; }
  res.push(rid + ' reject -> ' + (await call('POST', `/workflow/approvals/${d.instanceId}/reject`, { comment: 'QA W3 cleanup' })).s);
}
res.push('QA approval processes: ' + procs.size + ', candidate records: ' + cand.size);
return res;
