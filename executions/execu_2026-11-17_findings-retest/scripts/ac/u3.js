await page.goto(H+'/views',{waitUntil:'domcontentloaded'}); await sleep(10000);
const cbs=page.locator('input[type=checkbox], [role=checkbox]');
// row hover menu
const r1=page.locator('[role=row]').nth(1); log('rows',await page.locator('[role=row]').count());
log('row1',(await r1.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300));
await r1.hover().catch(()=>{}); await sleep(800);
log('rowbtns',await r1.locator('button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+'|'+e.innerText.trim()).slice(0,12)));
const mb=r1.locator('button[aria-label*="ore" i], button[aria-haspopup]');
if(await mb.count()){await mb.last().click(); await sleep(1500); log('rowmenu',(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\s+/g,' ')); await shot('A1-2-rowmenu.png'); await page.keyboard.press('Escape'); await sleep(500);}
await cbs.nth(1).click({force:true}); await sleep(2000);
const t=await text(); const i=t.search(/selected/i); log('bulk',t.slice(Math.max(0,i-80),i+400).replace(/\s+/g,' '));
await shot('A1-3-bulk.png');
const btns=await page.locator('button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'')+'|'+e.innerText.trim()).filter(x=>x.length>1).slice(0,80)); log('btns',btns.join(' ; '));
