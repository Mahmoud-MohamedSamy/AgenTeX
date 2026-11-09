const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Case Information',{exact:true}).waitFor({timeout:200000});await sleep(4000);
const lbl=page.getByText('Contact',{exact:true}).first();await lbl.hover();await sleep(1500);
const cell=lbl.locator('xpath=ancestor::*[.//button][1]');
o.cellBtns=await cell.locator('button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||x.getAttribute('title')||x.innerText||'?').trim()));
await page.screenshot({path:SS+'u9-hover.png'});
return o;
