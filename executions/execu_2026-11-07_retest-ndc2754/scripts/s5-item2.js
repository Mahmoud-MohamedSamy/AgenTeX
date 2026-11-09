const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/';
const D = JSON.parse(fs.readFileSync(RUN + 'data.json', 'utf8')); const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537', O = '97be04b6-0a08-4883-aa51-e1650b11cab7'; const B = X.ids.DEPT_B;
const o = {}; const uuid = () => require('crypto').randomUUID();
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const owners = (tid, tr, b) => api('o', 'PUT', `desk:/modules/${X.TK}/records/${tid}/blueprint/owners/${tr}`, { userIds: [], teamIds: [], departmentOwners: [], ...b });
const see = async tid => (await api('a', 'GET', `desk:/modules/${X.TK}/records/${tid}`)).s;
const agentList = async () => { const f = JSON.stringify([{ field: 'subject', operator: 'contains', value: 'QA RT13 2754F G' }]); const r = await api('a', 'GET', `desk:/modules/${X.TK}/records?page=1&per_page=100&filters=${encodeURIComponent(f)}`); return r.s + ' [' + (r.j?.data?.records || r.j?.data || []).map(x => (x.data || []).find(y => y.field === 'subject')?.value?.value.replace('QA RT13 2754F G', '')).join(',') + ']'; };
// new tickets owned by the admin (owner set on create); marker G matches the blueprint too ("QA RT13 2754" contains)
const T = {}; for (const s of ['g0 baseline', 'g1 user owner', 'g2 moved on', 'g3 team owner', 'g4 agent share']) { const r = await X.ticket('QA RT13 2754F ' + s.replace(/^g/, 'G'), { owner: O }); T[s.split(' ')[0]] = r.j?.data?.id; o['create_' + s.split(' ')[0]] = X.err(r); }
// note: subjects "QA RT13 2754F G0 baseline" … ; list filter uses "2754F G"
await sleep(8000); o.owners = {}; for (const [k, id] of Object.entries(T)) o.owners[k] = (await X.fields(id)).owner === O ? 'admin' : (await X.fields(id)).owner + '/' + await st(id);
o.T = T; D.g = T; fs.writeFileSync(RUN + 'data.json', JSON.stringify(D, null, 1));
o.g0_agentSees = await see(T.g0);
o.g1_beforeAssign = await see(T.g1);
o.g1_assign = full(await owners(T.g1, 'rate', { userIds: [A3] })); o.g1_agentSees = await see(T.g1);
o.g1_agentEdit = full(await api('a', 'PATCH', `desk:/modules/${X.TK}/records/${T.g1}`, { data: [{ field: 'description', value: { kind: 'string', value: 'qa agent edit' } }] }));
o.g1_agentReply = full(await api('a', 'POST', `desk:/desk/tickets/${T.g1}/replies`, { subject: 'QA RT13 2754 reply', body_html: '<p>QA</p>', to: ['qa.rt13@example.com'], cc: [], bcc: [], send: false, is_draft: true }));
o.g1_agentNotOwnedTr = full(await run('a', T.g1, 'go', 'Open', { fields: { qa_ndc_amount: 5 } })); o.g1_stateAfterNotOwned = await st(T.g1);
o.g2_assign = full(await owners(T.g2, 'rate', { userIds: [A3] })); o.g2_agentSees = await see(T.g2);
o.g3_assign = full(await owners(T.g3, 'rate', { teamIds: [D.teamId] })); o.g3_agentSees = await see(T.g3);
o.g4_assign = full(await owners(T.g4, 'alt', { userIds: [A3] })); o.g4_agentSees = await see(T.g4);
o.listWhileOwner = await agentList();
return o;
