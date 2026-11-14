const G='7f85fb11-8587-4cc0-b1f1-d973bb371b3a';
const net=[]; const t0=Date.now(); page.on('request', r => { const u=r.url(); if (/recycle-bin\/(delete|purge|empty)/.test(u)) net.push('REQ +'+(Date.now()-t0)+'ms ids='+(((r.postData()||'').match(/[0-9a-f]{8}-[0-9a-f-]{27}/g)||[]).length)); });
page.on('response', r => { const u=r.url(); if (/recycle-bin\/(delete|purge|empty)/.test(u)) net.push('RES +'+(Date.now()-t0)+'ms '+r.status()); });
page.on('requestfailed', r => { if (/recycle-bin/.test(r.url())) net.push('FAILED +'+(Date.now()-t0)+'ms '+(r.failure()&&r.failure().errorText)); });
await page.goto(H + '/settings/data/recycle-bin?group='+G, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/2807/.test(await text())) break; }
await sleep(3000);
const ps = page.locator('select').filter({ has: page.locator('option', {hasText:'200'}) }); log('pagesize selects', await ps.count());
if (await ps.count()) { await ps.first().selectOption('200'); await sleep(6000); }
await page.locator('main thead input[type=checkbox]').first().click(); await sleep(2000);
const del = page.getByRole('button', {name:/^Delete \(\d+\)$/}).first(); log('delbtn', await del.innerText().catch(()=>'none'));
await del.click(); await sleep(1500);
const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); log('confirm', (await dlg.innerText()).replace(/\n/g,' | ').slice(0,200));
const wr = page.waitForRequest(r => /recycle-bin\/delete/.test(r.url()), { timeout: 60000 });
await dlg.getByRole('button', {name:'Delete forever'}).click({ noWaitAfter:true });
await wr; await sleep(300); await shot('2807-bin-running.png'); log('banner', ((await text()).match(/(Deleting[^\n]*)/i)||[''])[0]);
await page.goto(H + '/', { waitUntil: 'commit' }); await sleep(2000); log('left url', page.url(), '+'+(Date.now()-t0)+'ms');
await sleep(4000); await shot('2807-bin-home.png'); log('toast home', ((await text()).match(/(Deleting[^\n]*|\d+ of \d+[^\n]*)/i)||[''])[0]);
await sleep(50000);
await page.goto(H + '/settings/data/recycle-bin?group='+G, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/items|No items/i.test(await text())) break; } await sleep(3000);
await shot('2807-bin-back.png'); log('back', ((await text()).match(/\d+ items|Showing[^\n]*/gi)||[]).join(' / '));
log(net);
