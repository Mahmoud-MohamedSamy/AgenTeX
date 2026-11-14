// control: blueprint after-action on a text field (description). node f2d.js prep|clean
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = __dirname + '/f2d.json'; const v = x => ({ kind: 'string', value: String(x) });
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
(async () => {
  if (process.argv[2] === 'clean') { const M = JSON.parse(fs.readFileSync(OUT, 'utf8')); const c = ['t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${M.T}`)).status];
    await call('owner', 'POST', `/desk/blueprints/${M.B}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${M.B}`)).status); console.log('clean', c.join(' ')); return; }
  const def = { name: 'QA BP F2D', description: 'QA A6 F2 control - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP F2D ' },
    states: [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })],
    transitions: [{ id: 'desc', name: 'QA F2 desc', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: {}, after: { actions: [{ kind: 'setField', field: 'description', value: 'QA F2D set by blueprint' }] } }, { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
  const b = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true });
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', 'QA BP F2D control ticket'], ['department', CS], ['status', 'Open']].map(([f, x]) => ({ field: f, value: v(x) })) });
  const M = { B: b.json?.data?.id, T: r.json?.data?.id }; fs.writeFileSync(OUT, JSON.stringify(M));
  for (let i = 0; i < 15; i++) { const s = ((await call('owner', 'GET', `/modules/${TK}/records/${M.T}/blueprint-state`)).json?.data?.states || [])[0]; if (s) break; await sleep(2000); }
  M.run = (await call('owner', 'POST', `/desk/tickets/${M.T}/blueprint-transitions/desc`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} })).status; await sleep(3000);
  const h = await call('owner', 'GET', `/desk/tickets/${M.T}/history`); M.api = (h.json?.data || []).map(x => x.action + ':' + x.field_key + ':' + x.source); console.log(JSON.stringify(M));
})();
