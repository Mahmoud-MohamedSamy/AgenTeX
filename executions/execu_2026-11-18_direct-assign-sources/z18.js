const D = '1499272000000006907';
for (const p of ['workflows?module=tickets&departmentId=' + D + '&limit=5', 'roundRobinRules?departmentId=' + D]) { const r = await api(page, 'GET', p); out[p] = r.s + ' ' + r.t.slice(0, 1500); }
