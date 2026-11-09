eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const S=n=>page.screenshot({path:'../screenshots/'+n+'.png'});const TK='e75071c9-b86c-4678-a722-b8d51fb9d976';
await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.waitForFunction(()=>/New Rule/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
await page.getByRole('tab',{name:/Team Assignment/i}).first().click();await page.waitForTimeout(2500);
const dd=page.locator('main').getByText('Customer Support',{exact:true}).first();await dd.click();await page.waitForTimeout(1200);
const opt=page.getByRole('option',{name:'QA AS6 Dept A'});if(await opt.count())await opt.first().click();else await page.getByText('QA AS6 Dept A',{exact:true}).last().click();
await page.waitForTimeout(2500);o.tabText=(await page.innerText('main')).replace(/\s+/g,' ').match(/Team Assignment for.{0,60}/)?.[0];
o.switch=await page.getByRole('switch').first().getAttribute('aria-checked').catch(()=>null);
await S('ev-B3-team-assignment-off');
// turn back ON, then check the picker shows Teams
o.on=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{enabled:true})).s;LED('B-3 evidence 7 Nov: Dept A Team Assignment back ON');
await page.goto(H+'/views/all/tickets/'+TK,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 B3 team assignment off/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const b=await page.getByText('Ticket Owner').first().boundingBox();await page.mouse.click(b.x+60,b.y+b.height+22);await page.waitForTimeout(2500);
o.pickerOn=(await page.locator('[data-radix-popper-content-wrapper],[role=dialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
await S('ev-B3-picker-on');
return o;
