const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 Import', email: 'qa-rt22-import@example.com' }); out.contact = c.j && c.j.id;
const t = await api(page, 'POST', 'tickets', { subject: 'QA RT22 DA manual create (API)', departmentId: '1499272000000006907', contactId: out.contact, status: 'Open', channel: 'Phone' });
out.ticket = { s: t.s, id: t.j && t.j.id, n: t.j && t.j.ticketNumber, ownerAtCreate: t.j && t.j.assigneeId };
await page.waitForTimeout(15000);
const g = await api(page, 'GET', 'tickets/' + out.ticket.id + '?include=assignee'); out.after = { owner: g.j && g.j.assignee && (g.j.assignee.firstName + ' ' + g.j.assignee.lastName), id: g.j && g.j.assigneeId };
const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/data/';
fs.mkdirSync(D + 'Z', { recursive: true });
fs.writeFileSync(D + 'Z/Tickets.csv', 'Subject,Department,Status,Email\r\nQA RT22 DA import no owner,TechEgySolutions,Open,qa-rt22-import@example.com\r\n');
fs.writeFileSync(D + '../out/zoho-ids.json', JSON.stringify({ rule: '1499272000000517100', contact: out.contact, manual: out.ticket.id }));
