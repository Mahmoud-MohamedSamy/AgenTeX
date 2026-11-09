await page.setViewportSize({width:1600,height:1000});const o={};
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText)&&document.querySelectorAll('[role=switch]').length>2,null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2000);
o.lang=await page.evaluate(()=>document.documentElement.lang);
o.iconButtons=await page.locator('main button').evaluateAll(es=>{const r={};for(const e of es){if((e.innerText||'').trim())continue;const n=e.getAttribute('aria-label')||e.getAttribute('title')||'(NO NAME)';const k=n.replace(/QA AS6.*|Tickets with.*|Urgent.*|QA NDC.*|Dev Team|QA Team/,'<rule>');r[k]=(r[k]||0)+1;}return r;});
o.dragHandles=await page.locator('main [draggable=true], main [aria-roledescription*=drag], main [data-dnd-handle], main button[aria-label*=rag], main button[aria-label*=ove]').count();
const row=page.locator('main').getByText(/^QA AS6 nnnn/).first();await row.scrollIntoViewIfNeeded().catch(()=>{});await page.waitForTimeout(800);
o.overflowX=await page.evaluate(()=>{const m=document.querySelector('main');return {scrollW:m.scrollWidth,clientW:m.clientWidth,doc:document.documentElement.scrollWidth,win:innerWidth};});
await page.screenshot({path:'../screenshots/ui-15-long-desc.png'});
// keyboard: tab from New Rule button a few times and record focused names
await page.getByRole('button',{name:/^New Rule$/}).first().focus();const f=[];for(let i=0;i<8;i++){await page.keyboard.press('Tab');f.push(await page.evaluate(()=>{const a=document.activeElement;return a.tagName+':'+(a.getAttribute('aria-label')||a.innerText||'').slice(0,40);}));}o.tabOrder=f;
return o;
