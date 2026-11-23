// Batch 8: MR-07, IN-01 (direct switch on → restored off), E2E-05, PF-01, OB-07, IN-04 macro, AC-15/16 redo, PS-09 redo, TF-10 attempt.
const out = {}; const R = {}; const TK = {};
const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7', TEAM = 'fa641d99-ce7f-47ca-94e7-b15113bd4913';
const CR = { kind: 'RecordCreated' }, UP = { kind: 'RecordUpdated' };
const mark = FU({ qa_ndc_agency_code: 'WF' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; if (!t.id) out[k + ' tk'] = t.s + ' ' + t.err; return t.id; };
const disp = async (t, r) => (await execs(TK[t], R[r])).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '')).join(','));
const getRule = async id => (await allRules()).find(x => x.id === id);
const fullPatch = async (id, change) => { const g = await getRule(id); const body = { moduleId: T, name: g.name, description: g.description, isActive: g.isActive, mode: g.mode, trigger: g.trigger, criteria: g.criteria, actions: g.actions.map(({ id, ...a }) => a), departmentIds: g.departmentIds, version: g.version, ...change(g) }; const r = await api('PATCH', '/workflow/rules/' + id, body); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); };
// templates
const tl = (await api('GET', '/desk/email-templates')).j?.data?.email_templates || [];
const agentTpl = tl.find(t => t.notification_type === 'agent' && t.module === 'desk_tickets'); const contactTpl = tl.find(t => t.notification_type === 'contact' && t.module === 'desk_tickets');
out.tpl = { agent: agentTpl && agentTpl.name, contact: contactTpl && contactTpl.name, types: [...new Set(tl.map(t => t.notification_type))] };
// AC-15 redo
const kinds = { Team: TEAM, Contact: 'contact_id', ContactBlank: '', UserFieldCreatedBy: 'created_by' };
for (const [k, v] of Object.entries(kinds)) await rule('AC15' + k, CR, [{ type: 'Email', emailRecipients: [{ kind: k.startsWith('Contact') ? 'Contact' : k.startsWith('UserField') ? 'UserField' : k, value: v }], emailSubject: 'QA WF AC15 ' + k, emailBody: 'QA WF AC15 ${subject}' }]);
{ const us = arr((await api('GET', '/iam/users?take=200')).j?.data); const orgs = arr((await api('GET', '/iam/org-units')).j?.data); const tid = u => u.userId || u.id; const byOrg = {}; for (const u of us) (byOrg[u.orgUnitId] = byOrg[u.orgUnitId] || []).push(tid(u)); const safe = orgs.find(o => !(byOrg[o.id] || []).length); out.roleEmpty = safe ? safe.name : 'none'; if (safe) await rule('AC15OrgUnit', CR, [{ type: 'Email', emailRecipients: [{ kind: 'OrgUnit', value: safe.id }], emailSubject: 'QA WF AC15 role', emailBody: 'x' }]); }
if (agentTpl) await rule('AC15tpl', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'User', value: OWN }] }]);
if (agentTpl) await rule('AC16c', CR, [{ type: 'Email', emailTemplateId: agentTpl.id, emailRecipients: [{ kind: 'Contact', value: 'contact_id' }] }]);
// MR-07
await rule('MR07x', CR, [{ ...FU({ qa_ndc_company_name: 'MR07-v1' }), delaySeconds: 90 }]);
// IN-01
const ns0 = (await api('GET', '/desk/assignment/notification-settings')).j?.data; fs.writeFileSync(RUN + '/out/assign-switch-orig.json', JSON.stringify(ns0)); ledger('assignment switches saved out/assign-switch-orig.json direct=' + ns0.direct_rules_enabled);
const ar = await api('POST', '/desk/assignment-rules', { type: 'direct', name: 'QA WF IN01 ar2', description: 'QA', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [{ field_key: 'subject', operator: 'starts_with', value: 'QA WF IN01x ' }], pattern: '1' }, coming_to_department_id: DEPT2, move_to_department_id: null, assign: { kind: 'agent', user_id: DEV2, team_id: null } }] });
const AR = ar.j?.data?.id || ar.j?.data?.rule?.id; if (AR) ledger(`assignment rule "QA WF IN01 ar2" ${AR}`);
await rule('IN01x', CR, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: TU1 }]);
// E2E-05
const h5 = await hook();
await rule('E2E05x', CR, [WH(h5, '{"id":"${recordId}"}')]);
await rule('E2E05y', UP, [FU({ qa_ndc_company_name: 'E2E05-edit' })], { noGuard: true, criteria: AND(guard('QA WF E2E05x '), cmp('qa_ndc_agency_code', 'Equal', S('FROM-RECEIVER'))) });
// PF-01
await rule('PF01x', CR, [FU({ qa_ndc_company_name: 'PF' })]);
// IN-04 macro
const mc = await api('POST', '/desk/macros', { name: 'QA WF IN04 macro', department_id: DEPT2, actions: [{ type: 'field_update', field: 'classification', value: 'problem' }] });
let MAC = mc.j?.data?.id || mc.j?.data?.macro?.id; out.macro = mc.s + ' ' + (MAC || mc.t.slice(0, 400)); if (MAC) ledger(`macro "QA WF IN04 macro" ${MAC}`);
await rule('IN04', UP, [FU({ qa_ndc_company_name: 'MACRO-EDIT' })], { criteria: changed('classification') });
await sleep(2000);
// tickets
for (const k of ['Team', 'Contact', 'ContactBlank', 'UserFieldCreatedBy', 'OrgUnit', 'tpl']) if (R['AC15' + k]) await tk('AC15' + k, 'AC15' + k);
if (R.AC16c) await tk('AC16c', 'AC16c');
await tk('MR07x', 'MR07x');
// switch direct ON only around the IN-01 ticket
const on = await api('PUT', '/desk/assignment/notification-settings', { ...ns0, direct_rules_enabled: true }); out.switchOn = on.s; ledger('direct switch ON ' + on.s);
try { await tk('IN01x', 'IN01x'); await sleep(20000); const g = await getTicket(TK.IN01x); out.IN01 = { owner: g.owner === TU1 ? 'Test User 1 (workflow)' : g.owner === DEV2 ? 'Dev Team 2 (direct rule)' : g.owner, run: await disp('IN01x', 'IN01x'), history: (await api('GET', `/desk/tickets/${TK.IN01x}/history`)).t.slice(0, 1200) }; }
finally { const off = await api('PUT', '/desk/assignment/notification-settings', { ...ns0 }); const now = (await api('GET', '/desk/assignment/notification-settings')).j?.data; out.switchRestored = off.s + ' direct=' + now.direct_rules_enabled; ledger('direct switch restored ' + out.switchRestored); }
await tk('E2E05x', 'E2E05x');
if (MAC) await tk('IN04', 'IN04');
// MR-07 edit while pending
await sleep(5000); out.mr07patch = await fullPatch(R.MR07x, g => ({ actions: [{ order: 0, delaySeconds: 90, ...FU({ qa_ndc_company_name: 'MR07-v2' }) }] }));
// E2E-05 receiver
const w5 = await waitHook(h5, 1, 60); if (w5) { const b = JSON.parse(w5[0].content || '{}'); out.e2e05recv = b.id === TK.E2E05x; await patchTicket(b.id, { qa_ndc_agency_code: 'FROM-RECEIVER' }); }
// IN-04 apply macro
if (MAC) { const ap = await api('POST', '/desk/tickets/bulk/macro', { ticket_ids: [TK.IN04], macro_id: MAC }); out.macroApply = ap.s + ' ' + ap.t.slice(0, 200); }
// PF-01 proper: 10 sequential tickets, poll each right away
const lat = []; for (let i = 0; i < 10; i++) { const s = Date.now(); const id = await tk('PF' + i, 'PF01x', {}, 'n' + i); let d = null; while (Date.now() - s < 90000) { if ((await getTicket(id)).qa_ndc_company_name === 'PF') { d = Date.now() - s; break; } await sleep(700); } lat.push(d); }
out.PF01 = { ms: lat, median: [...lat].sort((a, b) => a - b)[5] };
// PS-09 redo
const pr = await mkRule('PS09x', CR, [mark]); out.PS09 = { del: (await api('DELETE', '/workflow/rules/' + pr.id)).s }; await sleep(5000);
const bi = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); out.PS09.inBin = bi ? bi.record_label + ' / ' + bi.module_label : false;
if (bi) { out.PS09.restore = (await api('POST', '/audit/recycle-bin/restore', { ids: [bi.id] })).s; await sleep(5000); const back = await getRule(pr.id); out.PS09.afterRestore = back ? { name: back.name, active: back.isActive } : 'not back'; out.PS09.del2 = (await api('DELETE', '/workflow/rules/' + pr.id)).s; await sleep(5000); const b2 = arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); out.PS09.purge = b2 ? (await api('POST', '/audit/recycle-bin/delete', { ids: [b2.id] })).s : 'not in bin'; await sleep(4000); out.PS09.leftInBin = !!arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === pr.id); }
await sleep(100000);
const v = {};
for (const k of ['Team', 'Contact', 'ContactBlank', 'UserFieldCreatedBy', 'OrgUnit', 'tpl']) if (TK['AC15' + k]) v['AC15' + k] = await disp('AC15' + k, 'AC15' + k);
if (TK.AC16c) v.AC16c = await disp('AC16c', 'AC16c');
v.MR07 = { value: (await getTicket(TK.MR07x)).qa_ndc_company_name, patch: out.mr07patch, run: await disp('MR07x', 'MR07x') };
v.E2E05 = { recv: out.e2e05recv, company: (await getTicket(TK.E2E05x)).qa_ndc_company_name, editRuns: (await execs(TK.E2E05x, R.E2E05y)).map(outcome), hooks: (await hookReqs(h5)).length };
if (MAC) v.IN04 = { company: (await getTicket(TK.IN04)).qa_ndc_company_name, cls: (await getTicket(TK.IN04)).classification, run: await disp('IN04', 'IN04'), apply: out.macroApply };
const au = await api('GET', '/audit/events?limit=100'); const evs = arr(au.j?.data); v.OB07 = { total: evs.length, wf: evs.filter(e => /workflow/i.test(e.app_key + ' ' + e.action + ' ' + e.target_type)).slice(0, 15).map(e => e.app_key + ' ' + e.action + ' ' + e.target_type + ' ' + (e.target_label || '').slice(0, 40)) };
out.v = v; out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b8.json', JSON.stringify(out, null, 1));
return out;
