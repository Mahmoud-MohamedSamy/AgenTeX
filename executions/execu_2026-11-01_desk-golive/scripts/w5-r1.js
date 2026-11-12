await go('/analytics/reports/builder', 9000);
await page.getByLabel(/Report Name/i).first().fill('QA GL W5 report').catch(async () => { await page.locator('main input').first().fill('QA GL W5 report'); });
const sel = page.locator('main').getByText(/Select a dataset/).first(); await sel.click(); await sleep(2000);
out.datasets = (await page.locator('[role=listbox], [role=menu], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await shot('w5/W5-25-datasets');
const opt = page.getByRole('option', { name: /^Tickets/ }).first(); if (await opt.count()) await opt.click(); else await page.getByText(/^Tickets$/).last().click();
await sleep(1500);
const n0 = NET.length; await page.getByRole('button', { name: /^Create$/ }).click(); await sleep(8000);
out.net = NET.slice(n0).filter(x => /reporting/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 160));
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'report', id: m[1], name: 'QA GL W5 report' }); out.rid = m[1]; }
out.url = page.url().replace(H, ''); out.body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1500);
await shot('w5/W5-26-builder');
return fin({ out });
