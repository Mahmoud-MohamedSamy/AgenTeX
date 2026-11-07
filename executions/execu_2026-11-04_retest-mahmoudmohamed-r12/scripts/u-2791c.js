// usage: MODE=mark|unmark
const o = {}; const reqs = [];
page.on('request', r => { if (['PUT', 'PATCH', 'POST'].includes(r.method()) && /layouts|fields/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^.*api\/v1/, '') + ' len=' + (r.postData() || '').length); });
page.on('response', async r => { if (['PUT', 'PATCH', 'POST'].includes(r.request().method()) && /layouts|fields/.test(r.url())) reqs.push('→ ' + r.status()); });
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/238085b7-78da-4805-8fb6-6063855256f0', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Save and Close/.test(await text())) break; } await sleep(5000);
const lab = page.getByText('QA NDC 4-Account Number', { exact: true }).first(); await lab.scrollIntoViewIfNeeded(); await sleep(800); await lab.hover(); await sleep(800);
const b = await lab.boundingBox(); await page.mouse.move(1521, b.y + 8); await sleep(500); await page.mouse.click(1521, b.y + 8); await sleep(1500);
o.menu = (await page.getByRole('menuitem').allInnerTexts()).map(s => s.trim()); if (!o.menu.length) o.menu = (await page.locator('[role=menu] *').allInnerTexts()).slice(0, 15);
await shot(`2791-d-menu-${process.env.MODE}.png`);
const want = process.env.MODE === 'mark' ? /Mark as Required/i : /(Mark as Optional|Remove Required|Unmark|Not Required|Mark as Not Required)/i;
const it = page.getByText(want); o.found = await it.count(); o.menuText = (await page.locator('body').innerText()).match(/Mark as [A-Za-z ]+/g);
if (o.found) { await it.first().click(); await sleep(2000); await shot(`2791-e-after-${process.env.MODE}.png`); await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(8000); o.toast = (await text()).match(/[^\n]*(saved|updated|success|error|failed)[^\n]*/gi)?.slice(0, 3); }
o.reqs = reqs;
return o;
