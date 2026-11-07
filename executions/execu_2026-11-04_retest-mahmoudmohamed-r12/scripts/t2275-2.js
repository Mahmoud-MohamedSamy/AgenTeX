const Z = require("./p2275.js")({api, X, sleep, arr, ledger, log}); const o = {}; const { U, A } = Z;
const RR = '417590f7-1d83-4e3f-8241-b3f3c291d8bd';
const cur = (await Z.rules('round_robin', A)).find(r => r.id === RR);
const body = { type: cur.type, department_id: cur.department_id, name: cur.name, description: cur.description, is_active: true, execute_on: ['create', 'update'], targets: cur.targets.map(t => ({ criteria: t.criteria, method: t.method, pool: t.pool })) };
const up = await api('o', 'PUT', `desk:/desk/assignment-rules/${RR}`, { ...body, version: cur.version }); o.update = X.err(up) + ' v' + up.j?.data?.version + ' exec=' + JSON.stringify(up.j?.data?.execute_on);
const nul = id => api('o', 'PATCH', `desk:/modules/${X.TK}/records/${id}`, { data: [{ field: 'owner', value: { kind: 'null' } }] });
o.seq = [];
for (let i = 1; i <= 6; i++) { const id = await Z.tk('SEQ upd ' + i); await sleep(3000); const p = await nul(id); const w = await Z.waitOwner(id, 20000); o.seq.push((w.owner || '-') + (p.s !== 200 ? ' patch' + p.s : '')); if (i === 1) o.firstId = id; }
const h = await api('o', 'GET', `desk:/desk/tickets/${o.firstId}/history`); o.hist1 = arr(h.j.data).map(e => [e.action, e.field_key, Z.N[e.old_value] || e.old_value, Z.N[e.new_value] || e.new_value, e.actor?.kind, e.actor?.label, e.source].join(' | '));
return o;
