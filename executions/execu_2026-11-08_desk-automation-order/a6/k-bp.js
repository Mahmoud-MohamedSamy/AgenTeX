// Try the K blueprint definition (no tickets yet). Deletes it right after if DRY=1.
const n = require('./bp/ndc'); const { call, CS } = n; const fs = require('fs');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b, during = {}) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during, after: { actions: [] } });
const replyKind = process.env.RK || 'reply';
const def = { name: 'QA BP K', description: 'QA A6 K3-K5 + E2E-2 customer rows - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS,
  entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP K ' },
  states: [st('Open', { onRatingTransitionId: 'rgood', onRatingValues: ['good'] }), st('On Hold', { onReplyTransitionId: 'back', autoTransitionId: 'autoclose', autoTransitionAfterMinutes: 1440 }), st('Escalated', { onRatingTransitionId: 'rany' }), st('Closed', { isTerminal: true })],
  transitions: [tr('hold', 'Open', 'On Hold', { deskItems: [{ kind: replyKind, mandatory: true }], itemOrder: ['desk:' + replyKind] }), tr('esc', 'Open', 'Escalated'), tr('back', 'On Hold', 'Open'), tr('autoclose', 'On Hold', 'Closed'), tr('rgood', 'Open', 'Escalated'), tr('rany', 'Escalated', 'Closed')] };
(async () => {
  const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true });
  console.log('create', c.status, c.code || '', String(c.msg || '').slice(0, 200), JSON.stringify(c.json?.error?.details || '').slice(0, 400));
  if (c.json?.data?.id) { const s = c.json.data.definition; console.log('saved', JSON.stringify({ states: s.states.map(x => [x.id, x.onReplyTransitionId, x.onRatingTransitionId, x.onRatingValues, x.autoTransitionAfterMinutes]), hold: s.transitions[0].during }));
    if (process.env.DRY) console.log('deleted', (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${c.json.data.id}`)).status); else fs.writeFileSync(__dirname + '/k-bp.json', JSON.stringify({ id: c.json.data.id }));
  }
})();
