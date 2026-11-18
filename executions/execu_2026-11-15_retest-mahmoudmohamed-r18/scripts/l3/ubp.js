const reqs = []; page.on('response', async r => { const u = r.url(); const m = r.request().method(); if (/api\/v1/.test(u) && m !== 'GET' && !/heartbeat|notif|iam\/auth|resolved-batch/.test(u)) reqs.push(m + ' ' + u.split('/api/v1')[1].slice(0, 120) + ' ' + r.status() + ' ' + (r.request().postData() || '').slice(0, 100)); });
const NAME = process.env.BPN || 'QA RT18 3012 BP';
await page.goto(H + '/settings/automation/blueprints?department=93949fbd-f9df-4e2e-ae45-00b8dc38385b', { waitUntil: 'domcontentloaded' }); await sleep(10000); log('url', page.url().replace(H, ''));
log('lines', (await text()).split('\n').filter(l => /QA RT18|Active|Inactive/.test(l)).slice(0, 10));
const row = page.getByText(NAME, { exact: true }).first(); log('row', await row.count());
if (await row.count()) {
  await row.scrollIntoViewIfNeeded(); const tr = row.locator('xpath=ancestor::*[.//*[@role="switch"]][1]'); const sw = tr.locator('[role=switch]').first();
  log('sw', await sw.count(), await sw.getAttribute('aria-checked').catch(() => null)); await shot('bp-list.png');
  if (await sw.count()) { await sw.click(); await sleep(2500);
    const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { log('dlg', (await d.innerText()).replace(/\n/g, ' | ').slice(0, 300)); const b = d.getByRole('button', { name: /Deactivate|Confirm|Yes|Turn off/i }).last(); if (await b.count()) await b.click(); await sleep(3000); }
    log('sw after', await sw.getAttribute('aria-checked')); }
}
log('reqs', reqs);
