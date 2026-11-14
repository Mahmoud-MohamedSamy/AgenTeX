// F2 (user OK 13 Nov): address field updated by a blueprint (transition form + after-action); sub-fields kept? [reg NDC-1436]
// Uses QA field "QA BP F2 address" (qa_bp_f2_address, created 13 Nov, id in F); blueprint "QA BP F2"; tickets "QA BP F2 ...". All deleted at the end (field too).
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', F = 'dbe4da60-c422-4430-83a8-0f9c7fb7a6bc', K = 'qa_bp_f2_address';
const R = {}; const rec = (k, x) => { R[k] = x; console.log(k, JSON.stringify(x).slice(0, 800)); };
const E = r => r.status + (r.status >= 300 ? ' ' + (r.code || '') + ' ' + String(r.msg || '').slice(0, 200) + ' ' + JSON.stringify(r.json?.error?.details || '').slice(0, 300) : '');
const enc = v => v === null ? { kind: 'null' } : (v && typeof v === 'object') ? { kind: 'object', properties: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } : { kind: 'string', value: String(v) };
const dec = x => !x ? x : x.kind === 'object' ? Object.fromEntries(Object.entries(x.properties || {}).map(([k, y]) => [k, dec(y)])) : x.kind === 'array' ? (x.items || []).map(dec) : x.value;
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, o = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: o.during || {}, after: { actions: o.after || [] } });
const addr = async t => dec((((await call('owner', 'GET', `/modules/${TK}/records/${t}`)).json?.data?.data) || []).find(x => x.field === K)?.value);
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
const run = (t, tid, from, extra = {}) => call('owner', 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: from, fields: {}, ...extra });
const T = []; let B; const FULL = { street: '1 QA Street', city: 'Cairo', state: 'Cairo Gov', zip: '11511', country: 'Egypt' };
async function ticket(sfx, a) { const data = [['subject', 'QA BP F2 ' + sfx], ['department', CS], ['status', 'Open']].map(([f, x]) => ({ field: f, value: enc(x) })); if (a) data.push({ field: K, value: enc(a) });
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data }); if (r.status >= 300) throw new Error('ticket ' + E(r)); T.push(r.json.data.id); const id = r.json.data.id; for (let i = 0; i < 15 && !(await bstate(id)); i++) await sleep(2000); return id; }
(async () => {
  try {
    const def = { name: 'QA BP F2', description: 'QA A6 F2 address field - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP F2 ' },
      states: [st('Open'), st('On Hold'), st('Escalated'), st('Closed', { isTerminal: true })],
      transitions: [
        tr('form', 'Open', 'On Hold', { during: { requiredFields: [{ name: K, datatype: { key: 'address' }, required: true }], itemOrder: ['field:' + K] } }),
        tr('city', 'Open', 'Escalated', { after: [{ kind: 'setField', field: K, value: { city: 'Giza' } }] }),
        tr('full', 'On Hold', 'Closed', { after: [{ kind: 'setField', field: K, value: { street: '2 QA Road', city: 'Alexandria', state: 'Alex Gov', zip: '21500', country: 'Egypt' } }] })] };
    const b = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); B = b.json?.data?.id; rec('bp', E(b));
    if (!B) { // after-action value may need another shape: retry with a string value
      def.transitions[1].after.actions = [{ kind: 'setField', field: K, value: 'Giza' }]; def.transitions[2].after.actions = [];
      const b2 = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); B = b2.json?.data?.id; rec('bp retry (string value)', E(b2)); if (!B) return; }
    rec('saved actions', JSON.parse(JSON.stringify(b.json?.data?.definition?.transitions?.map(t => [t.id, t.after?.actions]) || '')));
    // 1 transition form: required address, fill all five parts
    const t1 = await ticket('form');
    rec('1 form without address', E(await run(t1, 'form', 'Open')));
    rec('1 form with full address', E(await run(t1, 'form', 'Open', { fields: { [K]: FULL } })));
    rec('1 address after form', await addr(t1));
    // 2 form with only the city on a ticket that already has a full address
    const t2 = await ticket('form partial', FULL); rec('2 address at create', await addr(t2));
    rec('2 form with city only', E(await run(t2, 'form', 'Open', { fields: { [K]: { city: 'Giza' } } })));
    rec('2 address after form (others kept?)', await addr(t2));
    // 3 after-action sets city only on a ticket with a full address
    const t3 = await ticket('after city', FULL);
    rec('3 run city', E(await run(t3, 'city', 'Open'))); await sleep(4000);
    rec('3 address after action (others kept?)', await addr(t3));
    // 4 after-action sets all five parts
    rec('4 run full on t1', E(await run(t1, 'full', 'On Hold'))); await sleep(4000);
    rec('4 address after full action', await addr(t1));
    // 5 history line of the address change
    const h = await call('owner', 'GET', `/desk/tickets/${t3}/history`); rec('5 history t3', (h.json?.data || []).filter(x => JSON.stringify(x).includes(K) || /address/i.test(JSON.stringify(x))).map(x => [x.action, x.field_key, String(x.old_value).slice(0, 120), String(x.new_value).slice(0, 120)]));
  } catch (e) { rec('ERROR', String(e.stack || e).slice(0, 500)); }
  finally {
    const c = []; for (const t of T) c.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    if (B) { await call('owner', 'POST', `/desk/blueprints/${B}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${B}`)).status); }
    rec('cleanup', c.join(' ')); fs.writeFileSync(__dirname + '/f2-out.json', JSON.stringify(R, null, 1));
  }
})();
