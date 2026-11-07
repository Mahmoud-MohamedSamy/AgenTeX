const o = {}; const M = require('./p2275.js'); const Z = M({ api, X, sleep, arr, ledger, log });
const ids = []; for (const s of ['t1 check', 't2 strict', 't3 approval', 't4 share', 't5 revoke']) { const r = await X.ticket('QA RT12 2754F ' + s); ids.push(r.j?.data?.id); }
await sleep(8000); o.states = []; for (const id of ids) { const s = await X.state(id); o.states.push(s && (s.currentStateId || JSON.stringify(s).slice(0, 80))); }
// give t2 and t5 to agent A3 (fedelav803) so the agent's own actions can be tested
for (const id of [ids[1], ids[4]]) o['assign_' + id.slice(0, 8)] = X.err(await api('o', 'POST', `desk:/desk/tickets/${id}/assign`, { owner_id: Z.U.A3, team_id: null }));
o.ids = ids; const raw = await api('o', 'GET', `desk:/modules/${X.TK}/records/${ids[0]}/blueprint-state`); o.stateRaw = raw.t.slice(0, 1500);
return o;
