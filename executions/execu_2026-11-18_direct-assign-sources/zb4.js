const D = '1499272000000006907';
for (const p of ['sla?departmentId=' + D, 'slaPolicies?departmentId=' + D, 'slaRules?departmentId=' + D, 'sla/escalationStatus?departmentId=' + D, 'slas?departmentId=' + D + '&module=tickets']) { const r = await api(page, 'GET', p); out[p] = r.s + ' ' + r.t.slice(0, 250); }
