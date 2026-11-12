async (page) => {
  eval(require('fs').readFileSync('C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const D = '1475109000000426945';
  const t = await zapi(page, 'POST', 'tickets', { subject: 'QA C3 manual close', departmentId: D, description: 'QA C3 baseline', contact: { lastName: 'QA C3 Contact', email: 'qa.c3.contact@example.com' } });
  if (t.s >= 300) return t;
  const id = t.j.id;
  await new Promise(r => setTimeout(r, 3000));
  const c = await zapi(page, 'PATCH', 'tickets/' + id, { status: 'Closed' });
  await new Promise(r => setTimeout(r, 8000));
  const h = await zapi(page, 'GET', 'tickets/' + id + '/History?limit=20');
  const th = await zapi(page, 'GET', 'tickets/' + id + '/threads');
  return { id, num: t.j.ticketNumber, contactId: t.j.contactId, close: c.s + ' ' + (c.j.status || JSON.stringify(c.j).slice(0, 200)), hist: JSON.stringify(h.j).slice(0, 3000), threads: JSON.stringify(th.j).slice(0, 1200) };
}
