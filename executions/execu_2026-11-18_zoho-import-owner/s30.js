const c = await api(page, 'POST', 'contacts', { lastName: 'QA RT22 Import', email: 'qa-rt22-import@example.com' }); out.contact = { s: c.s, id: c.j && c.j.id };
const ag = await api(page, 'GET', 'agents?limit=50&status=ACTIVE'); const a1 = ag.j.data.find(a => a.name === 'test agent 1');
const a1d = await api(page, 'GET', 'agents/' + a1.id); out.a1depts = a1d.j && a1d.j.associatedDepartmentIds;
const deps = await api(page, 'GET', 'departments?isEnabled=true'); out.depts = (deps.j.data || []).map(d => d.name + ' ' + d.id);
const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/data/';
fs.mkdirSync(D + 'C', { recursive: true });
fs.writeFileSync(D + 'C/Tickets.csv', 'Subject,Department,Status,Email,Ticket Owner\r\n'
 + 'QA RT22 IMP C1 unknown email,Tech,Open,qa-rt22-import@example.com,qa-rt22-nobody@example.com\r\n'
 + 'QA RT22 IMP C2 agent1 not in Tech,Tech,Open,qa-rt22-import@example.com,' + a1.emailId + '\r\n'
 + 'QA RT22 IMP C3 agent name not email,Tech,Open,qa-rt22-import@example.com,test agent 2\r\n');
out.written = true;
