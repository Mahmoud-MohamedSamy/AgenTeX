await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(()=>{}); await page.waitForTimeout(10000);
const r = await api(page, 'GET', 'tickets?limit=10&sortBy=-createdTime&include=assignee');
out.zoho = (r.j && r.j.data || []).filter(t => /QA RT22/.test(t.subject)).map(t => ({ id: t.id, n: t.ticketNumber, subj: t.subject, ch: t.channel, owner: t.assignee ? (t.assignee.firstName || '') + ' ' + t.assignee.lastName : 'Unassigned', created: t.createdTime }));
for (const t of out.zoho) { const h = await api(page, 'GET', 'tickets/' + t.id + '/History?limit=20'); t.hist = (h.j && h.j.data || []).map(e => (e.actor && (e.actor.type + ':' + e.actor.name)) + ' ' + e.eventName); }
