const G = []; page.on('request', q => { if (q.method() === 'GET' && /\/api\/v1\//.test(q.url())) G.push(q.url().replace(/^.*\/api\/v1/, '').split('?')[0]); });
const R = ['/settings/modules-and-fields','/settings/organize-tabs','/settings/data/import','/settings/data/export','/settings/data/backup','/settings/data/migration','/settings/data/sandboxes','/settings/data/bulk-actions','/settings/data/archive','/settings/data/retention','/settings/organization/products','/settings/integrations/crm','/settings/integrations/collaboration','/analytics','/analytics/reports','/modules/0924eb24-e42a-4eab-8efd-e3428f19e882','/activities','/calendar','/team-feeds'];
out.g = {};
for (const r of R) { const n0 = G.length; await page.goto(H + r, { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(6000); out.g[r] = [...new Set(G.slice(n0))].filter(u => !/heartbeat|resolved|realtime|presence|notifications|me$|session/.test(u)).slice(0, 25); }
// settings hub links by clicking names
await go('/settings', 8000);
out.hubRoutes = {};
for (const name of ['Signals', 'Home Page', 'Audit Log', 'Custom Actions', 'Email Providers', 'Data Types', 'Capabilities']) {
  await go('/settings', 6000); const el = page.getByText(name, { exact: true }).first(); if (!(await el.count())) { out.hubRoutes[name] = 'not found'; continue; }
  await el.click().catch(() => {}); await sleep(5000); out.hubRoutes[name] = page.url().replace(H, ''); }
return fin({ out });
