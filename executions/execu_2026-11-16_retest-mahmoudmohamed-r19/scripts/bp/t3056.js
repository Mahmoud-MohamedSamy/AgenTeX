const o = {};
const def = DEF('3056 cond', [ST('Open', { position: { x: 0, y: 150 } }), ST('Escalated', { position: { x: 400, y: 0 } }), ST('On Hold', { position: { x: 400, y: 150 } }), ST('Closed', { isTerminal: true, position: { x: 800, y: 150 } })],
  [TR('go', 'Open', 'Escalated'), TR('urgent', 'Open', 'On Hold', { before: { visibilityCriteria: { op: 'eq', field: 'priority', value: 'high' } } }), TR('admin', 'Open', 'Closed', { before: { allowedUserIds: [OWNER] } }), TR('end', 'Escalated', 'Closed'), TR('hold end', 'On Hold', 'Closed')]);
def.transitions[4].id = 'holdend';
const b = await mkBp(def); o.bp = E(b.r); o.id = b.id;
o.t = await mkT('3056 cond', 'ticket', { priority: 'low', owner: AG_A }); await waitIn(o.t); o.n = (await rec(o.t)).ticket_number; o.owner = (await rec(o.t)).owner === AG_A;
fs.writeFileSync(RUN + '/scripts/bp/3056.json', JSON.stringify(o, null, 1)); return o;
