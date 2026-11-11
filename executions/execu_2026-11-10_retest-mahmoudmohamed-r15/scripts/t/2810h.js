const o = {}; const net = [];
page.on('response', async r => { const u = r.url(); if (/integrations\/crm/.test(u) && r.request().method() === 'POST') net.push(r.status() + ' ' + u.replace(/^.*api\/v1/, '') + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/CRM ⇄ Desk Integration/.test(await text())) break; }
await page.getByText('CRM ⇄ Desk Integration', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(2000); if (/Sync History/.test(await text())) break; } await sleep(2000);
o.url = page.url();
await page.getByText('Sync History', { exact: true }).first().click(); await sleep(3000);
await shot('2810-history-before.png');
o.startedAt = new Date().toISOString();
await page.getByRole('button', { name: 'Sync all customers' }).click(); await sleep(2500);
if (await page.getByRole('dialog').count()) { o.confirm = (await page.getByRole('dialog').last().innerText()).slice(0, 300); await page.getByRole('dialog').last().getByRole('button', { name: /Sync|Start|Confirm|Run/ }).last().click(); }
await sleep(60000);
await page.reload({ waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/Sync History/.test(await text())) break; }
await page.getByText('Sync History', { exact: true }).first().click().catch(()=>{}); await sleep(4000);
const t = await text(); o.historyTop = t.slice(t.indexOf('Sync History'), t.indexOf('Sync History') + 1500).replace(/\n+/g, ' | ');
await shot('2810-history-after.png');
await page.getByText('Failure Log', { exact: true }).first().click(); await sleep(4000);
const t2 = await text(); o.failTop = t2.slice(t2.indexOf('Failure Log'), t2.indexOf('Failure Log') + 1200).replace(/\n+/g, ' | ');
await shot('2810-failure-log.png');
o.net = net; return o;
