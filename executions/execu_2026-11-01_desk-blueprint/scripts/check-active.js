// Can the API activate blueprints with the BP-P2-1..3 mistakes, and do tickets enter them? QA records, deleted after.
const tv = require('./tv'); const fs = require('fs'); const path = require('path'); const { QA_DEPT, sleep } = tv; const T = [], B = [], R = {};
const st = (id, extra = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...extra });
const tr = (id, from, to) => ({ id, name: 'QA ' + id, fromStateId: from, toStateId: to, before: {}, during: {}, after: { actions: [] } });
const cases = {
  P2_1: [st('Open', { slaMinutes: 60, slaPreExpiryMinutes: 120 }), st('Closed', { isTerminal: true })],
  P2_2: [st('Open', { slaMinutes: -1 }), st('Closed', { isTerminal: true })],
  P2_3: [st('Open', { autoTransitionId: 'esc2', autoTransitionAfterMinutes: 1 }), st('Escalated'), st('Closed', { isTerminal: true })] };
(async () => {
  for (const [k, states] of Object.entries(cases)) {
    const name = 'QA BP AC' + k.slice(-1);
    const trs = k === 'P2_3' ? [tr('go', 'Open', 'Escalated'), tr('esc2', 'Escalated', 'Closed')] : [tr('end', 'Open', 'Closed')];
    const r = await tv.blueprint({ name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
      entryCriteria: { op: 'contains', field: 'subject', value: name + ' ' }, states, transitions: trs }, true);
    const d = r.json && r.json.data; if (d && d.id) B.push(d.id);
    const t = await tv.ticket(name + ' t'); T.push(t); let s; for (let i = 0; i < 15 && !(s = await tv.stateOf(t)); i++) await sleep(1500);
    if (k === 'P2_3') { await sleep(100000); s = await tv.stateOf(t); }
    R[k] = { create: r.status, isActive: d && d.isActive, entered: !!s, state: s };
    console.log(k, r.status, 'active', d && d.isActive, 'entered', !!s, JSON.stringify(s).slice(0, 400));
  }
  fs.writeFileSync(path.resolve(__dirname, '../evidence/raw/P2-active.json'), JSON.stringify(R, null, 2));
})().catch(e => console.error('ERR', e.message)).finally(async () => console.log('cleanup', await tv.cleanup(T, B)));
