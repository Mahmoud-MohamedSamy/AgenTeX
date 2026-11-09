const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/';
const D = JSON.parse(fs.readFileSync(RUN + 'data.json', 'utf8')); const T = D.tk; const O = '97be04b6-0a08-4883-aa51-e1650b11cab7', A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const o = {}; const uuid = () => require('crypto').randomUUID(); const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
// 1 strict (admin on t9)
o.i1_edit = full(await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${T.t9}`, { data: [{ field: 'description', value: { kind: 'string', value: 'qa strict' } }] }));
o.i1_status = full(await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${T.t9}`, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] }));
o.i1_tag = full(await api('o', 'POST', `desk:/desk/tickets/${T.t9}/tags`, { names: ['qa-rt13-2754'] }));
o.i1_comment = full(await api('o', 'POST', `desk:/desk/tickets/${T.t9}/comments`, { body: 'QA RT13 2754', is_public: false }));
o.i1_ctrl_comment = full(await api('o', 'POST', `desk:/desk/tickets/${D.control}/comments`, { body: 'QA RT13 2754 control', is_public: false }));
// 3 order
const bp = (await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${D.bpId}`)).j?.data?.definition; o.i3_order = (bp?.transitions || []).filter(t => t.fromStateId === 'Open').map(t => t.id).join(',');
o.i3_reorder = full(await api('o', 'PUT', `desk:/modules/${X.TK}/blueprints/${D.bpId}`, { definition: { ...bp, transitions: [...bp.transitions.filter(t => t.id === 'rate'), ...bp.transitions.filter(t => t.id !== 'rate')] }, isActive: true }));
o.i3_after = ((await api('o', 'GET', `desk:/modules/${X.TK}/blueprints/${D.bpId}`)).j?.data?.definition?.transitions || []).filter(t => t.fromStateId === 'Open').map(t => t.id).join(',');
// 4 check
o.i4_zero = full(await run('o', T.t7, 'go', 'Open', { fields: { qa_ndc_amount: 0 } })); o.i4_five = full(await run('o', T.t7, 'go', 'Open', { fields: { qa_ndc_amount: 5 } })); o.i4_state = await st(T.t7);
// 5 approval
o.i5_none = full(await run('o', T.t8, 'hold', 'Open', {})); o.i5_with = full(await run('o', T.t8, 'hold', 'Open', { approval: { subject: 'QA RT13 2754 approval', approver_user_ids: [A3], description: 'QA' } })); o.i5_state = await st(T.t8);
// 15 revoke
const rv = who => api(who, 'POST', `desk:/desk/blueprints/${D.bpId}/revoke`, { ticket_ids: [T.t10], after: null });
o.i15_agent = full(await rv('a')); o.i15_stateAfterAgent = await st(T.t10); o.i15_admin = full(await rv('o')); o.i15_stateAfterAdmin = await st(T.t10);
// 10 rating links
for (const p of ['desk:/desk/happiness-ratings/settings', 'desk:/desk/settings/happiness-rating', 'desk:/desk/happiness/settings']) { const r = await api('o', 'GET', p); if (r.s < 300) { o.i10_settings = p + ' ' + r.t.slice(0, 300); break; } o.i10_try = (o.i10_try || '') + p.split('desk/')[2] + ':' + r.s + ' '; }
fs.writeFileSync(RUN + 's8.json', JSON.stringify(o, null, 1));
return o;
