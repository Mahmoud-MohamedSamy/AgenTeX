const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
await page.goto(B + '/settings', { waitUntil: 'domcontentloaded' }); await sleep(3000);
const calls = [
  ['GET', '/iam/me'], ['GET', '/iam/me/permissions'], ['GET', '/modules'], ['GET', `/modules/${L}/fields`], ['GET', `/modules/${L}/layouts`],
  ['GET', `/modules/${L}/list-preferences`], ['GET', `/modules/${L}/views?kind=list`],
  ['GET', `/modules/${L}/records?page=1&per_page=20&layout_id=${LAY}&sort_by=created_at&sort_dir=desc`],
  ['GET', `/modules/${D}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`],
  ['GET', `/modules/${L}/records/${REC}`], ['GET', `/timeline/records/leads/${REC}/feed`], ['GET', `/modules/${L}/records/${REC}/attachments`],
  ['GET', '/settings/hub?app=crm'], ['GET', '/reporting/reports'], ['GET', '/reporting/dashboards'],
  ['GET', '/workqueue/summary?sections=activities%2Cqueues%2Cjobs'], ['GET', '/workqueue/queues'], ['GET', '/iam/users/directory?app_key=crm'],
  ['GET', '/search?q=QA%20R2SC'], ['POST', '/settings/resolved-batch', { items: [{ app_key: 'general', key: 'general.user.locale.language', scope_type: 'User' }] }],
];
out.api = [];
for (const [m, p, b] of calls) {
  const runs = []; let st;
  for (let i = 0; i < 3; i++) { const r = await api(m, p, b); runs.push(r.ms); st = r.s; await sleep(300); }
  out.api.push({ call: m + ' ' + p.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}').slice(0, 90), status: st, runs });
}
// what the Leads list page waits for: response times seen by the page itself
const seen = [];
const h = async resp => { const u = resp.url(); if (u.includes('/api/v1/')) { const t = resp.request().timing(); seen.push({ u: resp.request().method() + ' ' + u.split('/api/v1')[1].replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}').slice(0, 110), s: resp.status(), ms: Math.round(t.responseEnd) }); } };
page.on('response', h);
const t0 = Date.now();
await page.goto(B + '/modules/' + L, { waitUntil: 'commit' });
try { await page.waitForFunction(() => document.querySelectorAll('tbody tr td, [role=row] [role=gridcell]').length > 3, null, { timeout: 60000 }); } catch (e) {}
out.leadsListMs = Date.now() - t0; await sleep(1000);
page.off('response', h);
out.leadsListCalls = seen.sort((a, b) => b.ms - a.ms).slice(0, 15);
