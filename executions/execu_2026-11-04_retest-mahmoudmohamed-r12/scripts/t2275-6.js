const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A } = Z;
const c = {}; for (const k of ['A1', 'A2', 'A3']) { const r = await M.openCount({ api, X }, U[k]); c[k] = { deptA: Object.entries(r.m).filter(([k2]) => k2.startsWith('A:') && !/Closed/.test(k2)).reduce((s, [, v]) => s + v, 0), all: Object.entries(r.m).filter(([k2]) => !/Closed/.test(k2)).reduce((s, [, v]) => s + v, 0) }; }
o.counts = c; const T = Math.max(...Object.values(c).map(x => x.deptA)) + 1; o.threshold = T;
o.prefs = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true, department_threshold_enabled: true, department_threshold: T }));
o.run = []; const ids = [];
for (let i = 1; i <= 6; i++) { const r = await M.rrRun(Z, E, 'SEQ thr ' + i, 'medium', 15000); o.run.push(r.owner); ids.push(r.id); }
o.ids = ids; o.lastAuto = await M.auto(Z, E, ids[ids.length - 1]);
return o;
