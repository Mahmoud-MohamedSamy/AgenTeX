const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.ids.c1id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:120000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
const t=await page.locator('#main-content').innerText();log((t.match(/Support Plan Info[\s\S]{0,400}/)||[''])[0].replace(/\s+/g,' '));
const b=await page.locator('#main-content button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||'')+'|'+x.innerText.trim().slice(0,30)).filter(s=>/plan|change/i.test(s)));log(JSON.stringify(b));
await shot('2841-1-contract-panel.png');
const ch=page.locator('#main-content button').filter({hasText:/Change plan|Change/}).first();
if(await ch.count()){await ch.evaluate(e=>e.click());await sleep(2500);
 const opts=await page.locator('[role=dialog] [role=option],[role=listbox] [role=option],[role=dialog] label,[role=dialog] button,[role=menuitem]').evaluateAll(b=>b.map(x=>x.innerText.trim().slice(0,60)).filter(Boolean));log('picker',JSON.stringify(opts));
 const cb=page.locator('[role=dialog] [role=combobox],[role=dialog] select').first();if(await cb.count()){await cb.evaluate(e=>e.click());await sleep(1500);log('opts',JSON.stringify(await page.locator('[role=option]').allInnerTexts()));}
 await shot('2841-2-change-plan.png');}
