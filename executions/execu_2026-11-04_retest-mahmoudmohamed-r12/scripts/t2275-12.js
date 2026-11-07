const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A, cond } = Z;
const cnt = async k => { const r = await M.openCount({ api, X }, U[k]); return Object.entries(r.m).filter(([x]) => !/Closed/.test(x)).reduce((s, [, v]) => s + v, 0); };
o.counts = { A1: await cnt('A1'), A2: await cnt('A2'), A3: await cnt('A3') };
const T = Math.max(o.counts.A2, o.counts.A3); // everyone except A1 is at/over T
// RR-13 agent-level threshold: dept threshold T, A1 own threshold = A1 + 2
o.p = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true, department_threshold_enabled: true, department_threshold: T, agent_threshold_enabled: true, agent_thresholds: [{ user_id: U.A1, threshold: o.counts.A1 + 2 }] }));
o.prefsRead = JSON.stringify((await api('o', 'GET', `desk:/desk/departments/${A}/round-robin-preferences`)).j.data.agent_thresholds);
o.agentThr = []; for (let i = 1; i <= 3; i++) o.agentThr.push((await M.rrRun(Z, E, 'SEQ athr ' + i, 'medium', 15000)).owner);
// RR-3 exclude: thresholds off, new target pool = team (A3, A2) excluding A3
o.p2 = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true }));
const team = (await api('o', 'GET', 'desk:/desk/teams')).j.data.teams.find(t => t.name === 'QA RT12 2275 team');
const RR = '417590f7-1d83-4e3f-8241-b3f3c291d8bd'; const cur = (await Z.rules('round_robin', A)).find(r => r.id === RR);
const targets = cur.targets.map(t => ({ criteria: t.criteria, method: t.method, pool: t.pool }));
targets.push({ criteria: { conditions: [cond('subject', 'contains', ' EXC')], pattern: null }, method: 'sequential', pool: { kind: 'team', user_ids: [], team_id: team.id, excluded_user_ids: [U.A3] } });
const up = await api('o', 'PUT', `desk:/desk/assignment-rules/${RR}`, { type: 'round_robin', department_id: A, name: cur.name, description: cur.description, is_active: true, execute_on: cur.execute_on, targets, version: cur.version }); o.addExc = X.err(up) + ' ' + (up.j?.error?.details || []).map(d => d.field + ':' + d.issue).join(',');
o.exc = []; for (let i = 1; i <= 3; i++) o.exc.push((await M.rrRun(Z, E, 'EXC ' + i, 'medium', 15000)).owner);
// no method -> refused (EO-6)
const nm = await api('o', 'POST', 'desk:/desk/assignment-rules', { type: 'round_robin', department_id: A, name: 'QA RT12 2275 nomethod', is_active: true, execute_on: ['create'], targets: [{ criteria: { conditions: [], pattern: null }, pool: { kind: 'agents', user_ids: [U.A1], team_id: null, excluded_user_ids: [] } }] }); o.noMethod = X.err(nm) + ' ' + (nm.j?.error?.details || []).map(d => d.field + ':' + d.issue).join(','); if (nm.j?.data?.id) ledger('NDC-2275: rr rule nomethod (should not exist) ' + nm.j.data.id);
// threshold range 1..200
o.thr201 = X.err(await M.setPrefs(api, A, { department_threshold_enabled: true, department_threshold: 201 })); o.thr0 = X.err(await M.setPrefs(api, A, { department_threshold_enabled: true, department_threshold: 0 }));
o.restorePrefs = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true }));
return o;
