const reqs=[]; page.on('response',async r=>{ if(/field-usage|values\/(delete|usage)/.test(r.url())) { let b=''; try{b=(await r.text()).slice(0,300);}catch(e){} reqs.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'{id}')+' '+b); } });
page.on('pageerror',e=>reqs.push('PAGEERROR '+String(e).slice(0,200)));
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); if(/Global Sets/.test(await text())) break; }
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();});
for(let i=0;i<20;i++){ await sleep(1500); if(/QA RT19 GS Tier/.test(await text())) break; }
await page.locator('tr:has-text("QA RT19 GS Tier") button:has-text("QA RT19 GS Tier")').first().click(); await sleep(5000);
const dlg=page.locator('[role=dialog]').last();
const cop=dlg.locator('li:has-text("Copper"), div:has(> span:text-is("Copper"))').last();
log('copper buttons', await dlg.locator('button').evaluateAll(bs=>bs.map(b=>(b.innerText.trim()||b.getAttribute('aria-label')||b.title||'?')).slice(-12)));
const del=dlg.getByRole('button',{name:/delete/i}); log('delete buttons',await del.count());
if(await del.count()){ await del.last().click(); for(let i=0;i<10;i++){ await sleep(1500); if(!/Loading…/.test(await text())) break; } await sleep(1500); log('dialog',(await text()).slice(-900)); await shot('2870-7-delete-copper.png'); 
  const good=page.getByRole('button',{name:/delete for good/i}); if(await good.count()){ log('deleteForGood enabled',await good.last().isEnabled()); if(await good.last().isEnabled()){ await good.last().click(); await sleep(4000); log('after',(await text()).slice(-600)); await shot('2870-8-after-delete.png'); } } }
log('reqs',reqs);
return {};
