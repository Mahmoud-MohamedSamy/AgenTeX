const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.ids.c1id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:120000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
await page.locator('button[aria-label="Support plan Info"]').first().evaluate(e=>e.click());await sleep(4000);
const t=await page.locator('#main-content').innerText();const i=t.indexOf('Support plan');log(t.slice(Math.max(0,i-50),i+900).replace(/\s+/g,' '));
log(JSON.stringify(await page.locator('#main-content button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||'')+'|'+x.innerText.trim().slice(0,30)).filter(s=>/plan|change|attach|edit/i.test(s)).slice(0,30))));
await shot('2841-x3.png');
