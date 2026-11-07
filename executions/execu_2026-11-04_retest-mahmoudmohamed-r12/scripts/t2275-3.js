const Z = require("./p2275.js")({api, X, sleep, arr, ledger, log}); const o = {};
const L = require('fs').readFileSync('../ledger.md', 'utf8').split('\n').filter(l => /"QA RT12 2275 SEQ upd \d"/.test(l)).map(l => l.match(/" ([0-9a-f-]{36})/)[1]);
o.n = L.length; o.seq = [];
for (const id of L) { const r = await api('o', 'POST', `desk:/desk/tickets/${id}/assign`, { owner_id: null, team_id: null }); await sleep(2000); const w = await Z.waitOwner(id, 15000); o.seq.push((w.owner || '-') + (r.s !== 200 ? ' a' + r.s : '')); }
const h = await api('o', 'GET', `desk:/desk/tickets/${L[1]}/history`); o.hist2 = arr(h.j.data).map(e => [e.action, e.field_key, Z.N[e.old_value] || e.old_value, Z.N[e.new_value] || e.new_value, e.actor?.kind, e.actor?.label, e.source].join(' | '));
return o;
