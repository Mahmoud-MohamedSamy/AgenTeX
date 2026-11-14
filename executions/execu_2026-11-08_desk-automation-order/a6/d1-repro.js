// D-1 fresh repro: create, edit+publish, delete a blueprint; then read the audit events.
const n = require('./bp/ndc'); const { call, sleep, CS } = n; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d';
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
(async () => { const o = { start: new Date().toISOString() };
  const def = { name: 'QA BP D1 audit', description: 'QA D-1 audit repro', moduleKey: 'desk_tickets', targetField: 'status', departmentId: CS, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP D1 ' },
    states: [st('Open'), st('Closed', { isTerminal: true })], transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
  const c = await call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); const id = c.json?.data?.id; o.create = c.status;
  def.description = 'QA D-1 audit repro (edited)'; o.draft = (await call('owner', 'PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: def })).status;
  o.publish = (await call('owner', 'POST', `/modules/${TK}/blueprints/${id}/publish`, {})).status; await sleep(2000);
  o.delete = (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${id}`)).status; await sleep(5000);
  const ev = await call('owner', 'GET', '/audit/events?app_key=desk&limit=200'); const L = ev.json?.data?.items || ev.json?.data || [];
  o.eventsSinceStart = (Array.isArray(L) ? L : []).filter(x => x.occurred_at >= o.start).map(x => (x.action || '') + ' | ' + (x.entity_type || x.entity || '') + ' | ' + JSON.stringify(x.summary || x.entity_label || '').slice(0, 60));
  o.blueprintEventsEver = (Array.isArray(L) ? L : []).filter(x => /blueprint/i.test(JSON.stringify(x))).map(x => x.occurred_at?.slice(0, 16) + ' ' + x.action).slice(0, 10);
  require('fs').writeFileSync(__dirname + '/d1-repro.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1)); })();
