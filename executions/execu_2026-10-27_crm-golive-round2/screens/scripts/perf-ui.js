// G09 screen timings: full page load (goto) to first useful content, 3 runs per screen. Admin B session.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const M = () => { const m = document.querySelector('main') || document.body; return m.innerText; };
const screens = [
  ['Home', '/', () => { const t = (document.querySelector('main') || document.body).innerText; return /My Tasks/.test(t) && /Rows per page|No open tasks/.test(t) && !/Loading/.test(t); }],
  ['Leads list', '/modules/' + L, () => document.querySelectorAll('tbody tr td, [role=row] [role=gridcell]').length > 3],
  ['Transactions list', '/modules/' + D, () => document.querySelectorAll('tbody tr td, [role=row] [role=gridcell]').length > 3],
  ['Record page (lead)', '/modules/' + L + '/records/' + REC, () => { const t = (document.querySelector('main') || document.body).innerText; return t.includes('QA R2SC Perf lead') && !/Loading/.test(t); }],
  ['Create form (lead)', '/modules/' + L + '/records/new', () => document.querySelectorAll('main input, main textarea').length > 3],
  ['Setup', '/settings', () => /Modules and Fields/.test(document.body.innerText)],
  ['Reports', '/reports', () => { const t = (document.querySelector('main') || document.body).innerText; return t.length > 60 && !/^\s*Loading/.test(t); }],
  ['Dashboards', '/dashboards', () => /No dashboards|Widgets/.test((document.querySelector('main') || document.body).innerText) && !/Loading/.test((document.querySelector('main') || document.body).innerText)],
  ['Work Queue', '/workqueue', () => { const t = (document.querySelector('main') || document.body).innerText; return /My Open Activities/.test(t) && /Rows per page/.test(t) && !/Loading your work queue/.test(t); }],
  ['Calendar', '/calendar', () => /Activit/.test((document.querySelector('main') || document.body).innerText)],
];
out.screens = [];
for (const [name, route, pred] of screens) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const t0 = Date.now();
    await page.goto(B + route, { waitUntil: 'commit', timeout: 60000 });
    let ms = -1;
    try { await page.waitForFunction(pred, null, { timeout: 60000, polling: 100 }); ms = Date.now() - t0; } catch (e) {}
    runs.push(ms);
    if (i === 2) await page.screenshot({ path: RAW + 'perf-' + name.replace(/\W+/g, '_') + '.png' });
    await sleep(1500);
  }
  out.screens.push({ name, route, runs });
}
// kanban: from the Transactions list, click Kanban view, time to first cards
out.kanban = [];
for (let i = 0; i < 3; i++) {
  await page.goto(B + '/modules/' + D, { waitUntil: 'domcontentloaded' });
  try { await page.waitForFunction(() => document.querySelectorAll('tbody tr td, [role=row] [role=gridcell]').length > 3, null, { timeout: 60000 }); } catch (e) {}
  const t0 = Date.now(); let ms = -1;
  try { await page.click('[title="Kanban view"], [aria-label="Kanban view"]', { timeout: 10000 });
    await page.waitForFunction(() => document.querySelectorAll('[draggable=true], [data-rbd-draggable-id], [data-card-id]').length > 0, null, { timeout: 60000 }); ms = Date.now() - t0; } catch (e) { out.kanbanErr = String(e.message).slice(0, 150); }
  out.kanban.push(ms);
}
await page.screenshot({ path: RAW + 'perf-kanban.png' });
