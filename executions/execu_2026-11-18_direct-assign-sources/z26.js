const D = '1499272000000006907';
out.wf = (await api(page, 'GET', 'workflows?module=tickets&departmentId=' + D)).t.slice(0, 200);
out.rr = (await api(page, 'GET', 'roundRobinRules?departmentId=' + D)).t.slice(0, 200);
