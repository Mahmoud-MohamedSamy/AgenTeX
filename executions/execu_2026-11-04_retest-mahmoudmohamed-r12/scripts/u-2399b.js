const o = {}; const net = [];
page.on('response', async r => { const u = r.url(); if (/integrations\/crm/.test(u) && r.request().method() === 'POST') net.push(r.status() + ' ' + u.replace(/^.*api\/v1/, '') + ' ' + (await r.text().catch(() => '')).slice(0, 200)); });
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/CRM ⇄ Desk Integration/.test(await text())) break; }
await page.getByText('CRM ⇄ Desk Integration', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Sync History/.test(await text())) break; } await sleep(2000);
await page.getByText('Sync History', { exact: true }).first().click(); await sleep(3000);
o.startedAt = new Date().toISOString();
await page.getByRole('button', { name: 'Sync all customers' }).click(); await sleep(2500);
if (await page.getByRole('dialog').count()) { o.confirm = (await page.getByRole('dialog').last().innerText()).slice(0, 300); await page.getByRole('dialog').last().getByRole('button', { name: /Sync|Start|Confirm|Run/ }).last().click(); }
await sleep(45000);
await page.getByText('Failure Log', { exact: true }).first().click(); await sleep(4000);
o.failTop = ((await text()).match(/Failure Log[\s\S]{0,500}/g) || ['']).pop();
const sk = page.getByText(/^Skipped/).first(); await sk.click(); await sleep(4000); await shot('2399-d-skipped-now.png'); o.skipped = ((await text()).match(/records? skipped[\s\S]{0,400}/) || [''])[0];
o.net = net; return o;
