const o = {}; const ids = {};
const mk = async (n, extra) => { const r = await mkRec(T, { subject: 'QA GL W2 ' + n, status: 'Open', department: DQ, contact_id: CON, channel: 'Phone', description: 'Go-live wave 2 test ticket. Safe to delete.', ...(extra || {}) }, n); o[n] = [r.s, r.id, r.e && r.e.message]; return r.id; };
ids.base = await mk('base ticket');
ids.email = await mk('email channel', { channel: 'Email', email: 'mmohamed@anyware.software' });
for (const n of ['merge master', 'merge child', 'parent', 'child 1', 'child 2', 'bulk 1', 'bulk 2', 'delete me']) ids[n.replace(/ /g, '_')] = await mk(n);
// W2-10 negatives
o.noSubject = await mkRec(T, { status: 'Open', department: DQ, channel: 'Phone' }, 'neg'); o.noStatus = await mkRec(T, { subject: 'QA GL W2 neg nostatus', department: DQ, channel: 'Phone' }, 'neg'); o.badPrio = await mkRec(T, { subject: 'QA GL W2 neg prio', status: 'Open', priority: 'Bogus', department: DQ, channel: 'Phone' }, 'neg');
// W2-14
ids.xss = await mk('<img src=x onerror=alert(1)> html');
const g = await getRec(T, ids.base); o.baseRec = g.o && { n: g.o.ticket_number, st: g.o.status, pr: g.o.priority, ch: g.o.channel, dep: g.o.department, owner: g.o.owner, sla: g.o.sla_name, due: g.o.due_date, tags: g.o.tags };
const x = await getRec(T, ids.xss); o.xssStored = x.o && x.o.subject;
const nums = []; for (const k of Object.keys(ids)) { const r = await getRec(T, ids[k]); nums.push([k, r.o && r.o.ticket_number]); } o.nums = nums;
await sleep(5000); o.wf = await wfx(ids.base); o.wfEmail = await wfx(ids.email);
const tg = await api('GET', `/desk/tickets/${ids.base}/tags`); o.baseTags = sh(tg);
const d = await api('GET', `/desk/tickets/${ids.base}`); o.deskKeys = d.s + ' ' + (d.j && d.j.data ? Object.keys(d.j.data).join(',').slice(0, 700) : '');
o.ids = ids; return fin(o);
