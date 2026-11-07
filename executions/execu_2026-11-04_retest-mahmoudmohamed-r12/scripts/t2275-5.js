const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A, cond } = Z;
o.load = []; for (let i = 1; i <= 4; i++) o.load.push((await M.rrRun(Z, E, 'LOAD ' + i)).owner);
// SKP target: pool A1, O, A2 sequential; offline agents not allowed
const RR = '417590f7-1d83-4e3f-8241-b3f3c291d8bd'; const cur = (await Z.rules('round_robin', A)).find(r => r.id === RR);
const targets = cur.targets.map(t => ({ criteria: t.criteria, method: t.method, pool: t.pool }));
targets.push({ criteria: { conditions: [cond('subject', 'contains', ' SKP')], pattern: null }, method: 'sequential', pool: { kind: 'agents', user_ids: [U.A1, U.O, U.A2], team_id: null, excluded_user_ids: [] } });
const up = await api('o', 'PUT', `desk:/desk/assignment-rules/${RR}`, { type: 'round_robin', department_id: A, name: cur.name, description: cur.description, is_active: true, execute_on: cur.execute_on, targets, version: cur.version }); o.addTarget = X.err(up);
o.prefs = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: false }));
const pres = await api('o', 'POST', 'desk:/desk/agents/presence/query', { user_ids: [U.O, U.A1, U.A2, U.A3] }); o.online = arr(pres.j.data.agents).map(a => Z.N[a.user_id] + ':' + a.presence.online + '/' + a.presence.channels.email);
o.skp = []; let first; for (let i = 1; i <= 3; i++) { const r = await M.rrRun(Z, E, 'SKP ' + i); o.skp.push(r.owner); if (!first) first = r.id; }
o.skpHist = await M.hist(Z, E, first);
const b = await M.rrRun(Z, E, 'SEQ offline-pool', 'medium', 25000); o.allOffline = b.owner; o.allOfflineHist = await M.hist(Z, E, b.id); o.allOfflineId = b.id;
return o;
