const TK = 'e8e5e302-3873-4e32-b945-c9cd25c7659d', QD = '9a7e391c-be72-49e4-a1cf-763e5c88e23d';
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'business', ...x });
const def = { name: 'QA BP A6 revoke', description: 'QA', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QD, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP A6R ' }, states: [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], transitions: [{ id: 'go', name: 'QA go', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: {}, after: { actions: [] } }, { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
const b = await api('POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); const BID = b.j?.data?.id;
const enc = v => ({ kind: 'string', value: v });
const t = await api('POST', `/modules/${TK}/records`, { data: [['subject', 'QA BP A6R revoke history'], ['status', 'Open'], ['department', QD]].map(([f, v]) => ({ field: f, value: enc(v) })) }); const TID = t.j?.data?.id;
fs.writeFileSync('../a6/rev.json', JSON.stringify({ BID, TID }));
let s = null; for (let i = 0; i < 10 && !s; i++) { await sleep(2000); s = arr((await api('GET', `/modules/${TK}/records/${TID}/blueprint-state`)).j?.data?.states)[0]; }
const rv = await api('POST', `/desk/tickets/${TID}/blueprint/revoke`, {}); await sleep(3000);
const H = async () => arr((await api('GET', `/desk/tickets/${TID}/history`)).j?.data).map(x => x.action + (x.field_key ? ':' + x.field_key : '') + ' @' + String(x.occurred_at).slice(11, 19));
const h1 = await H(); await sleep(15000); const h2 = await H();
const act = arr((await api('GET', `/desk/tickets/${TID}/activity`)).j?.data).map(x => x.action);
log(JSON.stringify({ bp: b.s, ticket: t.s, entered: !!s, revoke: rv.s + ' ' + rv.t.slice(0, 150), hist3s: h1, hist18s: h2, activity: act }, null, 1));
