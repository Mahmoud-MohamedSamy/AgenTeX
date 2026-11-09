const base = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const o = {};
const d = await api('GET', `/desk/tickets/${base}`); o.deskGet = d.s; o.deskKeys = d.j && d.j.data ? Object.keys(d.j.data).join(',').slice(0, 900) : d.t.slice(0, 200);
const g = await getRec(T, base); o.number = g.o && g.o.ticket_number; o.sla = g.o && [g.o.sla_name, g.o.response_due, g.o.due_date];
// W2-10 negatives
o.noSubject = await mkRec(T, { status: 'Open', department: DQ }, 'neg'); o.noStatus = await mkRec(T, { subject: 'QA GL W2 neg nostatus', department: DQ }, 'neg'); o.badPrio = await mkRec(T, { subject: 'QA GL W2 neg prio', status: 'Open', priority: 'Bogus', department: DQ }, 'neg');
// W2-14 html subject
o.xss = await mkRec(T, { subject: 'QA GL W2 <img src=x onerror=alert(1)> html', status: 'Open', department: DQ, contact_id: '4abedf97-3ea0-4abb-a3d4-493e728cd05c' }, 'xss');
if (o.xss.id) { const x = await getRec(T, o.xss.id); o.xssStored = x.o && x.o.subject; o.xssNum = x.o && x.o.ticket_number; }
// extra tickets for merge / parent / bulk
for (const n of ['merge master', 'merge child', 'parent', 'child 1', 'child 2']) { const r = await mkRec(T, { subject: 'QA GL W2 ' + n, status: 'Open', priority: 'Medium', department: DQ, contact_id: '4abedf97-3ea0-4abb-a3d4-493e728cd05c' }, n); o[n] = [r.s, r.id]; }
return fin(o);
