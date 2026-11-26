const o = {}; const R = ST.R;
const t7 = R.R7.t;
for (const p of [`/desk/tickets/${t7}/history`, `/desk/tickets/${t7}/activity`, `/desk/tickets/${t7}/timeline`, `/modules/${T}/records/${t7}/history`, `/modules/${T}/records/${t7}/timeline`, `/audit/records/${t7}/history`, `/desk/tickets/${t7}/history-entries`]) { const r = await api.O('GET', p); o[p.replace(t7, '{t}')] = r.s + ' ' + (r.s < 300 ? (r.t.match(/approv[a-z_.]*/gi) || []).slice(0, 12).join(',') + ' len ' + r.t.length : ''); }
// approval_status field on tickets
const pend = await getTicket(R.R17.t); const decT = await getTicket(R.R1.t);
o.approvalStatusPending = pend.approval_status; o.approvalStatusT01 = decT.approval_status;
const fl = await api.O('GET', `/modules/${T}/fields?take=500`); const f = arr(fl.j?.data?.fields || fl.j?.data).find(x => (x.fieldName || x.apiName) === 'approval_status'); o.field = JSON.stringify(f).slice(0, 500);
// workflow trigger kinds available
const tr = await api.O('GET', `/workflow/triggers?moduleId=${T}`); o.triggers = tr.s + ' ' + tr.t.slice(0, 600);
const meta = await api.O('GET', `/workflow/metadata?moduleId=${T}`); o.wfmeta = meta.s + ' ' + (meta.t.match(/[A-Za-z]*[Aa]pprov[A-Za-z]*/g) || []).slice(0, 20).join(',');
// reports
for (const p of ['/desk/reports/approvals', '/desk/approvals/report', '/reports/approvals', '/desk/analytics/approvals']) o[p] = (await api.O('GET', p)).s;
// notifications for B and S
for (const k of ['B', 'S']) { const n = await api[k]('GET', '/notifications?limit=100'); const n2 = n.s < 300 ? n : await api[k]('GET', '/notifications/inbox?limit=100'); o['notif_' + k] = n2.s + ' approval-related ' + ((n2.t.match(/approv/gi) || []).length) + ' QA PA T0 mentions ' + ((n2.t.match(/QA PA T0/g) || []).length) + ' sample ' + (n2.t.match(/.{0,120}approv.{0,160}/i) || [''])[0]; }
// N1
const rnd = await api.B('GET', '/desk/approvals/' + crypto.randomUUID()); const d2 = await api.B('GET', '/desk/approvals/' + R.R21.id);
const d2act = await api.B('POST', `/desk/tickets/${R.R21.t}/approvals/${R.R21.id}/approve`, {});
result('N1', rnd.s === 404 && d2.s === 404 && d2act.s === 404 && !d2.t.includes('QA PA') ? 'PASS' : 'FAIL', `random id -> ${rnd.s}; Dept 2 item as B -> ${d2.s} (no data ${!d2.t.includes('QA PA')}); approve it -> ${d2act.s}`);
return o;
