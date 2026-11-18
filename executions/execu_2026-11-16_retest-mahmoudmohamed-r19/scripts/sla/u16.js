const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.ids.c1id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:120000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
await page.locator('button[aria-label="Support plan Info"]').first().evaluate(e=>e.click());await sleep(4000);
await page.getByRole('button',{name:'Change plan'}).first().evaluate(e=>e.click());await sleep(3000);
const dl=page.locator('[role=dialog]').last();log('dialog',(await dl.innerText().catch(()=>'none')).replace(/\s+/g,' ').slice(0,800));
const cb=dl.locator('[role=combobox],select,button[aria-haspopup]').first();log('cb',await cb.count());
if(await cb.count()){await cb.evaluate(e=>e.click());await sleep(2000);log('opts',JSON.stringify(await page.locator('[role=option]').allInnerTexts()));}
await shot('2841-2-change-plan.png');
