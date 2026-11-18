const D=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).D;
await page.goto(H+'/settings/automation/sla?department='+D,{waitUntil:'domcontentloaded'});await sleep(8000);
await page.getByRole('button',{name:'New SLA'}).click();await sleep(2500);
const dump=async()=>log(JSON.stringify(await page.locator('main input, main button, main select, main [role=combobox], main [role=switch], main [role=checkbox], main label').evaluateAll(b=>b.map(x=>x.tagName+':'+(x.getAttribute('aria-label')||x.getAttribute('name')||x.getAttribute('placeholder')||'')+'|'+(x.innerText||x.value||'').trim().slice(0,30)).filter(Boolean))));
await dump();await shot('2835-x1.png');
