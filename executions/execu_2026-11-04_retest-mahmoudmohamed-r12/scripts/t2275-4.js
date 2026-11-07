const Z = require("./p2275.js")({api, X, sleep, arr, ledger, log}); const o = {};
const L = require('fs').readFileSync('../ledger.md', 'utf8').split('\n').filter(l => /"QA RT12 2275 SEQ upd \d"/.test(l)).map(l => l.match(/" ([0-9a-f-]{36})/)[1]);
o.seq = []; const pri = ['low', 'medium', 'high'];
for (let i = 0; i < L.length; i++) { const id = L[i]; const r = await api('o', 'PATCH', `desk:/modules/${X.TK}/records/${id}`, { data: [{ field: 'priority', value: { kind: 'string', value: pri[i % 3] } }] }); const w = await Z.waitOwner(id, 20000); o.seq.push((w.owner || '-') + (r.s !== 200 ? ' p' + r.s + ' ' + r.t.slice(0, 120) : '')); }
const h = await api('o', 'GET', `desk:/desk/tickets/${L[0]}/history`); o.hist1 = arr(h.j.data).map(e => [e.action, e.field_key, Z.N[e.old_value] || e.old_value, Z.N[e.new_value] || e.new_value, e.actor?.kind, e.actor?.label, e.source].join(' | '));
return o;
