const out = {}; const net = []; page.on('request', r => { if (/\/api\/v1\//.test(r.url()) && /owner/i.test(r.url())) net.push(r.method() + ' ' + r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}')); });
await page.goto(H + '/settings/automation/blueprints/f2b2c1f5-56fd-4098-91e8-8a8704f78898', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA end/.test(await text())) break; }
await page.getByText('QA end', { exact: true }).first().click(); await sleep(3000);
out.endOpts = await page.locator('select', { has: page.locator('option', { hasText: /Add owner/ }) }).first().evaluate(s => [...s.options].map(o => o.text).slice(0, 6));
await page.goto(H + '/views/all/tickets/7ba77b0d-9a39-4448-b532-2a391ffc5ceb', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 role T2').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
const ao = page.getByText(/Assign owners?/i).first(); out.ao = await ao.count();
if (!out.ao) { await page.getByRole('button', { name: 'Actions' }).first().click().catch(() => {}); await sleep(1500); out.menu = (await page.locator('[role=menuitem]').allInnerTexts()).join(' | '); }
const ao2 = page.getByText(/Assign owners?/i).first(); out.ao2 = await ao2.count();
if (out.ao2) { await ao2.click(); await sleep(3000); const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Assign owner/i); out.dlg = t.slice(i, i + 600); await shot('3065-9-ticket-assign-owners.png'); }
out.net = net; return out;
