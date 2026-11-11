const T='88e8ea44-1658-4df3-9930-d0902b91073d', L='1b55c25d-eb27-4046-afd1-b292398b435b';
const sent=[]; page.on('request',r=>{const u=r.url(); if(/layouts|\/fields/.test(u) && r.method()!=='GET') sent.push(r.method()+' '+u.replace(/.*api\/v1/,''));});
// make the layout save fail the way the server does (422 with LAYOUT error)
await page.route('**/api/v1/modules/'+T+'/layouts/'+L, async route => { if (route.request().method()==='PUT') return route.fulfill({status:422, contentType:'application/json', body: JSON.stringify({success:false,data:null,error:{code:'LAYOUT_INVALID',message:'"resolution" cannot be removed from the layout: non-removable standard fields stay on it. Move them instead.',details:null},meta:null})}); return route.continue(); });
await page.goto(H + '/settings/modules-and-fields/'+T+'/layouts/'+L, { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Ticket Owner/.test(await text())) break; }
const cands = page.getByText(/^Phone( QA RT15)?$/); let lab=null; for (let i=0;i<await cands.count();i++){ const b = await cands.nth(i).boundingBox(); if (b && b.x > 340) { lab = cands.nth(i); break; } }
await lab.dblclick(); await sleep(1000);
const inp = page.locator('input:focus'); await inp.fill('Phone QA RT15 fail'); await page.keyboard.press('Enter'); await sleep(1000);
await page.getByRole('button', {name:'Save', exact:true}).first().click(); await sleep(7000);
log('toasts', await page.$$eval('[data-sonner-toast], [role=alert]', ts => ts.map(t=>t.innerText.trim()).filter(Boolean)));
await shot('2816-failed-save.png');
const tok = (await ctx.cookies()).find(c=>c.name==='aw_staging_access_token').value;
const hdr = {authorization:'Bearer '+tok, 'x-app-key':'desk'};
const f = await page.request.get(H+'/api/v1/modules/'+T+'/fields', {headers:hdr}); const ph = (await f.json()).data.find(x=>x.fieldName==='phone'); log('phone label in Fields after failed save', JSON.stringify(ph.labels));
log('sent', sent);
