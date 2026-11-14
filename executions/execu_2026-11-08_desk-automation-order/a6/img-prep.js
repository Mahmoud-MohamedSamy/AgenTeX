// Screen evidence for D-2 (two editors), D-3 (continuous), D-8 (only owner suspended), D-9 (owner id that does not exist).
// node img-prep.js prep | suspend | clean   (clean reactivates agent A and deletes everything; ids in img-prep.json)
const n = require('./bp/ndc'); const { call, sleep, ID, CS } = n; const fs = require('fs'); const crypto = require('crypto');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = __dirname + '/img-prep.json';
const v = x => ({ kind: 'string', value: String(x) });
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, o = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: o.before || {}, during: o.during || {}, after: { actions: [] } });
const def = (tag, states, transitions, x = {}) => ({ name: 'QA BP ' + tag, description: 'QA evidence ' + tag + ' - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + tag + ' ' }, states, transitions, ...x });
const bstate = async t => ((await call('owner', 'GET', `/modules/${TK}/records/${t}/blueprint-state`)).json?.data?.states || [])[0] || null;
(async () => {
  const mode = process.argv[2]; let M = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { B: {}, T: {} };
  const save = () => fs.writeFileSync(OUT, JSON.stringify(M, null, 1));
  if (mode === 'prep') {
    M = { B: {}, T: {} };
    const mk = async (k, d) => { const r = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: d, isActive: true }); M.B[k] = r.json?.data?.id; M[k + 'res'] = r.status + ' ' + (r.msg || ''); save(); };
    const tk = async (k, tag) => { const r = await call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', 'QA BP ' + tag + ' ticket'], ['department', CS], ['status', 'Open']].map(([f, x]) => ({ field: f, value: v(x) })) }); M.T[k] = r.json?.data?.id; save(); for (let i = 0; i < 15 && !(await bstate(M.T[k])); i++) await sleep(2000); };
    await mk('D2', def('D2 tabs', [st('Open'), st('Closed', { isTerminal: true })], [tr('end', 'Open', 'Closed')]));
    await mk('D3', def('D3 continuous', [st('Open'), st('Escalated'), st('On Hold'), st('Closed', { isTerminal: true })], [tr('first', 'Open', 'Escalated', { during: { checklist: [{ id: 'k', label: 'QA check', mandatory: true }] } }), tr('auto', 'Escalated', 'On Hold'), tr('end', 'On Hold', 'Closed')], { continuous: true }));
    await tk('D3', 'D3 continuous');
    M.D3run = (await call('owner', 'POST', `/desk/tickets/${M.T.D3}/blueprint-transitions/first`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: { k: true } })).status;
    await sleep(30000); M.D3stateAfter30s = (await bstate(M.T.D3))?.activeStates;
    await mk('D8', def('D8 owner', [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], [tr('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [ID.A] } }), tr('end', 'Escalated', 'Closed')]));
    await tk('D8', 'D8 owner');
    M.ghost = crypto.randomUUID();
    await mk('D9', def('D9 ghost', [st('Open'), st('Closed', { isTerminal: true })], [tr('ghost', 'Open', 'Closed', { before: { allowedUserIds: [M.ghost] } })]));
    const g = await call('owner', 'GET', `/modules/${TK}/blueprints/${M.B.D9}`); M.D9saved = JSON.stringify(g.json?.data?.definition?.transitions?.[0]?.before);
    save(); console.log(JSON.stringify(M, null, 1)); return;
  }
  if (mode === 'suspend') { M.suspend = (await call('owner', 'PATCH', `/iam/users/${ID.A}`, { status: 'suspended' })).status; await sleep(3000);
    M.D8ownerRuns = (await call('owner', 'POST', `/desk/tickets/${M.T.D8}/blueprint-transitions/onlyA`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} })); M.D8ownerRuns = M.D8ownerRuns.status + ' ' + (M.D8ownerRuns.code || '') + ' ' + (M.D8ownerRuns.msg || '');
    save(); console.log(JSON.stringify({ suspend: M.suspend, run: M.D8ownerRuns })); return; }
  if (mode === 'clean') { const c = [];
    c.push('A:' + (await call('owner', 'PATCH', `/iam/users/${ID.A}`, { status: 'active' })).status);
    for (const t of Object.values(M.T)) if (t) c.push('t' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status);
    for (const b of Object.values(M.B)) if (b) { await call('owner', 'POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); c.push('bp' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${b}`)).status); }
    const u = await call('owner', 'GET', `/iam/users/${ID.A}`); c.push('A now ' + (u.json?.data?.status || u.status)); console.log(c.join(' ')); }
})();
