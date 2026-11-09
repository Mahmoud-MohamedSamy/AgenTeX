const __dirname_ids = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/ids.json';
const fs = require('fs'); const o = {}; const O = '97be04b6-0a08-4883-aa51-e1650b11cab7', A3 = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
o.meA = (await api('a', 'GET', 'desk:/iam/me')).j?.data?.email?.split('@')[0];
const ids = JSON.parse(fs.readFileSync(__dirname_ids, 'utf8'));
for (const [k, n, ag] of [['DEPT_A', 'QA RT13 2754 Dept A', [O, A3]], ['DEPT_B', 'QA RT13 2754 Dept B', []]]) {
  const r = await api('o', 'POST', 'desk:/desk/departments', { name: n, description: 'QA retest NDC-2754 7 Nov - safe to delete', visibility: 'private', routing_strategy: 'round_robin', is_active: true, agent_user_ids: ag });
  o[k] = X.err(r); ids[k] = r.j?.data?.id; if (ids[k]) ledger(`department "${n}" ${ids[k]} agents ${ag.length}`); }
fs.writeFileSync(__dirname_ids, JSON.stringify(ids)); o.ids = ids;
return o;
