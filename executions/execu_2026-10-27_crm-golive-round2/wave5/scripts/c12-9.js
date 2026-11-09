const res = {};
await page.goto(H + '/settings/teamspace', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 20; i++) { await sleep(1000); if (await page.locator('text=QA R2W5 TS').count()) break; }
res.list = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create New Teamspace.{0,500}/)?.[0];
await page.locator('text=QA R2W5 TS').first().click(); await sleep(4000);
res.edit = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Modules Associate.{0,200}/)?.[0];
await shot('c12-1695-reloaded');
res.btns = [...new Set(await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean)))].slice(-20);
res.admin = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Admin.{0,60}/)?.[0];
// 1700: open CRM Teamspace and read admin shown vs API
await page.goto(H + '/settings/teamspace', { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 20; i++) { await sleep(1000); if (await page.locator('text=CRM Teamspace').count()) break; }
await page.locator('main').locator('text=CRM Teamspace').first().click(); await sleep(4000);
res.crmAdmin = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Admin.{0,60}/)?.[0];
await shot('c12-1700-crm-ts');
const t = await call('GET', '/teamspaces/5ea90671-4df5-4642-939d-49494f8e4d6e'); res.crmTsApi = JSON.stringify(t.j.data).match(/"admin[^,]*,[^,]*/gi);
const m = await call('GET', '/teamspaces/5ea90671-4df5-4642-939d-49494f8e4d6e/members'); res.members = m.s + ' ' + m.t.slice(0, 400);
return res;
