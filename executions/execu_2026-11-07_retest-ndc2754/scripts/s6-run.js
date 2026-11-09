const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/';
const D = JSON.parse(fs.readFileSync(RUN + 'data.json', 'utf8')); const T = D.g; const B = X.ids.DEPT_B; const A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const o = {}; const uuid = () => require('crypto').randomUUID();
const full = r => `${r.s} ${r.j?.error?.code || ''} ${r.j?.error?.message || ''}`.trim();
const st = async id => { const s = await X.state(id); return s ? (s.activeStates || []).join(',') : 'none'; };
const run = (who, tid, tr, exp, extra = {}) => api(who, 'POST', `desk:/desk/tickets/${tid}/blueprint-transitions/${tr}`, { run_id: uuid(), expected_state_id: exp, fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null, ...extra });
const see = async tid => (await api('a', 'GET', `desk:/modules/${X.TK}/records/${tid}`)).s;
const agentList = async () => { const f = JSON.stringify([{ field: 'subject', operator: 'contains', value: 'QA RT13 2754F G' }]); const r = await api('a', 'GET', `desk:/modules/${X.TK}/records?page=1&per_page=100&filters=${encodeURIComponent(f)}`); return '[' + (r.j?.data?.records || r.j?.data || []).map(x => (x.data || []).find(y => y.field === 'subject')?.value?.value.replace('QA RT13 2754F G', '')).join(',') + ']'; };
// g1: agent runs own step
o.g1_agentRun = full(await run('a', T.g1, 'rate', 'Open')); o.g1_state = await st(T.g1); await sleep(2000); o.g1_agentSeesAfter = await see(T.g1);
o.g1_agentRunAgain = full(await run('a', T.g1, 'back', 'On Hold'));
// g2: admin moves it on
o.g2_adminGo = full(await run('o', T.g2, 'go', 'Open', { fields: { qa_ndc_amount: 5 } })); o.g2_state = await st(T.g2); await sleep(2000); o.g2_agentSeesAfter = await see(T.g2);
// g3: team owner runs it
o.g3_agentRun = full(await run('a', T.g3, 'rate', 'Open')); o.g3_state = await st(T.g3); await sleep(2000); o.g3_agentSeesAfter = await see(T.g3);
// g4: agent's step has a required share
o.g4_agentShareB = full(await run('a', T.g4, 'alt', 'Open', { shares: [{ department_id: B, access: 'read_only' }] })); o.g4_state = await st(T.g4);
if (/^4/.test(o.g4_agentShareB)) { o.g4_agentShareBfull = full(await run('a', T.g4, 'alt', 'Open', { shares: [{ department_id: B, access: 'full' }] })); o.g4_state2 = await st(T.g4); }
o.g4_agentSeesAfter = await see(T.g4);
o.listEnd = await agentList();
fs.writeFileSync(RUN + 's6.json', JSON.stringify(o, null, 1));
return o;
