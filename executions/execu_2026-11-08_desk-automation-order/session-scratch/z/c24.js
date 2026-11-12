async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const D = '1475109000000426945';
  const t = await zapi(page, 'POST', 'tickets', { subject: 'QA C3 WF close by workflow', departmentId: D, description: 'QA C3 workflow', contactId: '1475109000000570478' });
  if (t.s >= 300) return t;
  const id = t.j.id;
  await new Promise(r => setTimeout(r, 15000));
  const g = await zapi(page, 'GET', 'tickets/' + id);
  const h = await zapi(page, 'GET', 'tickets/' + id + '/History?limit=20');
  const wf = await zapi(page, 'GET', 'workflows?module=tickets&departmentId=' + D);
  return { id, num: t.j.ticketNumber, statusOnCreate: t.j.status, statusNow: g.j.status, hist: (h.j.data || []).map(e => [e.eventName, e.actor && e.actor.type + ':' + e.actor.name, JSON.stringify(e.eventInfo).slice(0, 300)]), wfIds: (wf.j.data || []).map(w => w.id + ' ' + w.name) };
}
