const fs = require('fs'); const F = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_retest-mahmoudmohamed-r14/ids.json';
const o = {}; const O = '97be04b6-0a08-4883-aa51-e1650b11cab7', AG = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
o.meA = (await api('a', 'GET', 'desk:/iam/me')).j?.data?.id === AG;
const ids = JSON.parse(fs.readFileSync(F, 'utf8'));
for (const [k, n, ag] of [['DEPT_A', 'QA RT14 2754 Dept A', [O, AG]], ['DEPT_B', 'QA RT14 2754 Dept B', []]]) {
  const r = await api('o', 'POST', 'desk:/desk/departments', { name: n, description: 'QA retest NDC-2754 8 Nov - safe to delete', visibility: 'private', routing_strategy: 'round_robin', is_active: true, agent_user_ids: ag });
  o[k] = X.err(r); ids[k] = r.j?.data?.id; if (ids[k]) ledger(`department "${n}" ${ids[k]} agents ${ag.length} NDC-2754`); }
ids.OWNER = O; ids.AG = AG; fs.writeFileSync(F, JSON.stringify(ids)); o.ids = ids; return o;
