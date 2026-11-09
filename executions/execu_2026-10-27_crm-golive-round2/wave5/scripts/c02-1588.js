const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const res = {};
const cl = await call('POST', `/modules/${M}/layouts/${L}/clone`, { name: 'QA R2W5 Layout B' }); res.clone = cl.s; const B = cl.j && cl.j.data && cl.j.data.id; res.B = B;
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(6000);
res.table = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create New Layout.*/)?.[0].slice(0, 400);
const row = page.locator('main tr', { hasText: 'QA R2W5 Layout B' }).first();
await row.hover(); await sleep(500);
await row.locator('button').last().click(); await sleep(1000);
res.menu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || '));
await shot('c02-1588-row-menu');
await page.keyboard.press('Escape');
const drow = page.locator('main tr', { hasText: /^\s*Default/ }).first();
await drow.hover(); await drow.locator('button').last().click(); await sleep(1000);
res.defaultMenu = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || '));
await page.keyboard.press('Escape');
// NDC-140: deactivate B, then accessible list
const dis = await call('PUT', `/modules/${M}/layouts/${B}`, { status: 'inactive' }); res.disable = dis.s + ' ' + dis.t.slice(0, 160);
const acc = await call('GET', `/modules/${M}/layouts/accessible`); res.accessible = acc.s + ' ' + JSON.stringify((acc.j && (Array.isArray(acc.j.data) ? acc.j.data : acc.j.data?.layouts) || []).map(l => l.name + ':' + l.status));
// default can't be deactivated?
const dd = await call('PUT', `/modules/${M}/layouts/${L}`, { status: 'inactive' }); res.disableDefault = dd.s + ' ' + dd.t.slice(0, 200);
return res;
