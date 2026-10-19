const out = {};
for (const p of ['/workflow/approval-processes', '/approval-processes', '/workflow/approvals/processes', '/crm/approval-processes', '/automation/approval-processes', '/workflow/processes?type=approval']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 160); }
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const f = await api('GET', '/modules/' + L + '/fields'); const ap = arr(f.j.data).find(x => x.apiName === 'approval_status');
out.approvalField = ap && { type: ap.datatypeKey, values: ap.datatypeOptions, sysManaged: ap.isSystemManaged, sys: ap.isSystemField, caps: ap.capabilities };
return done(out);
