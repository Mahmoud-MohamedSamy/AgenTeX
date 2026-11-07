const o = {}; const net = [];
page.on('request', r => { if (['POST', 'PUT', 'PATCH'].includes(r.method()) && /desk\/tickets|blueprint/.test(r.url()) && !/viewers|read$/.test(r.url())) net.push(r.method() + ' ' + r.url().replace(/^.*api\/v1/, '') + ' ' + (r.postData() || '').slice(0, 400)); });
page.on('response', async r => { const u = r.url(); if ((['POST', 'PUT', 'PATCH'].includes(r.request().method()) && /desk\/tickets|blueprint/.test(u) && !/viewers|read$/.test(u)) || /rating/.test(u)) net.push('→ ' + r.status() + ' ' + u.replace(/^.*api\/v1/, '') + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/views/all/tickets/5fe15f85-aaf6-4188-a8f8-05481fbf4748', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2754F t5/.test(await text()) && /Assign owners/.test(await text())) break; } await sleep(3000);
// Assign owners for QA hold
await page.getByRole('button', { name: /Assign owners/ }).nth(3).click(); await sleep(3000); await shot('2754-o-assign-owners.png');
const pop = page.locator('[role=dialog], [role=menu], [data-radix-popper-content-wrapper]').last(); o.pop = (await pop.innerText().catch(() => '')).slice(0, 800);
o.popCtl = await pop.locator('select, input, button, [role=combobox], [role=option], [role=checkbox]').evaluateAll(a => a.map(x => x.tagName + ':' + (x.getAttribute('aria-label') || x.placeholder || x.innerText || '').slice(0, 40))).catch(() => []);
const asel = pop.locator('select').first(); await asel.selectOption({ label: 'Customer Experience Specialists 2' }); await sleep(1500); await shot('2754-p-owner-picked.png'); await pop.getByRole('button', { name: 'Save' }).click(); await sleep(5000); await shot('2754-q-owner-saved.png'); o.after = ((await text()).match(/QA rate[sS]{0,120}/) || [''])[0];
o.net = net.filter(x => !/summaries|happiness/.test(x)); return o;
