// A4 batch 5 (12 Nov): I9 (suspended owner target), I19 (email to role / user field), I20 (template deleted), I21 (email scheduled 60 s), Z18, F18.
const R = {}; const cut = (x, n = 300) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n);
const S = v => ({ kind: 'string', stringValue: v }); const AG = 'd84e18d2-bc99-4087-b1a7-cfb34777a498';
const disp = async (tid, secs = 60) => { await waitExec(tid, 1, secs); await sleep(8000); const raw = arr2((await api('GET', '/workflow/executions?recordId=' + tid)).j?.data).filter(e => e.outcome === 'Fired'); const out = []; for (const e of raw) { const d = (await api('GET', '/workflow/executions/' + e.id)).j?.data; out.push((d?.dispatches || []).map(x => [x.actionType || x.type, x.status, x.lastError || x.errorMessage || ''].join(' ').slice(0, 200))); } return out; };
// templates
const tl = await api('GET', '/desk/email-templates?per_page=200'); const TL = Array.isArray(tl.j?.data) ? tl.j.data : (tl.j?.data?.items || []);
R.templateUseCases = [...new Set(TL.map(t => t.use_case))].slice(0, 30);
const wfT = TL.find(t => /workflow|custom|general/i.test(t.use_case || '')) || TL.find(t => t.notification_type === 'agent');
R.baseTemplate = wfT ? [wfT.name, wfT.use_case, wfT.notification_type] : 'none';
// I20: own template, rule uses it, delete template, fire
const nt = await api('POST', '/desk/email-templates', { name: 'QA AO WF I20 tpl', module: 'desk_tickets', notification_type: 'agent', use_case: wfT ? wfT.use_case : 'workflow.custom', subject: 'QA AO WF I20 {{ticket.subject}}', body_html: '<p>QA AO WF I20</p>' });
const tid = nt.j?.data?.id; R.I20_template = nt.s + ' ' + (tid || cut(nt.t, 200));
if (tid) {
  const r = await mkRule('I20', { kind: 'RecordCreated' }, [{ type: 'Email', emailRecipients: [{ kind: 'user', value: SAMY }], emailTemplateId: tid, emailSubject: 'x', emailBody: 'x' }]);
  R.I20_rule = r.s + (r.err || '');
  const del = await api('DELETE', '/desk/email-templates/' + tid); R.I20_deleteTpl = del.s + ' ' + cut(del.t, 200);
  const t = await mkTicket('I20'); R.I20_dispatch = await disp(t.id);
}
// I19: email to role Manager + user field owner
const roles = arr2((await api('GET', '/iam/org-units')).j?.data); const mgr = roles.find(x => /manager/i.test(x.name || ''));
R.I19_role = mgr ? mgr.name + ' ' + mgr.id : 'no Manager role: ' + roles.map(x => x.name).slice(0, 8).join(',');
if (mgr && wfT) { const r = await mkRule('I19', { kind: 'RecordCreated' }, [{ type: 'Email', emailRecipients: [{ kind: 'role', value: mgr.id }, { kind: 'userfield', value: 'owner' }], emailTemplateId: wfT.id, emailSubject: 'x', emailBody: 'x' }]); R.I19_rule = r.s + (r.err || ''); if (r.id) { const t = await mkTicket('I19'); R.I19_dispatch = await disp(t.id); } }
// I21: scheduled email 60 s
if (wfT) { const r = await mkRule('I21', { kind: 'RecordCreated' }, [{ type: 'Email', delaySeconds: 60, emailRecipients: [{ kind: 'user', value: SAMY }], emailTemplateId: wfT.id, emailSubject: 'x', emailBody: 'x' }]); R.I21_rule = r.s + (r.err || ''); if (r.id) { const t = await mkTicket('I21'); await sleep(20000); R.I21_at20s = await disp(t.id, 30); await sleep(75000); R.I21_at95s = await disp(t.id, 10); } }
// Z18: two actions of one type
const z1 = await mkRule('Z18fu', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('a') } }, { type: 'FieldUpdate', fieldUpdates: { priority: S('high') } }], { isActive: false });
const z2 = await mkRule('Z18own', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: SAMY }, { type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: A1 }], { isActive: false });
R.Z18 = { twoFieldUpdates: z1.s + ' ' + (z1.err || ''), twoOwners: z2.s + ' ' + (z2.err || '') };
// F18: merge edge cases saved and rendered (field update renders text)
const f = await mkRule('F18', { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S('U[${unknown_field}] O[${subject] L[$${x}] R[${recordId}]') } }]);
R.F18_rule = f.s + (f.err || '');
if (f.id) { const t = await mkTicket('F18'); await waitExec(t.id, 1, 45); await sleep(4000); const a = (await api('GET', '/modules/' + T + '/records/' + t.id)).j?.data?.data || []; R.F18_rendered = cut((a.find(x => x.field === 'description') || {}).value, 250); }
// I9: owner assignment to a suspended agent
const u = await api('GET', '/iam/users/' + AG); R.I9_agent = u.s + ' ' + cut({ name: u.j?.data?.name || u.j?.data?.display_name, status: u.j?.data?.status }, 150);
if (u.s === 200) {
  const r = await mkRule('I9', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: AG }]);
  const sus = await api('PATCH', '/iam/users/' + AG, { status: 'Suspended' }); R.I9_suspend = sus.s;
  try { const t = await mkTicket('I9'); R.I9_dispatch = await disp(t.id); R.I9_owner = (await getTicket(t.id)).owner; }
  finally { const back = await api('PATCH', '/iam/users/' + AG, { status: 'Active' }); R.I9_reactivate = back.s + ' ' + cut((await api('GET', '/iam/users/' + AG)).j?.data?.status, 30); }
}
fs.writeFileSync('../a4/b5.json', JSON.stringify(R, null, 1));
return R;
