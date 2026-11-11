const reqs=[]; page.on('request',r=>{const u=r.url(); if(/layouts|\/fields/.test(u) && r.method()!=='GET') reqs.push(r.method()+' '+u.replace(/.*api\/v1/,'')+' '+(r.postData()||'').length);});
const resps=[]; page.on('response',async r=>{const u=r.url(); if(/layouts|\/fields/.test(u) && r.request().method()!=='GET') resps.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'')+' '+(await r.text().catch(()=>'')).slice(0,200));});

await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/1b55c25d-eb27-4046-afd1-b292398b435b', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Phone/.test(await text()) && /CREATE|Create/.test(await text())) break; }
log('url', page.url()); await shot('2815-editor-open.png');
// go to detail tab and back (ticket says same failure after opening Detail)
const det = page.getByText(/^DETAIL VIEW$/i).first(); if (await det.count()) { await det.click(); await sleep(2000); await shot('2815-detail-tab.png'); }
await page.getByText(/^CREATE$/i).first().click().catch(()=>{}); await sleep(2000);
const ph = page.getByText('Phone', {exact:true}).first(); await ph.click(); await sleep(1000);
const inp = page.locator('input:focus'); if (await inp.count()) { await inp.fill('Phone QA RT15'); await page.keyboard.press('Enter'); } else log('no focused input after label click');
await sleep(1500); await shot('2815-renamed.png');
await page.getByRole('button', {name:'Save', exact:true}).first().click(); await sleep(6000);
const toasts = await page.$$eval('[data-sonner-toast], [role=status], [role=alert]', ts => ts.map(t=>t.innerText.trim()).filter(Boolean)); log('toasts', toasts);
await shot('2815-after-save.png');
log('reqs', reqs); log('resps', resps);
