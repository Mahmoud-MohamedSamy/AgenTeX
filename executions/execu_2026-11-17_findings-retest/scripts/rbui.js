const reqs = []; page.on('request', r => { if (/recycle-bin/.test(r.url())) reqs.push(r.url().replace(/^https:\/\/[^/]+/, '')); });
await page.goto(H + '/settings/data/recycle-bin', { waitUntil: 'commit' }); await sleep(12000);
log('url', page.url());
const box = page.locator('input[type=search], input[placeholder*="earch"]').first();
if (await box.count()) { await box.fill('zzqq-no-such-record-777'); await sleep(5000); }
await shot('N8-1-crm-recycle-search.png');
log('reqs', reqs.slice(-6));
log('rows', (await text()).slice(0, 1500).replace(/\s+/g, ' '));
