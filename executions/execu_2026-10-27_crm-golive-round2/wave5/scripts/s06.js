const res = {};
await page.goto(H + '/settings/billing', { waitUntil: 'domcontentloaded' }); await sleep(15000);
const t = (await page.innerText('main')).replace(/\s+/g, ' '); res.billing = t.slice(t.indexOf('Billing & Credits Your'), t.indexOf('Billing & Credits Your') + 500);
await shot('s06-billing-15s');
for (const tab of ['Usage', 'Invoices', 'Billing profile']) { await page.locator('main button, main [role=tab], main a', { hasText: new RegExp('^' + tab + '$') }).first().click().catch(() => {}); await sleep(4000); const x = (await page.innerText('main')).replace(/\s+/g, ' '); res[tab] = x.slice(x.indexOf('Billing profile') + 15, x.indexOf('Billing profile') + 300); }
await page.goto(H + '/settings/company/fiscal-year', { waitUntil: 'domcontentloaded' }); await sleep(5000);
const fy = (await page.innerText('main')).replace(/\s+/g, ' '); res.fiscal = fy.slice(fy.indexOf('Company Details Manage'), fy.indexOf('Company Details Manage') + 700); await shot('g03-fiscal');
await page.goto(H + '/settings/company/business-hours', { waitUntil: 'domcontentloaded' }); await sleep(5000);
const bh = (await page.innerText('main')).replace(/\s+/g, ' '); res.bh = bh.slice(bh.indexOf('Company Details Manage'), bh.indexOf('Company Details Manage') + 600); await shot('g02-bh');
await page.goto(H + '/settings/company/details', { waitUntil: 'domcontentloaded' }); await sleep(5000);
const cd = (await page.innerText('main')).replace(/\s+/g, ' '); res.company = cd.slice(cd.indexOf('Company Details Manage'), cd.indexOf('Company Details Manage') + 600); await shot('g01-company');
return res;
