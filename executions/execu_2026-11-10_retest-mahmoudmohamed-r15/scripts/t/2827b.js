const id='a9bfd0be-ff18-48d3-b3a3-a0677184220d';
const resps=[]; page.on('response',async r=>{const u=r.url(); if(/skill/i.test(u) && r.request().method()!=='GET') resps.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'')+' '+(await r.text().catch(()=>'')).slice(0,150));});
await page.goto(H + '/views/all/tickets/'+id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2205/.test(await text())) break; } await sleep(3000);
await page.locator('button[aria-label="Skills"]').click(); await sleep(2000);
await page.getByText('Associate Skills', {exact:false}).first().click(); await sleep(2000);
await shot('2827-associate-dialog.png');
const dlgTxt = await page.locator('[role=dialog], [role=listbox], [role=menu]').last().innerText().catch(()=>'' ); log('picker', dlgTxt.slice(0,600).replace(/\n+/g,' | '));
const opt = page.getByText('billing', {exact:true}).last(); await opt.click().catch(e=>log('optErr', String(e).slice(0,100))); await sleep(800);
const save = page.getByRole('button', {name:/^(Associate|Save|Add|Done|Apply)$/}).last(); if (await save.count()) { await save.click(); await sleep(3000); }
const t1 = await text(); const k = t1.indexOf('Associate Skills'); log('panel after', t1.slice(k-40, k+300).replace(/\n+/g,' | '));
await shot('2827-associated.png');
await page.reload({waitUntil:'domcontentloaded'}); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2205/.test(await text())) break; } await sleep(2000);
await page.locator('button[aria-label="Skills"]').click(); await sleep(2000);
const t2 = await text(); const k2 = t2.indexOf('Associate Skills'); log('after reload', t2.slice(k2-40, k2+300).replace(/\n+/g,' | '));
await shot('2827-after-reload.png');
const tok = (await ctx.cookies()).find(c=>c.name==='aw_staging_access_token').value;
const r = await page.request.get(H+'/api/v1/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+id, {headers:{authorization:'Bearer '+tok,'x-app-key':'desk'}});
log('record skills', JSON.stringify(((await r.json()).data.data||[]).filter(x=>/skill/i.test(x.field))));
log('resps', resps);
