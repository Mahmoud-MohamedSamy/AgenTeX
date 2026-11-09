// NDC-1819 restore: Tasks table back to the columns seen before the round (Subject, Due date, Status, Priority, Related To).
const st = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Due date/.test(t)) break; } await sleep(5000);
await page.mouse.click(1562, 143); await sleep(1500);
await page.getByText('Manage Columns', { exact: true }).last().click(); await sleep(2500);
const panel = page.locator('text=Manage Columns').last().locator('xpath=ancestor::*[.//button[normalize-space()="Apply"]][1]');
const row = name => panel.locator('div').filter({ has: page.getByText(name, { exact: true }) }).filter({ has: page.getByRole('button') }).last();
for (const n of ['Task Owner', 'Reminder', 'Contact Name', 'Created At', 'Last Activity']) { const b = row(n).getByRole('button', { name: 'Hide' }); if (await b.count()) { await b.click(); await sleep(500); } }
for (const n of ['Status', 'Priority', 'Related To']) { const b = row(n).getByRole('button', { name: 'Show' }); if (await b.count()) { await b.click(); await sleep(500); } }
await shot('1819-f1-mc.png'); st.panel = (await panel.innerText()).replace(/\s+/g, ' ').slice(0, 400);
await page.getByRole('button', { name: 'Apply' }).click(); await sleep(3000);
st.heads = (await page.locator('table thead th').allInnerTexts()).map(x => x.trim()).filter(Boolean);
return st;
