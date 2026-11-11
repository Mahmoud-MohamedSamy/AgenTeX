const reqs = []; page.on('response', r => { if (/global-sets/.test(r.url())) reqs.push(r.request().method()+' '+r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')); });
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Leads/i.test((await text()).slice(500))) break; }
const tabs = await page.$$eval('[role=tab], button', bs => bs.map(b => b.innerText.trim()).filter(t => t && t.length < 30)); log(tabs.slice(0,60));
const g = page.getByRole('tab', { name: /Global/i }); if (await g.count()) { await g.first().click(); await sleep(5000); }
else { const b = page.getByText(/Global Sets?/).first(); if (await b.count()) { await b.click(); await sleep(5000); } }
log(page.url()); const t = await text(); log(t.slice(t.indexOf('Modules'), t.indexOf('Modules') + 2500)); await shot('2806-list.png'); log(reqs);
