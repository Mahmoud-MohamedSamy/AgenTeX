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
    const def = {
      name: 'QA BP ZR', description: 'QA A6 Z rows - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
      entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ZR ' },
      strictMode: { scope: 'all', actions: [], fields: [] }, dynamicOwners: true,
      states: [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })],
      transitions: [
        tr('z4', 'Open', 'Escalated', { requiredFields: [{ name: 'subject', datatype: { key: 'single_line' }, required: true }], fieldValidations: [{ field: 'subject', rule: { op: 'contains', field: 'subject', value: 'okay' }, message: 'QA Z4 subject must contain okay' }], itemOrder: ['field:subject'] }),
        tr('z5', 'Open', 'Escalated', { deskItems: [{ kind: 'approval', mandatory: true, approverUserIds: [ID.B] }], itemOrder: ['desk:approval'] }),
        tr('z6', 'Open', 'Escalated', { deskItems: [{ kind: 'share', mandatory: true, departmentId: TECH, access: 'full' }], itemOrder: ['desk:share'] }),
        tr('z9', 'Open', 'Escalated', { requiredFields: [{ name: 'description', datatype: { key: 'multi_line' }, required: true }], requiredFor: { 'field:description': { userIds: [ID.A], teamIds: [] } }, itemOrder: ['field:description'] }),
        tr('end', 'Escalated', 'Closed'),
      ],
    };
    const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true });
    rec('create', E(c)); if (c.status >= 300) return; const bid = c.json.data.id; B.push(bid);
    const saved = c.json.data.definition; rec('saved', { strict: saved.strictMode, dyn: saved.dynamicOwners, z4: saved.transitions.find(t => t.id === 'z4')?.during?.fieldValidations, z5: saved.transitions.find(t => t.id === 'z5')?.during?.deskItems, z6: saved.transitions.find(t => t.id === 'z6')?.during?.deskItems, z9: saved.transitions.find(t => t.id === 'z9')?.during?.requiredFor });

    // Z4 field check
    const t4 = await ticket('z4', ID.A); rec('t4 in', !!(await waitIn(t4)));
    rec('Z4 bad', E(await run('owner', t4, 'z4', { fields: { subject: 'QA BP ZR z4 bad' } })));
    rec('Z4 state after bad', (await bstate('owner', t4))?.activeStates || (await bstate('owner', t4)));
    rec('Z4 good', E(await run('owner', t4, 'z4', { fields: { subject: 'QA BP ZR z4 okay' } })));

    if (!process.env.ALL) { await z1z2(); return; }
    // Z5 approval
    const t5 = await ticket('z5', ID.A); await waitIn(t5);
    rec('Z5 none', E(await run('owner', t5, 'z5')));
    const r5 = await run('owner', t5, 'z5', { approval: { subject: 'QA BP ZR approval', description: 'QA', approver_user_ids: [ID.B] } });
    rec('Z5 with', E(r5) + ' ' + JSON.stringify(r5.json?.data || {}).slice(0, 300));
    const ap = await call('owner', 'GET', `/desk/tickets/${t5}/approvals`); rec('Z5 approvals', E(ap) + ' ' + JSON.stringify(ap.json?.data || ap.json).slice(0, 400));

    // Z6 share
    const t6 = await ticket('z6', ID.A); await waitIn(t6);
    rec('Z6 none', E(await run('owner', t6, 'z6')));
    const r6 = await run('owner', t6, 'z6', { shares: [{ department_id: TECH, access: 'full' }] }); rec('Z6 with', E(r6));
    const sh = await call('owner', 'GET', `/desk/tickets/${t6}/shares`); rec('Z6 shares', E(sh) + ' ' + JSON.stringify(sh.json?.data || sh.json).slice(0, 300));
    rec('Z6 C can read', (await call('C', 'GET', `/modules/${TK}/records/${t6}`)).status);

    // Z9 required for A only: owner (not listed) runs without description; A runs without -> refused
    const t9a = await ticket('z9a', ID.A); const t9b = await ticket('z9b', ID.A); await waitIn(t9a); await waitIn(t9b);
    rec('Z9 owner without desc', E(await run('owner', t9a, 'z9')));
    rec('Z9 A without desc', E(await run('A', t9b, 'z9')));
    rec('Z9 A with desc', E(await run('A', t9b, 'z9', { fields: { description: 'QA Z9 filled' } })));

  } catch (e) { rec('ERROR', String(e.stack || e).slice(0, 600)); } }
  async function z1z2() { try {
    // Z1 strict mode: A edits a field / comments outside a transition on a ticket in the blueprint
    const t1 = await ticket('z1', ID.A); await waitIn(t1);
    const pf = await call('A', 'PATCH', `/modules/${TK}/records/${t1}`, { data: [{ field: 'priority', value: v('high') }] }); rec('Z1 A field edit', E(pf));
    const cm = await call('A', 'POST', `/desk/tickets/${t1}/comments`, { body_html: '<p>QA Z1 comment</p>', is_public: false }); rec('Z1 A comment', E(cm));
    const po = await call('owner', 'PATCH', `/modules/${TK}/records/${t1}`, { data: [{ field: 'priority', value: v('low') }] }); rec('Z1 owner field edit', E(po));
    rec('Z1 priority now', (await fval(t1)).priority);

    // Z2 per-ticket transition owners (dynamicOwners)
    const t2 = await ticket('z2', ID.A); await waitIn(t2);
    rec('Z2 visible to B before', await vis('B', t2));
    const so = await call('owner', 'PUT', `/modules/${TK}/records/${t2}/blueprint/owners/z4`, { userIds: [ID.B], teamIds: [] }); rec('Z2 set owners', E(so) + ' ' + JSON.stringify(so.json?.data || '').slice(0, 300));
    rec('Z2 visible to B after', await vis('B', t2)); rec('Z2 visible to A after', await vis('A', t2));
    rec('Z2 B runs z4', E(await run('B', t2, 'z4', { fields: { subject: 'QA BP ZR z2 okay' } })));
    const soA = await call('A', 'PUT', `/modules/${TK}/records/${t2}/blueprint/owners/z5`, { userIds: [ID.A], teamIds: [] }); rec('Z2 A (agent) sets owners', E(soA));
  } catch (e) { rec('ERROR', String(e.stack || e).slice(0, 600)); }
  finally {
    const c = []; for (const t of T) c.push((await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    for (const b of B) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
    rec('cleanup', c.join(' '));
    fs.writeFileSync(__dirname + '/zr-out.json', JSON.stringify(R, null, 1));
  }
})();
