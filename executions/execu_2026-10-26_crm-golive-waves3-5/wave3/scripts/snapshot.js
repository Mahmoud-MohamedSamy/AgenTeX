const P = ['/workflow/rules?take=500', '/workflow/assignment-rules', '/workflow/review-processes', '/workflow/approval-processes',
  '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/blueprints', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/blueprints',
  '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/blueprints', '/workflow/custom-actions', '/workflow/review-rejection-reasons',
  '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/layouts', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/layouts',
  '/integrations/google-sheets/connections', '/workflow/schedules', '/workflow/scoring-rules', '/scoring-rules', '/workflow/cadences', '/workflow/macros'];
const res = {};
for (const p of P) { const r = await call('GET', p); res[p] = { status: r.s, data: r.j ? r.j.data : r.t.slice(0, 300) }; }
return res;
