const T='88e8ea44-1658-4df3-9930-d0902b91073d', L='1b55c25d-eb27-4046-afd1-b292398b435b';
const resps=[]; page.on('response',async r=>{const u=r.url(); if(/layouts|\/fields/.test(u) && r.request().method()!=='GET') resps.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'')+' '+(await r.text().catch(()=>'')).slice(0,220));});
await page.goto(H + '/settings/modules-and-fields/'+T+'/layouts/'+L, { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Ticket Owner/.test(await text())) break; }
// bump the layout from outside (same content, new rowVersion)
const tok = (await ctx.cookies()).find(c=>c.name==='aw_staging_access_token').value;
const hdr = {authorization:'Bearer '+tok, 'x-app-key':'desk', 'content-type':'application/json'};
const g = await page.request.get(H+'/api/v1/modules/'+T+'/layouts/'+L, {headers:hdr}); const cur = (await g.json()).data;
const p = await page.request.put(H+'/api/v1/modules/'+T+'/layouts/'+L, {headers:hdr, data: JSON.stringify(cur)}); log('outside PUT', p.status());
// rename Phone label in the stale editor
const canvas = page.locator('main');
const cands = page.getByText('Phone', {exact:true}); let lab=null; for (let i=0;i<await cands.count();i++){ const b = await cands.nth(i).boundingBox(); if (b && b.x > 340) { lab = cands.nth(i); break; } } log('label found', !!lab); await lab.dblclick(); await sleep(1000);
const inp = page.locator('input:focus'); log('focused', await inp.count()); await inp.fill('Phone QA RT15'); await page.keyboard.press('Enter'); await sleep(1000);
await page.getByRole('button', {name:'Save', exact:true}).first().click(); await sleep(7000);
log('toasts', await page.$$eval('[data-sonner-toast], [role=alert]', ts => ts.map(t=>t.innerText.trim()).filter(Boolean)));
await shot('2816-stale-save.png');
const f = await page.request.get(H+'/api/v1/modules/'+T+'/fields', {headers:hdr}); const ph = (await f.json()).data.find(x=>x.fieldName==='phone'); log('phone label in Fields after failed save', JSON.stringify(ph.labels));
log('resps', resps);
