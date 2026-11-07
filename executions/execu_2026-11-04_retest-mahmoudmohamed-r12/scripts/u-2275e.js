const posts = []; page.on('request', r => { if (r.method() === 'POST' && /records$/.test(r.url())) posts.push(r.postData()); });
const resp = []; page.on('response', async r => { if (r.request().method() === 'POST' && /records$/.test(r.url())) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
await shot('2275-c1-newticket.png', { fullPage: true });
const t = await text(); return { form: t.slice(t.indexOf('Create Ticket') - 50, t.indexOf('Create Ticket') + 1500) };
