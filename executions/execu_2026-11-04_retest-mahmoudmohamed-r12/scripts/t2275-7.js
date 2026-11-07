const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A } = Z;
const led = require('fs').readFileSync('../ledger.md', 'utf8'); const id = s => (led.match(new RegExp('"QA RT12 2275 ' + s + '" ([0-9a-f-]{36})')) || [])[1];
const back = ['SEQ thr 4', 'SEQ thr 5', 'SEQ thr 6'].map(id); const st = async () => Promise.all(back.map(async b => (await Z.owner(b)).owner || '-'));
o.before = await st();
// 1) Assign tickets on closure
o.p1 = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true, department_threshold_enabled: true, department_threshold: 6, assign_on_closure: true }));
const c1 = id('SEQ upd 3'); o.close1owner = (await Z.owner(c1)).owner; const t0 = Date.now();
o.close1 = X.err(await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${c1}`, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] }));
let s; for (let i = 0; i < 12; i++) { await sleep(2500); s = await st(); if (s.some(x => x !== '-')) break; } o.afterClose1 = s; o.close1Secs = Math.round((Date.now() - t0) / 1000);
o.auto1 = await Promise.all(back.map(b => M.auto(Z, E, b)));
// 2) Assign backlogs (closure off)
o.p2 = X.err(await M.setPrefs(api, A, { assign_to_offline_agents: true, department_threshold_enabled: true, department_threshold: 6, assign_on_closure: false, assign_backlogs: true }));
const c2 = id('SEQ upd 1'); o.close2owner = (await Z.owner(c2)).owner; const t1 = Date.now();
o.close2 = X.err(await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${c2}`, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] }));
const pre = await st(); let s2; for (let i = 0; i < 30; i++) { await sleep(5000); s2 = await st(); if (s2.filter(x => x !== '-').length > pre.filter(x => x !== '-').length) break; } o.afterClose2 = s2; o.close2Secs = Math.round((Date.now() - t1) / 1000);
o.auto2 = await Promise.all(back.map(b => M.auto(Z, E, b)));
return o;
