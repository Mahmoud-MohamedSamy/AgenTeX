// NDC-1819 restore: Tasks table columns back to default (Manage Columns ↺), Wrap Text; check the per-module + in the queue list.
const st = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 70; i++) { await sleep(3000); if (/My Open Activities/.test(await text()) && /Total Records/.test(await text())) break; } await sleep(5000);
await page.locator('text=My Open Activities').locator('xpath=following::*[normalize-space()="Tasks"][1]').click();
for (let i = 0; i < 20; i++) { await sleep(2000); const t = await text(); if (/Total Records/.test(t) && /Due date/.test(t)) break; } await sleep(3000);
await shot('1819-e1-tasks.png');
await page.mouse.click(1562, 143); await sleep(1500); await shot('1819-e2-settings.png');
await page.getByText('Manage Columns', { exact: true }).last().click(); await sleep(2500);
await page.mouse.click(1525, 30); await sleep(1500); await shot('1819-e3-mc-reset.png');
await page.getByRole('button', { name: 'Apply' }).click(); await sleep(3000);
st.heads = (await page.locator('table thead th').allInnerTexts()).map(x => x.trim()).filter(Boolean);
await shot('1819-e4-restored.png');
return st;
