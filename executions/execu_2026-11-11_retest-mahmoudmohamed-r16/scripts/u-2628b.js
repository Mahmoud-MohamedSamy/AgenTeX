const reqs = []; page.on('response', async r => { const u = r.url(); if (/api\/v1\/.*(search|records|tags)/i.test(u)) reqs.push(r.status() + ' ' + decodeURIComponent(u.replace(/^.*api\/v1/, '')).slice(0, 200)); });
await page.goto(H + '/', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Search or jump/i.test(await text())) break; } await sleep(3000);
await page.keyboard.press('Control+k'); await sleep(1500); await page.keyboard.type('#Rule', { delay: 60 }); await sleep(5000);
await shot('2628-hashPartial.png');
reqs.length = 0;
await page.locator('[role=dialog]').last().getByText('#Rule A Done', { exact: true }).first().click(); await sleep(8000);
const t = await text(); log('url', page.url()); await shot('2628-tag-click.png');
return { url: page.url(), body: t.slice(0, 1500), api: reqs.slice(0, 8) };
