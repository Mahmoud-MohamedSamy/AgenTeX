const crit = { fieldConditions: [{ fieldModule: 'tickets', fieldName: 'Subject', condition: 'starts with', value: ['QA RT22 DA'] }], pattern: '1' };
const r = await api(page, 'POST', 'directAssignmentRules', { name: 'QA RT22 DA email webform', description: 'QA', executeOptions: ['CREATE'], status: 'ACTIVE', targets: [{ fromDepartmentId: '1499272000000006907', toDepartmentId: '1499272000000006907', agentId: '1499272000000432034', criteria: crit }] });
out.rule = r.s + ' ' + r.t.slice(0, 300);
const c = await api(page, 'GET', 'contacts/search?email=qa-rt22-import@example.com'); out.contact = c.s;
