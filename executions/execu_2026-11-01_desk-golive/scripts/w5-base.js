const M = { contacts: '43004ce2-577f-4eda-b00a-0750fe40c3d4', accounts: '784400e1-4a2a-42c2-b4f3-7ca56e79828a', products: '95b45992-5beb-4f23-b619-e3ae0e304933', contracts: '0924eb24-e42a-4eab-8efd-e3428f19e882', tickets: TM };
const P = ['/modules', '/desk/tab-settings', '/desk/data/exports', '/desk/data/backups', '/desk/data/backups/schedule', '/desk/migrations', '/desk/data/sandboxes', '/desk/data/archive/settings', '/desk/retention/settings', '/desk/legal-holds', '/desk/integrations/crm/config', '/desk/collaboration/connections', '/reporting/dashboards', '/reporting/folders', '/reporting/reports', '/reporting/schedules', '/desk/activity-views', '/desk/me/preferences'];
for (const [k, id] of Object.entries(M)) P.push('/modules/' + id + '/fields', '/modules/' + id + '/layouts', '/modules/' + id + '/views');
const b = {}; for (const p of P) { const r = await api('GET', p); b[p] = { s: r.s, j: r.j }; }
const sum = {}; for (const [k, v] of Object.entries(b)) { const d = v.j && v.j.data; sum[k] = v.s + ' ' + (Array.isArray(d) ? 'n=' + d.length : d && typeof d === 'object' ? Object.keys(d).slice(0, 8).join(',') : ''); }
return fin({ sum, BASE: b });
