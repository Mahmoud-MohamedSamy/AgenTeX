const D=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).D;
await page.goto(H+'/settings/automation/sla?department='+D,{waitUntil:'domcontentloaded'});await sleep(8000);
log((await text()).split('AUTOMATION')[1]?.slice(0,1500));
const b=await page.locator('main button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||'')+'|'+x.innerText.trim().slice(0,30)+'|'+(x.dataset.testid||'')));log(JSON.stringify(b));
await shot('2835-0-list.png');
