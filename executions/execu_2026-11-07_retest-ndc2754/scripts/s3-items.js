const D = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/data.json', 'utf8')); const T = D.tk; const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537'; const A = X.ids.DEPT_A, B = X.ids.DEPT_B;
const o = {}; const uuid = () => require('crypto').randomUUID();
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const owners = (tid, tr, b) => api('o', 'PUT', `desk:/modules/${X.TK}/records/${tid}/blueprint/owners/${tr}`, { userIds: [], teamIds: [], departmentOwners: [], ...b });
const see = async (tid) => (await api('a', 'GET', `desk:/modules/${X.TK}/records/${tid}`)).s;
const agentList = async () => { const f = JSON.stringify([{ field: 'subject', operator: 'contains', value: 'QA RT13 2754F' }]); const r = await api('a', 'GET', `desk:/modules/${X.TK}/records?page=1&per_page=100&filters=${encodeURIComponent(f)}`); return r.s + ' ' + (r.j?.data?.records || r.j?.data || []).map(x => (x.data || []).find(y => y.field === 'subject')?.value?.value.replace('QA RT13 2754F ', '')).join(','); };
o.owner_t1 = (await X.fields(T.t1)).owner;
// ITEM 6
o.i6_ownDept = full(await run('o', T.t5, 'alt', 'Open', { shares: [{ department_id: A, access: 'full' }] })); o.i6_ownDept_state = await st(T.t5);
o.i6_ownDept_shares = (await api('o', 'GET', `desk:/desk/tickets/${T.t5}/shares`)).t.slice(0, 200);
o.i6_ownDept_readOnly = full(await run('o', T.t5, 'alt', 'Open', { shares: [{ department_id: A, access: 'read' }] })); 
o.i6_mixed = full(await run('o', T.t5, 'alt', 'Open', { shares: [{ department_id: A, access: 'full' }, { department_id: B, access: 'full' }] })); o.i6_mixed_state = await st(T.t5);
o.i6_none = full(await run('o', T.t6, 'alt', 'Open', {})); 
o.i6_deptB = full(await run('o', T.t6, 'alt', 'Open', { shares: [{ department_id: B, access: 'full' }] })); o.i6_deptB_state = await st(T.t6);
o.i6_deptB_shares = (await api('o', 'GET', `desk:/desk/tickets/${T.t6}/shares`)).t.slice(0, 300);
// plain Share action to own dept (reference)
o.i6_plainShareOwn = full(await api('o', 'POST', `desk:/desk/tickets/${T.t7}/shares`, { shares: [{ department_id: A, access: 'full' }] }));
// ITEM 2 baseline
o.i2_t0_agentSees = await see(T.t0);
o.i2_listBefore = await agentList();
// t1: user owner
o.i2_t1_assign = full(await owners(T.t1, 'rate', { userIds: [A3] }));
o.i2_t1_agentSees = await see(T.t1); o.i2_listAfterAssign = await agentList();
o.i2_t1_agentEdit = full(await api('a', 'PATCH', `desk:/modules/${X.TK}/records/${T.t1}`, { data: [{ field: 'description', value: { kind: 'string', value: 'qa agent edit' } }] }));
o.i2_t1_agentReply = full(await api('a', 'POST', `desk:/desk/tickets/${T.t1}/replies`, { subject: 'QA RT13 2754 reply', body_html: '<p>QA</p>', to: ['qa.rt13@example.com'], cc: [], bcc: [], send: false, is_draft: true }));
o.i2_t1_agentOtherTr = full(await run('a', T.t1, 'go', 'Open', { fields: { qa_ndc_amount: 5 } }));
o.i2_t1_agentRun = full(await run('a', T.t1, 'rate', 'Open')); o.i2_t1_state = await st(T.t1);
await sleep(2000); o.i2_t1_agentSeesAfter = await see(T.t1);
// t2: owner moves the ticket on
o.i2_t2_assign = full(await owners(T.t2, 'rate', { userIds: [A3] })); o.i2_t2_agentSees = await see(T.t2);
o.i2_t2_ownerGo = full(await run('o', T.t2, 'go', 'Open', { fields: { qa_ndc_amount: 5 } })); o.i2_t2_state = await st(T.t2);
await sleep(2000); o.i2_t2_agentSeesAfter = await see(T.t2);
// t3: team owner
o.i2_t3_assign = full(await owners(T.t3, 'rate', { teamIds: [D.teamId] })); o.i2_t3_agentSees = await see(T.t3);
// t4: agent runs a step with a required share
o.i2_t4_assign = full(await owners(T.t4, 'alt', { userIds: [A3] })); o.i2_t4_agentSees = await see(T.t4);
o.i2_t4_agentRunShare = full(await run('a', T.t4, 'alt', 'Open', { shares: [{ department_id: B, access: 'read' }] })); o.i2_t4_state = await st(T.t4);
o.i2_t4_agentSeesAfter = await see(T.t4);
o.i2_listEnd = await agentList();
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/s3.json', JSON.stringify(o, null, 1));
return o;
