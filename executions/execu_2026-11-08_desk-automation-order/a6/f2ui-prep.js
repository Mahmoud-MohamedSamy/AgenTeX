// F2 screen check prep/clean. node f2ui-prep.js prep|clean. Blueprint "QA BP F2U", 2 tickets with a full QA address. Field kept until k-clean.js.
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', K = 'qa_bp_f2_address'; const OUT = __dirname + '/f2ui.json';
const enc = v => (v && typeof v === 'object') ? { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } : { kind: 'string', value: String(v) };
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, o = {}) => ({ id, name: 'QA F2 ' + id, fromStateId: a, toStateId: b, before: {}, during: o.during || {}, after: { actions: o.after || [] } });
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
const FULL = { street: '1 QA Street', city: 'Cairo', state: 'Cairo Gov', zip: '11511', country: 'Egypt' };
(async () => {
  if (process.argv[2] === 'clean') { const M = JSON.parse(fs.readFileSync(OUT, 'utf8')); const c = []; for (const t of M.T) c.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    await call('owner', 'POST', `/desk/blueprints/${M.B}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${M.B}`)).status); console.log('clean', c.join(' ')); return; }
  const def = { name: 'QA BP F2U', description: 'QA A6 F2 screen - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP F2U ' },
    states: [st('Open'), st('On Hold'), st('Escalated'), st('Closed', { isTerminal: true })],
    transitions: [tr('form', 'Open', 'On Hold', { during: { requiredFields: [{ name: K, datatype: { key: 'address' }, required: true }], itemOrder: ['field:' + K] } }),
      tr('city', 'Open', 'Escalated', { after: [{ kind: 'setField', field: K, value: { city: 'Giza' } }] }), tr('end', 'On Hold', 'Closed'), tr('end2', 'Escalated', 'Closed')] };
  const b = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); const M = { B: b.json?.data?.id, T: [] };
  for (const s of ['form ticket', 'history ticket']) { const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', 'QA BP F2U ' + s], ['department', CS], ['status', 'Open']].map(([f, x]) => ({ field: f, value: enc(x) })).concat([{ field: K, value: enc(FULL) }]) }); M.T.push(r.json?.data?.id); }
  for (const t of M.T) for (let i = 0; i < 15 && !(await bstate(t)); i++) await sleep(2000);
  M.cityRun = (await call('owner', 'POST', `/desk/tickets/${M.T[1]}/blueprint-transitions/city`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} })).status;
  fs.writeFileSync(OUT, JSON.stringify(M)); console.log(JSON.stringify(M));
})();
