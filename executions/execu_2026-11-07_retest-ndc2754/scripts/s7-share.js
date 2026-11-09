const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/';
const D = JSON.parse(fs.readFileSync(RUN + 'data.json', 'utf8')); const B = X.ids.DEPT_B, A = X.ids.DEPT_A; const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537', O = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const o = {}; const uuid = () => require('crypto').randomUUID(); const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const owners = (tid, tr, b) => api('o', 'PUT', `desk:/modules/${X.TK}/records/${tid}/blueprint/owners/${tr}`, { userIds: [], teamIds: [], departmentOwners: [], ...b });
// plain share by the agent on their own non-blueprint ticket
const c = await X.ticket('QA RT13 2754 control agent-owned', { owner: A3 }); const C = c.j?.data?.id; o.control = X.err(c); await sleep(5000); o.controlState = await st(C);
for (const m of ['PUT', 'POST', 'PATCH']) { const r = await api('a', m, `desk:/desk/tickets/${C}/shares`, { shares: [{ department_id: B, access: 'read_only' }] }); o['agentPlainShare_' + m] = full(r); if (r.s !== 405) break; }
for (const m of ['PUT', 'POST']) { const r = await api('o', m, `desk:/desk/tickets/${C}/shares`, { shares: [{ department_id: A, access: 'full' }] }); o['adminPlainShareOwn_' + m] = full(r); if (r.s !== 405) break; }
o.controlShares = (await api('o', 'GET', `desk:/desk/tickets/${C}/shares`)).t.slice(0, 250);
// approval step owned by the agent
const g5 = (await X.ticket('QA RT13 2754F G5 agent approval', { owner: O })).j?.data?.id; await sleep(6000); o.g5 = g5;
o.g5_assign = full(await owners(g5, 'hold', { userIds: [A3] }));
o.g5_agentApproval = full(await run('a', g5, 'hold', 'Open', { approval: { subject: 'QA RT13 2754 approval', approver_user_ids: [O], description: 'QA retest' } })); o.g5_state = await st(g5);
D.g.g5 = g5; D.control = C; fs.writeFileSync(RUN + 'data.json', JSON.stringify(D, null, 1));
return o;
