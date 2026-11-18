const r = await api(page, 'GET', 'tickets?limit=15&sortBy=-createdTime&include=assignee');
out.latest = (r.j && r.j.data || []).filter(x => /QA RT22/.test(x.subject)).map(x => ({ id: x.id, n: x.ticketNumber, subj: x.subject, ownerId: x.assigneeId, owner: x.assignee ? (x.assignee.firstName || '') + ' ' + x.assignee.lastName : null, created: x.createdTime, dept: x.departmentId }));
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/data-administration/import', { waitUntil: 'commit' }).catch(()=>{});
await page.waitForTimeout(6000);
const t = await body(page); const i = t.indexOf('IMPORT ID'); out.list = t.slice(i + 75, i + 260);
