await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await page.waitForTimeout(15000);
const me = await api(page, 'GET', 'myinfo'); out.me = me.s;
const DEP = '1499272000000006907';
const c = await api(page, 'POST', 'contacts', { lastName: 'QA GL C6 zoho', email: 'qa-gl-c6-zoho@example.com' }); out.cid = c.j && c.j.id;
out.t = [];
for (const [n, who] of [[1, '1499272000000139001'], [2, '1499272000000432034'], [3, '1499272000000432034']]) { const t = await api(page, 'POST', 'tickets', { subject: 'QA GL C6 zoho ' + n, departmentId: DEP, contactId: out.cid, channel: 'Email', assigneeId: who }); out.t.push(t.j ? [t.j.id, t.j.ticketNumber, t.j.assigneeId] : t.t); }
