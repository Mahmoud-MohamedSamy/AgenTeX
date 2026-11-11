await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Customers/.test((await text()).slice(1500))) break; }
const row = page.locator('tr', { hasText: 'Leads' }).first(); await row.locator('button, a').first().click(); await sleep(1500);
await page.getByText('Fields', {exact:true}).last().click(); await sleep(8000); log(page.url());
const s = page.getByPlaceholder(/Search/i).last(); await s.fill('QA RT15 GS'); await sleep(3000);
const t = await text(); log(t.slice(-1500)); await shot('2806-fields.png');
const r2 = page.locator('tr', { hasText: 'QA RT15 GS B' }).first(); log('rowB', await r2.count());
const menus = await r2.locator('button').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')||b.innerText)); log(menus);
