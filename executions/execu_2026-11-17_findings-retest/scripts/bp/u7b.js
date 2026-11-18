const out = {}; const net = [];
page.on('request', r => { if (/departments/.test(r.url()) && r.method() !== 'GET') net.push({ t: new Date().toISOString(), m: r.method(), u: r.url().split('/api/v1')[1], body: (r.postData() || '').slice(0, 400) }); });
page.on('response', async r => { if (/departments/.test(r.url()) && r.request().method() !== 'GET') net.push({ s: r.status(), u: r.url().split('/api/v1')[1], body: (await r.text().catch(() => '')).slice(0, 300) }); });
await page.goto(H + '/settings/organization/departments', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Customer Support/.test(await text())) break; }
await page.getByPlaceholder('Search departments').fill('QA RT21 BP'); await sleep(3000);
const row = page.locator('tr', { hasText: 'QA RT21 BP Dept B' }).first();
await row.locator('[role=switch]').first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog], [role=alertdialog]').first();
await dlg.getByText('Select a department').click(); await sleep(1500);

const opt = page.getByRole('option', { name: 'QA RT21 BP Dept A' }).first(); out.opt = await opt.count();
if (out.opt) await opt.click(); else await page.getByText('QA RT21 BP Dept A', { exact: true }).last().click();
await sleep(1500); out.dlgPicked = (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 600);
await shot('F07-2-dialog-picked-A.png');
out.tClick = new Date().toISOString();
await dlg.getByRole('button', { name: 'Transfer and Disable' }).click(); await sleep(2500); out.toast1 = (await page.locator('[role=status], [role=alert], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300); await shot('F07-3b-toast.png'); await sleep(4000);
out.toast = (await page.locator('[role=status], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300);
await shot('F07-3-after-disable.png');
out.net = net; return out;
