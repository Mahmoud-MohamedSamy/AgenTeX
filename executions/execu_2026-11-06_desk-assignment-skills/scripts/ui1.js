await page.setViewportSize({width:1600,height:1000});const t0=Date.now();
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});
await page.waitForFunction(()=>/Direct|Round Robin|Assignment/i.test((document.querySelector('main')||document.body).innerText)&&!document.querySelector('[role=progressbar],.animate-spin'),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const o={url:page.url(),loadSecs:Math.round((Date.now()-t0)/1000)};const body=await page.innerText('body');
o.text=body.slice(body.indexOf('Assignment'),body.indexOf('Assignment')+2500);
o.tabs=await page.locator('[role=tab]').allInnerTexts();o.buttons=(await page.locator('main button, [role=main] button').allInnerTexts()).filter(Boolean).slice(0,60);
o.switches=await page.locator('[role=switch]').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||'(no name)').slice(0,60)+':'+e.getAttribute('aria-checked')));
await page.screenshot({path:'../screenshots/ui-01-page.png'});return o;
