// Read-only: full org units + Desk agents (role per agent) + audit log entries for the removal.
const out = {};
const ou = await api('GET', '/iam/org-units'); out.orgUnits = arr(ou.j.data).map(o => `${o.name}|${o.orgUnitId}|${o.path}|${o.app_key}`);
for (const p of ['/desk/agents?page_size=100', '/desk/agents']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 1500); if (r.s === 200) break; }
const au = await api('GET', '/audit/logs?page_size=20'); out.audit = au.s + ' ' + au.t.slice(0, 1500);
page.off('request', onReq);
return JSON.stringify(out);
