const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.ids.c1id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:120000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
await page.locator('button[aria-label="Support plan Info"]').first().evaluate(e=>e.click());
await page.getByRole('button',{name:'Change plan'}).first().waitFor({timeout:60000});
await page.getByRole('button',{name:'Change plan'}).first().evaluate(e=>e.click());
await page.locator('select').first().waitFor({timeout:30000});
for(let i=0;i<30;i++){const x=await page.locator('select').first().evaluate(s=>[...s.options].map(o=>o.text).join('|'));if(!/Loading/.test(x))break;await sleep(2000);}
const o=await page.locator('select').first().evaluate(s=>[...s.options].map(x=>x.text));log('options',JSON.stringify(o));
log('hasB',o.some(x=>/2841 B/.test(x)));
await shot('2841-2-change-plan.png');
