// A6 Z rows now built (13 Nov): Z1 strict mode, Z2 per-ticket transition owners, Z4 field checks, Z5 approval, Z6 share, Z9 required per agent.
// NDC-Staging, Customer Support, blueprint "QA BP ZR" guarded by subject "QA BP ZR ". QA records deleted at the end.
const n = require('./bp/ndc'); const fs = require('fs'); const crypto = require('crypto');
const { call, sleep, ID, CS, TECH } = n;
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const R = {}; const rec = (k, v) => { R[k] = v; console.log(k, String(JSON.stringify(v)).slice(0, 700)); };
const T = [], B = [];
const E = r => r.status + (r.status >= 300 ? ' ' + r.code + ' ' + String(r.msg || '').slice(0, 160) + (r.json?.error?.details ? ' ' + JSON.stringify(r.json.error.details).slice(0, 300) : '') : '');
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, during = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during, after: { actions: [] } });
const v = x => ({ kind: 'string', value: String(x) });
async function ticket(sfx, owner) {
  const data = [['subject', 'QA BP ZR ' + sfx], ['department', CS], ['status', 'Open']].concat(owner ? [['owner', owner]] : []).map(([field, val]) => ({ field, value: v(val) }));
  const r = await call('owner', 'POST', `/modules/${TK}/records`, { data }); if (r.status >= 300) throw new Error('ticket ' + E(r));
  T.push(r.json.data.id); return r.json.data.id;
}
const bstate = async (who, t) => ((await call(who, 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
async function waitIn(t) { for (let i = 0; i < 12; i++) { const s = await bstate('owner', t); if (s) return s; await sleep(2000); } return null; }
const run = (who, t, tid, extra = {}) => call(who, 'POST', `/desk/tickets/${t}/blueprint-transitions/${tid}`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, ...extra });
const vis = async (who, t) => ((await call(who, 'GET', `/modules/${TK}/records/${t}/blueprint-transitions`)).json?.data || []).map(x => x.transitionId || x.id);
const fval = async t => Object.fromEntries(((await call('owner', 'GET', `/modules/${TK}/records/${t}`)).json?.data?.data || []).map(x => [x.field, x.value?.value ?? x.value]));

(async () => {
  try {
    const def = { name: 'QA BP ZR2', description: 'QA A6 Z rows - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
      entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ZR ' }, strictMode: { scope: 'all', actions: [], fields: [] }, dynamicOwners: true,
      states: [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })],
      transitions: [
        tr('z4', 'Open', 'Escalated', { requiredFields: [{ name: 'subject', datatype: { key: 'single_line' }, required: true }], fieldValidations: [{ field: 'subject', rule: { op: 'contains', field: 'subject', value: 'okay' }, message: 'QA Z4 subject must contain okay' }], itemOrder: ['field:subject'] }),
        tr('z5', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed') ] };
    const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); rec('create', E(c)); if (c.status >= 300) return; B.push(c.json.data.id);
    const t4 = await ticket('z4', ID.A); rec('t4 in', !!(await waitIn(t4)));
    rec('Z4 bad', E(await run('owner', t4, 'z4', { fields: { subject: 'QA BP ZR z4 bad' } })));
    rec('Z4 state after bad', (await bstate('owner', t4))?.activeStates);
    rec('Z4 good', E(await run('owner', t4, 'z4', { fields: { subject: 'QA BP ZR z4 okay' } })));
    rec('Z4 state after good', (await bstate('owner', t4))?.activeStates, (await fval(t4)).subject);
    const t1 = await ticket('z1', ID.A); await waitIn(t1);
    rec('Z1 A comment', E(await call('A', 'POST', `/desk/tickets/${t1}/comments`, { body_html: '<p>QA Z1 comment</p>', is_public: false })));
    rec('Z1 A reply', E(await call('A', 'POST', `/desk/tickets/${t1}/replies`, { body_html: '<p>QA Z1</p>', to: ['mahmoud.mmohamedsamy+qaao@gmail.com'] })));
    rec('Z1 A edit subject', E(await call('A', 'PATCH', `/modules/${TK}/records/${t1}`, { data: [{ field: 'subject', value: v('QA BP ZR z1 edited') }] })));
    const t2 = await ticket('z2', ID.A); await waitIn(t2);
    rec('Z2 visible to B before', await vis('B', t2));
    const so = await call('owner', 'PUT', `/modules/${TK}/records/${t2}/blueprint/owners/z4`, { userIds: [ID.B], teamIds: [] }); rec('Z2 set owners', E(so) + ' ' + JSON.stringify(so.json?.data || '').slice(0, 300));
    rec('Z2 visible to B after', await vis('B', t2)); rec('Z2 visible to A after', await vis('A', t2));
    rec('Z2 A runs z4', E(await run('A', t2, 'z4', { fields: { subject: 'QA BP ZR z2 okay' } })));
    rec('Z2 B runs z4', E(await run('B', t2, 'z4', { fields: { subject: 'QA BP ZR z2 okay' } })));
    rec('Z2 A sets owners', E(await call('A', 'PUT', `/modules/${TK}/records/${t2}/blueprint/owners/z5`, { userIds: [ID.A], teamIds: [] })));
    rec('Z2 history', ((await call('owner', 'GET', `/desk/tickets/${t2}/history`)).json?.data || []).map(h => h.action + ':' + (h.field_key || '')).slice(0, 12));
  } catch (e) { rec('ERROR', String(e.stack || e).slice(0, 600)); }
  finally {
    const c = []; for (const t of T) c.push((await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    for (const b of B) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
    rec('cleanup', c.join(' ')); fs.writeFileSync(__dirname + '/zr2-out.json', JSON.stringify(R, null, 1));
  }
})();
