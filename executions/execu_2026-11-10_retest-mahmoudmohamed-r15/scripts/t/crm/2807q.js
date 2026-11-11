const G='cd9bb581-0f7c-4757-b7ea-5c36eef080fc';
const net=[]; const t0=Date.now(); page.on('request', r => { const u=r.url(); if (/recycle-bin\/(delete|purge|empty)/.test(u)) net.push('REQ +'+(Date.now()-t0)+'ms '+u.replace(/^https:\/\/[^/]+/,'')+' ids='+(((r.postData()||'').match(/[0-9a-f]{8}-[0-9a-f-]{27}/g)||[]).length)); });
page.on('response', r => { const u=r.url(); if (/recycle-bin\/(delete|purge|empty)/.test(u)) net.push('RES +'+(Date.now()-t0)+'ms '+r.status()); });
page.on('requestfailed', r => { if (/recycle-bin/.test(r.url())) net.push('FAILED +'+(Date.now()-t0)+'ms '+(r.failure()&&r.failure().errorText)); });
await page.goto(H + '/settings/data/recycle-bin?group='+G, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/2807/.test(await text())) break; }
await sleep(3000);
await page.locator('main thead input[type=checkbox]').first().click(); await sleep(2000);
let t = await text(); log('sel', (t.match(/\d+ (items? )?selected[^\n]*|Select all[^\n]*/gi)||[]).join(' / '));
const sa = page.getByText(/Select all \d+/i); if (await sa.count()) { await sa.first().click(); await sleep(1500); t = await text(); log('sel2', (t.match(/\d+ (items? )?selected[^\n]*/gi)||[]).join(' / ')); }
const btns = await page.$$eval('main button', bs => bs.map(b=>(b.innerText||'').trim()).filter(Boolean)); log('btns', [...new Set(btns)].filter(b=>/delete|restore|empty|purge/i.test(b)));
await shot('NDC-2807-bin-selected.png');
const del = page.getByRole('button', {name:/Delete permanently|Delete selected|Delete Permanently|Delete/}).first();
log('delbtn', await del.innerText().catch(()=>'none'));
await del.click(); await sleep(2000);
const dlg = page.locator('[role=dialog], [role=alertdialog]').last(); const dt = await dlg.innerText().catch(()=>'none'); log('confirm', dt.replace(/\n/g,' | ').slice(0,400)); await shot('NDC-2807-bin-confirm.png');
if (!/2807|450|selected|these/i.test(dt) && /all|entire|empty/i.test(dt)) { log('ABORT: confirm looks like emptying whole bin'); await page.keyboard.press('Escape'); return; }
const ib = dlg.locator('input'); if (await ib.count()) await ib.first().fill('DELETE');
await dlg.getByRole('button', {name:/^(Delete|Delete permanently|Confirm)/}).last().click();
await sleep(1500); await shot('NDC-2807-bin-running.png'); t = await text(); log('banner', (t.match(/(Deleting[^\n]*|\d+ of \d+[^\n]*)/i)||[''])[0]);
// leave mid-run by in-app navigation (left rail Home)
const home = page.locator('a[href="/"]').first(); await home.click({ timeout: 8000 }).catch(e=>log('home err', String(e).slice(0,80))); await sleep(3000); log('url', page.url());
await shot('NDC-2807-bin-left.png'); log('toast', ((await text()).match(/(Deleting[^\n]*|\d+ of \d+[^\n]*done[^\n]*)/i)||[''])[0]);
await sleep(45000);
await page.goto(H + '/settings/data/recycle-bin?group='+G, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/items|No items|empty/i.test(await text())) break; } await sleep(3000);
await shot('NDC-2807-bin-back.png'); t = await text(); log('back', (t.match(/\d+ items|Showing[^\n]*|(Deleting[^\n]*)/gi)||[]).join(' / '));
log(net.slice(0,20));
