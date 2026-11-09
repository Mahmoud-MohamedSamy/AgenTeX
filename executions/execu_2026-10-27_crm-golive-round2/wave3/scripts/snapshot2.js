const P = ['/workflow/rules?take=500', '/workflow/assignment-rules', '/workflow/review-processes', '/workflow/approval-processes',
  '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/blueprints?includeInactive=true', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/blueprints?includeInactive=true',
  '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/blueprints?includeInactive=true', '/workflow/custom-actions', '/workflow/review-rejection-reasons',
  '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/layouts', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/layouts',
  '/workflow/schedules', '/workflow/scoring-rules', '/scoring-rules', '/workflow/cadences', '/workflow/macros'];
const res = {};
for (const p of P) { const r = await call('GET', p); res[p] = { status: r.s, data: r.j ? r.j.data : r.t.slice(0, 300) }; }
const u = await call('GET', '/iam/users?limit=200');
const users = (u.j && (u.j.data.items || u.j.data)) || [];
const mine = ['mmohamed@anyware.software', 'mahmoud.mahamed1515@gmail.com', 'mahmoud.mmohamedsamy@gmail.com', 'valafo4080@94an.com', 'nameb56175@airhemp.com'];
res.users = users.filter(x => mine.includes(String(x.email).toLowerCase())).map(x => ({ email: x.email, id: x.userId || x.id, status: x.status, profiles: x.profileNames || x.profiles, manager: x.reportingManagerId, orgUnit: x.orgUnitId }));
const f = await call('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/fields');
const fl = (f.j && (f.j.data.fields || f.j.data)) || [];
res.tasksPriority = fl.filter(x => x.apiName === 'priority' || x.apiName === 'status').map(x => ({ apiName: x.apiName, type: x.datatypeKey, opts: JSON.stringify(x.datatypeOptions || x.config).slice(0, 400) }));
return res;
