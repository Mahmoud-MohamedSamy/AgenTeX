const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const out = {}; const net = []; page.on('response', r => { if (/blueprint-transitions|\/records\//.test(r.url()) && r.request().method() !== 'GET') net.push(r.request().method() + ' ' + r.status() + ' ' + r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}')); });
await page.goto(H + '/views/all/tickets/4ad8caa5-4f11-404c-b25b-8235103d4090', { waitUntil: 'domcontentloaded' });
await page.getByText('QA BP RT19 3036 onlyA D6 read-only ticket').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(4000);
const t = (await text()).replace(/\s+/g, ' '); out.readOnly = (t.match(/You can read this ticket but not change it[^.]*\./) || ['NO'])[0];
await page.screenshot({ path: RAW + 'D6-1-before.png' });
// status field editable?
out.statusLocked = await page.getByText(/Set by blueprint/).count();
const b = page.getByRole('button', { name: 'QA onlyA', exact: true }).first(); out.btn = await b.count();
if (out.btn) { await b.click(); await sleep(3000); const dlg = page.getByRole('dialog'); if (await dlg.count()) { const c = dlg.getByRole('button', { name: /QA go|Run|Confirm|Save/ }).last(); if (await c.count()) await c.click(); await sleep(3000); } }
await sleep(3000); const t2 = (await text()).replace(/\s+/g, ' '); const i = t2.search(/Steps/); out.after = t2.slice(i, i + 160);
await page.screenshot({ path: RAW + 'D6-2-after.png' }); out.net = net;
return out;
