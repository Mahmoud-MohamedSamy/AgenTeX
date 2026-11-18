const res=[]; page.on('response',async r=>{ if(r.url().includes('/channels/domains') && r.request().method()!=='GET'){ res.push(r.request().method()+' '+r.status()+' '+(r.request().postData()||'')+' → '+(await r.text().catch(()=>'')).slice(0,300)); }});
await page.goto(H+'/settings/channels/email',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('tab',{name:/Your domains/}).click(); await sleep(3000);
const out=[]; let i=0;
for (const v of ['http://x.com','exa mple.com','abc','taviportal.com']) {
  i++; res.length=0;
  const inp=page.locator('input[placeholder="acme.com"]'); await inp.fill(v); await sleep(500);
  const btn=page.getByRole('button',{name:'Add domain'}); const dis=await btn.isDisabled();
  if(!dis) await btn.click(); await sleep(5000);
  const m=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
  const idx=m.indexOf('Add domain'); out.push({v,disabled:dis,res:[...res],near:m.slice(idx,idx+400), inv: await inp.getAttribute('aria-invalid')});
  await shot('3002-'+i+'-'+v.replace(/[^a-z]/gi,'_')+'.png');
}
return out;
