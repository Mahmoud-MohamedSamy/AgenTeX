const out = {};
for (const [p, b] of [['/teamspaces', {}], ['/custom-datatypes', {}], ['/reporting/reports', {}], ['/reporting/dashboards', {}], ['/reporting/folders', {}]]) { const r = await call('POST', p, b); out[p] = r.s + ' ' + r.t.slice(0, 600); }
out.reportsList = (await call('GET', '/reporting/reports')).t.slice(0, 300);
out.workspaces = (await call('GET', '/reporting/workspaces')).t.slice(0, 300);
return out;
