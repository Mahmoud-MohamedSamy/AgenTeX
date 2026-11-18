const D=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).D;
await page.goto(H+'/settings/automation/sla?department='+D,{waitUntil:'domcontentloaded'});await sleep(8000);
await page.getByRole('button',{name:'New SLA'}).click();await sleep(2500);
await page.getByPlaceholder('e.g. Chat Tickets').fill('QA RT19 SLA 2835 UI');
await page.locator('label').filter({hasText:'Ticket Create'}).click();await sleep(500);
await page.getByRole('button',{name:'Next'}).click();await sleep(2000);
await page.getByRole('button',{name:/Add Target/}).click();await sleep(2500);
const dump=async()=>log(JSON.stringify(await page.locator('[role=dialog] input, [role=dialog] button, [role=dialog] select, [role=dialog] [role=combobox], [role=dialog] [role=switch], [role=dialog] label, [role=dialog] h2, [role=dialog] h3').evaluateAll(b=>b.map(x=>x.tagName+':'+(x.getAttribute('aria-label')||x.getAttribute('name')||x.getAttribute('placeholder')||'')+'|'+(x.innerText||x.value||'').trim().slice(0,40)))));
await dump();await shot('2835-x2.png');
