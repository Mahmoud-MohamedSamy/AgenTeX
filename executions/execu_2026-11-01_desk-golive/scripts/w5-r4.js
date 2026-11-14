await go('/hq', 9000);
const acts = page.getByRole('button', { name: 'Online agents (1) actions' }); out.nActs = await acts.count();
await acts.last().click(); await sleep(1500);
out.menu = await page.locator('[role=menu]').last().innerText().catch(() => '');
await page.getByRole('menuitem', { name: /Remove|Delete/i }).first().click().catch(e => out.rmErr = e.message.slice(0, 80)); await sleep(2000);
const conf = page.locator('[role=alertdialog], [role=dialog]').last(); if (await conf.count()) { out.conf = (await conf.innerText()).replace(/\s+/g,' ').slice(0,200); await conf.getByRole('button', { name: /Remove|Delete|Confirm|Yes/i }).last().click().catch(() => {}); await sleep(3000); }
out.after = await page.locator('main h2, main h3').allInnerTexts();
await go('/hq', 9000); out.afterReload = await page.locator('main h2, main h3').allInnerTexts();
// W5-26 create report
await go('/analytics/reports/builder', 9000);
await page.getByLabel('Report Name').fill('QA GL W5 report');
await page.getByRole('button', { name: 'Select Primary Module' }).click(); await sleep(2000);
out.datasets = (await page.locator('[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await shot('w5/W5-25-datasets');
await page.getByRole('option', { name: /^Tickets/ }).first().click(); await sleep(1500);
const n0 = NET.length; await page.getByRole('button', { name: /^Create$/ }).click(); await sleep(9000);
out.net = NET.slice(n0).filter(x => /report/i.test(x.u) && x.m !== 'GET').map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + (x.t || '').slice(0, 200));
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'report', id: m[1], name: 'QA GL W5 report' }); out.rid = m[1]; }
out.url = page.url().replace(H, ''); out.body = (await mtxt()).slice(0, 1500);
await shot('w5/W5-26-builder');
return fin({ out });
