const reqs=[]; page.on('response',async r=>{const u=r.url(); const m=r.request().method(); if(/api\/v1/.test(u)&&m!=='GET'&&!/heartbeat|resolved-batch|notif|query|lookups/.test(u)) reqs.push(m+' '+u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g,':id').slice(0,80)+' '+r.status()+' '+(r.request().postData()||'').slice(0,160));});
await page.goto(H+'/activities',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByText('Tasks',{exact:true}).first().click(); await sleep(6000);
const ins=await page.locator('input:visible').evaluateAll(es=>es.map(e=>e.placeholder||e.type)); log('inputs',ins);
const sb=page.locator('button[aria-label*="Search" i]:visible').first(); if(await sb.count()){ await sb.click(); await sleep(1000);} 
const si=page.locator('input[placeholder*="Search" i]:visible').last(); if(await si.count()){ await si.fill('QA RT18 2635'); await si.press('Enter'); await sleep(5000);} 
log('rows', (await text()).split('\n').filter(l=>/QA RT18 2635/.test(l)));
const row=page.getByText('QA RT18 2635 task tomorrow',{exact:true}).first(); await row.hover(); await sleep(800);
const cb=row.locator('xpath=ancestor::*[.//input[@type="checkbox"] or .//*[@role="checkbox"]][1]').locator('input[type=checkbox],[role=checkbox]').first(); log('cb', await cb.count()); await cb.click({force:true}); await sleep(2000);
log('bar', (await text()).split('\n').filter(l=>/selected|Delete|Update|Assign|More/.test(l)).slice(0,10)); await shot('2635-7-bulk-bar.png');
let del=page.getByRole('button',{name:/^Delete$/}).first(); if(!(await del.isVisible().catch(()=>false))){ await page.getByRole('button',{name:/More/}).first().click(); await sleep(1200); del=page.getByRole('menuitem',{name:/Delete/}).first(); }
await del.click(); await sleep(2000); const d=page.locator('[role=dialog],[role=alertdialog]').last(); log('dlg',(await d.innerText().catch(()=>'none')).replace(/\n/g,' | ').slice(0,250));
await d.getByRole('button',{name:/^Delete/}).last().click(); await sleep(5000); log('after', (await text()).split('\n').filter(l=>/QA RT18 2635|deleted/i.test(l)).slice(0,6)); await shot('2635-8-after-bulk-delete.png');
log('reqs',reqs);
