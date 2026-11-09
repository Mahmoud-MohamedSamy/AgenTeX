const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});const calls=[];
page.on('request',r=>{const u=r.url();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u))calls.push(r.method()+' '+u.replace(/.*api\/v1/,'').slice(0,160));});
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Ticket Status',{exact:true}).last().waitFor({timeout:120000});await sleep(2000);
await page.getByText('Ticket Status',{exact:true}).last().click();
const h=page.getByText('Statuses by department and layout',{exact:true}).first();await h.waitFor({timeout:90000});
const sels=page.locator('select');await sels.nth(1).selectOption({label:'QA NDC Accounting'});await sleep(4000);
o.layouts=await sels.nth(2).evaluate(x=>[...x.options].map(o=>o.text));
if(o.layouts.length>1){await sels.nth(2).selectOption({index:1});await sleep(5000);}
await h.scrollIntoViewIfNeeded();await page.mouse.wheel(0,250);await sleep(1500);
await page.screenshot({path:SS+'2174-10c-by-dept-layout.png'});
const sec=h.locator('xpath=ancestor::*[.//select][1]/..');
o.sec=(await sec.innerText()).replace(/QA NDC[^\n]*\n/g,'').slice(0,2500);
o.calls=[...new Set(calls)].filter(c=>!/notifications|integrations|send-as/.test(c));
return o;
