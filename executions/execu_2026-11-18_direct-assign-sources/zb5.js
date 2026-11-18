const D = '1499272000000006907';
const s = await api(page, 'GET', 'sla?departmentId=' + D); out.slaStatus = (s.j && s.j.data || []).map(x => x.name + ':' + x.status);
const t = await api(page, 'POST', 'tickets', { subject: 'QA RT22 BPMID Z3 High priority SLA plus blueprint', departmentId: D, contactId: '1499272000000517213', status: 'Open', priority: 'High', channel: 'Phone' });
out.Z3 = { id: t.j && t.j.id, n: t.j && t.j.ticketNumber };
await page.waitForTimeout(15000);
const g = await api(page, 'GET', 'tickets/' + out.Z3.id); const b = await api(page, 'GET', 'tickets/' + out.Z3.id + '/blueprint'); const h = await api(page, 'GET', 'tickets/' + out.Z3.id + '/History?limit=20');
out.Z3.dueDate = g.j && g.j.dueDate; out.Z3.status = g.j && g.j.status; out.Z3.bp = b.s + ' ' + (b.j && b.j.state ? b.j.name + ' / ' + b.j.state.name : b.t.slice(0, 120));
out.Z3.hist = (h.j && h.j.data || []).map(e => (e.actor && (e.actor.type + ':' + e.actor.name)) + ' ' + e.eventName);
