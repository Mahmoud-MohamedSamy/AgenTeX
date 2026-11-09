// H-09: per-ticket "execute skill-based assignment"; also the form with an explicitly chosen owner (B-4 control)
eval(require('fs').readFileSync('lib.js','utf8'));
await page.setViewportSize({width:1600,height:1000});const o={};const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});
const id=IDS.TK_SK1;
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 SK1 auto/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
// three-dots menu in the ticket header
await page.mouse.click(1569,103);await page.waitForTimeout(1500);
o.moreMenu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\n+/g,' | ');await shot('ui-22-ticket-more');await page.keyboard.press('Escape');
// left rail icons (properties / ? / skills sparkle)
const rail=page.locator('button').filter({has:page.locator('svg')});
for(const [x,y,k] of [[342,128,'rail2'],[342,172,'rail3']]){await page.mouse.click(x,y);await page.waitForTimeout(2000);o[k]=(await page.locator('#main-content').innerText()).replace(/\s+/g,' ').slice(0,700);await shot('ui-23-'+k);}
o.skillButtons=await page.getByRole('button').evaluateAll(es=>es.map(e=>(e.innerText||e.getAttribute('aria-label')||'').trim()).filter(t=>/skill|recalc|assign/i.test(t)));
return o;
