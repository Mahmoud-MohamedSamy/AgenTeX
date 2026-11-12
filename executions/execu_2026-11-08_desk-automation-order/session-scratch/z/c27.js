async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const D = '1475109000000426945';
  const p = await zapi(page, 'PATCH', 'workflows/1475109000000570581', { executeOn: { events: ['CREATE', 'EDIT'], triggerFieldInfo: null, happinessRatingOption: null } });
  const g = await zapi(page, 'GET', 'workflows/1475109000000570581');
  if (!(g.j.executeOn && g.j.executeOn.events.includes('EDIT'))) return { patch: p.s + ' ' + JSON.stringify(p.j).slice(0, 300), events: g.j.executeOn };
  const t = await zapi(page, 'POST', 'tickets', { subject: 'QA C3 edit path', departmentId: D, description: 'QA C3 edit', contactId: '1475109000000570478' });
  await new Promise(r => setTimeout(r, 4000));
  const u = await zapi(page, 'PATCH', 'tickets/' + t.j.id, { subject: 'QA C3 WF edit path' });
  await new Promise(r => setTimeout(r, 30000));
  const g2 = await zapi(page, 'GET', 'tickets/' + t.j.id);
  const h = await zapi(page, 'GET', 'tickets/' + t.j.id + '/History?limit=20');
  return { patch: p.s, id: t.j.id, num: t.j.ticketNumber, statusAfterCreate: t.j.status, upd: u.s, statusNow: g2.j.status, hist: (h.j.data || []).map(e => e.eventName + ' | ' + (e.actor && e.actor.type + ':' + e.actor.name) + ' | ' + JSON.stringify(e.eventInfo).slice(0, 160)) };
}
