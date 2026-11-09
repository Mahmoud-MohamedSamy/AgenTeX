// Snapshot of everything Wave 5 can touch (GET only). Used for baseline/ and after/ (diff.js compares them).
const MODS = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', customers: '6f553963-01d6-4b68-9fb3-143d23044c41', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
const get = async p => { const r = await call('GET', p); return r.s === 200 ? (r.j && r.j.data !== undefined ? r.j.data : r.j) : { status: r.s, err: r.t.slice(0, 200) }; };
const strip = v => Array.isArray(v) ? v : (v && (v.items || v.rows || v.reports || v.dashboards)) || v;
const o = {};
o.me = await get('/iam/me/profile');
const mods = strip(await get('/modules'));
o.modules = Array.isArray(mods) ? mods.map(m => ({ id: m.id, key: m.moduleKey, label: m.labels && m.labels.en, status: m.status, teamspaceId: m.teamspaceId })) : mods;
o.teamspaces = await get('/teamspaces');
o.datatypes = (strip(await get('/fields/datatypes')) || []).map ? strip(await get('/fields/datatypes')).map(d => d.key) : null;
o.customDatatypes = await get('/custom-datatypes');
o.reports = await get('/reporting/reports');
o.reportFolders = await get('/reporting/folders');
o.dashboards = await get('/reporting/dashboards');
o.homePages = await get('/reporting/home-pages');
o.reportTz = await get('/reporting/report-time-zone');
for (const [k, id] of Object.entries(MODS)) {
  o[k + 'Layouts'] = (strip(await get(`/modules/${id}/layouts`)) || []).map ? strip(await get(`/modules/${id}/layouts`)).map(l => ({ id: l.id, name: l.name, status: l.status, isDefault: l.isDefault, accessMode: l.accessMode })) : null;
  o[k + 'FieldCount'] = (strip(await get(`/modules/${id}/fields`)) || []).length;
  for (const sub of ['buttons', 'links', 'validation-rules', 'layout-rules', 'dependency-maps']) o[k + ' ' + sub] = await get(`/modules/${id}/${sub}`);
}
o.company = await get('/iam/tenant/company-profile');
o.businessHours = await get('/iam/tenant/business-hours');
o.fiscalYear = await get('/iam/tenant/fiscal-year');
o.skills = await get('/iam/skills/categories');
o.storage = await get('/files/storage/usage');
o.aiPolicy = await get('/ai/policy');
o.aiAgents = await get('/agents');
o.apiClients = await get('/iam/integrations/clients');
o.webhooks = await get('/messaging/webhooks');
o.translations = await get('/i18n/translations?locale=ar');
const bin = await call('GET', '/audit/recycle-bin/items?limit=200');
const bd = bin.j && (Array.isArray(bin.j.data) ? bin.j.data : bin.j.data && bin.j.data.items) || [];
o.binFirstPage = { status: bin.s, count: bd.length, qa: bd.filter(x => /QA R2W5|qa_r2w5/i.test((x.record_label || '') + (x.module_key || ''))).length };
return o;
