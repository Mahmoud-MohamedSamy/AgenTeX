const out = {}; const net = []; page.on('request', r => { if (/\/api\/v1\//.test(r.url()) && r.method() !== 'GET') net.push(r.method() + ' ' + r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}').slice(0, 90)); });
await page.goto(H + '/views/all/tickets/7ba77b0d-9a39-4448-b532-2a391ffc5ceb', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 role T2').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
await page.getByRole('button', { name: /^Actions/ }).first().click(); await sleep(1500);
out.actions = (await text()).replace(/\s+/g, ' ').match(/Actions.{0,600}/g)?.slice(-1)[0];
await shot('3065-10-actions-menu.png');
const ao = page.getByText(/Assign owners/i).first(); out.ao = await ao.count();
if (out.ao) { await ao.click(); await sleep(3000); const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/Assign owners/i); out.dlg = t.slice(i, i + 700); await shot('3065-11-assign-owners-dialog.png');
  const sels = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].map(s => [...s.options].map(o => o.text))); out.sels = sels; }
out.net = net; return out;
