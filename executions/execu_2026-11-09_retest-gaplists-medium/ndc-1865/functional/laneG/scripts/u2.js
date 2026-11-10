const RAW='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/evidence/raw/';
const o={};
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(2000);const t=await page.innerText('body');if(/Subject/.test(t)&&/Department/.test(t))break;}
await page.screenshot({path:RAW+'_probe-form.png'});
o.body=(await page.innerText('main').catch(()=>page.innerText('body'))).slice(0,1500);
o.inputs=await page.$$eval('input,select,textarea,[role=combobox]',es=>es.filter(e=>e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,name:e.name||e.id||e.getAttribute('aria-label')||e.placeholder||'',y:Math.round(e.getBoundingClientRect().y),x:Math.round(e.getBoundingClientRect().x)})).slice(0,40));
return o;
