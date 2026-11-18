const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a33;
await page.goto(H+'/views/all/tickets/'+C.x1.id,{waitUntil:'domcontentloaded'});
await page.getByText('#'+C.x1.num).first().waitFor({timeout:200000}).catch(()=>log('no num'));await sleep(5000);
const t=await page.locator('#main-content').innerText();const i=t.indexOf('Key Information');log(t.slice(i,i+700).replace(/\s+/g,' '));
await shot('2833-1-first-ticket-plan.png');
