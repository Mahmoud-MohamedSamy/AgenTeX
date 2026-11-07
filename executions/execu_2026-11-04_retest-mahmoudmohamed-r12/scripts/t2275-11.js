const M = require("./p2275.js"); const Z = M({api, X, sleep, arr, ledger, log}); const o = {}; const E = { api, X, sleep, arr }; const { U, A } = Z;
// GEN-11 audit log: events about assignment rules / RR preferences in the last 2 hours
const ev = await api('o', 'GET', 'desk:/audit/events?app_key=desk&limit=200'); const L = arr(ev.j?.data?.items || ev.j?.data);
o.auditStatus = ev.s + ' n=' + L.length + ' keys=' + Object.keys(L[0] || {}).join(',');
const rel = L.filter(e => /assign|round.?robin|preferen/i.test(JSON.stringify([e.action, e.event_type, e.resource_type, e.entity_type, e.target_type, e.summary, e.description]))).slice(0, 25);
o.audit = rel.map(e => [e.occurred_at || e.created_at, e.action || e.event_type, e.resource_type || e.entity_type || e.target_type, (e.actor_email || e.actor?.email || e.actor_id || '').toString().split('@')[0], JSON.stringify(e.resource_name || e.target_name || e.summary || e.description || '').slice(0, 80)].join(' | '));
// NOT-1 for round robin: A3 got a notice for the backlog tickets assigned to A3?
const led = require('fs').readFileSync('../ledger.md', 'utf8');
const nr = await api('a', 'GET', 'desk:/notifications?limit=100'); const N = arr(nr.j?.data);
o.A3notifs = N.filter(n => /QA RT12 2275/.test(n.title)).map(n => n.title + ' | ' + n.created_at.slice(11, 19));
// rules list after the round: names + versions (for cleanup ledger)
o.direct = (await Z.rules('direct')).filter(r => /QA RT12/.test(r.name)).map(r => r.id + ' ' + r.name);
o.rr = (await Z.rules('round_robin', A)).map(r => r.id + ' ' + r.name);
return o;
