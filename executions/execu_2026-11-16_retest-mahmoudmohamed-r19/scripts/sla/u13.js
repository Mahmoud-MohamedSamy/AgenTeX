const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
const open=async id=>{await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+id,{waitUntil:'domcontentloaded'});await page.getByText('Support Plan Info').first().waitFor({timeout:90000}).catch(()=>log('no SPI'));await sleep(2500);};
await open(C.ids.c1id);
const t=await page.locator('#main-content').innerText();log((t.match(/Support Plan Info[\s\S]{0,500}/)||[''])[0].replace(/\s+/g,' '));
log(JSON.stringify(await page.locator('#main-content button').evaluateAll(b=>b.map(x=>(x.getAttribute('aria-label')||'')+'|'+x.innerText.trim().slice(0,30)))));
await shot('2841-x1.png');
await open(C.c2id);const t2=await page.locator('#main-content').innerText();log('c2',(t2.match(/Support Plan[\s\S]{0,400}/g)||[]).map(s=>s.replace(/\s+/g,' ')).join(' ## '));await shot('2841-x2.png');
