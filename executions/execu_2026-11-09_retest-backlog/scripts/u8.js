const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=layouts',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('QA NDC Accounting',{exact:true}).first().waitFor({timeout:150000});await sleep(3000);
await page.getByText('QA NDC Accounting',{exact:true}).first().click();await sleep(4000);
await page.getByText(/QA NDC Amount|Amount/).first().waitFor({timeout:150000}).catch(e=>o.w=e.message.slice(0,80));await sleep(4000);
o.url=page.url();await page.screenshot({path:SS+'u8-layout-editor.png'});
o.btn=await page.$$eval('button',b=>[...new Set(b.map(x=>(x.getAttribute('aria-label')||x.getAttribute('title')||x.innerText||'').trim()).filter(Boolean))].slice(60,160));
return o;
