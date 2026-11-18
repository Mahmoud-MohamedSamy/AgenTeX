await page.waitForTimeout(8000);
for (const p of ['workflows?module=tickets&limit=5', 'workflowRules?module=tickets', 'roundRobinRules', 'assignmentRules', 'roundRobin?departmentId=1499272000000006907', 'roundRobinPreferences?departmentId=1499272000000006907']) { const r = await api(page, 'GET', p); out[p] = r.s + ' ' + r.t.slice(0, 200); }
