const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a33;
for(const [k,shotn] of [['x1','2833-1-first-ticket-plan.png']]){
await page.goto(H+'/views/all/tickets/'+C[k].id,{waitUntil:'domcontentloaded'});
await page.getByText('#'+C[k].num).first().waitFor({timeout:200000}).catch(()=>log('no num'));await sleep(4000);
const tabs=await page.locator('[role=tab],button').evaluateAll(b=>b.map(x=>x.innerText.trim()).filter(s=>/^SLA/i.test(s)));log(k,'tabs',JSON.stringify(tabs));
const st=page.locator('[role=tab],button').filter({hasText:/^SLA/}).first();if(await st.count()){await st.evaluate(e=>e.click());await sleep(4000);}
const t=await page.locator('#main-content').innerText();const i=t.search(/
SLA
/);log(k,i>=0?t.slice(Math.max(0,i-300),i+500).replace(/\s+/g,' '):t.slice(0,500).replace(/\s+/g,' '));
await shot(shotn);}
