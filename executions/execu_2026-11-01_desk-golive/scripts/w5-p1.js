const pages = { 'W5-28 report': '/analytics/reports/view/efa2c92a-7145-4b79-85e8-1de588d04ff0', 'W5-28 reports list': '/analytics/reports', 'W5-73 customers': '/customers', 'W5-73 contact': '/customers/34735e25-d505-41fa-9fe3-d4a67f283a9a', 'W5-73 contracts': '/contracts', 'W5-73 products': '/settings/organization/products', 'W5-74 modules': '/settings/modules-and-fields', 'W5-74 import': '/settings/data/import', 'W5-40 export': '/settings/data/export', 'W5-74 backup': '/settings/data/backup' };
for (const [k, u] of Object.entries(pages)) { await go(u, 10000); out[k] = page.url().replace(H, '') + ' | ' + (await mtxt()).slice(0, 260); await shot('w5/' + k.replace(/\s+/g, '-') + '-agentC'); }
const r = await api('GET', '/reporting/reports/efa2c92a-7145-4b79-85e8-1de588d04ff0'); out.apiReport = r.s + ' ' + r.t.slice(0, 120);
const q = await api('GET', '/modules/' + CM + '/records/' + C1); out.apiContact = q.s + ' ' + q.t.slice(0, 100);
const ex = await api('GET', '/data/exports?limit=5'); out.apiExport = ex.s + ' ' + ex.t.slice(0, 120);
return fin({ out });
