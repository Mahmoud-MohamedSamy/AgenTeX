const C=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).a41;
await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/'+C.c2id,{waitUntil:'domcontentloaded'});
await page.getByText('Support Plan Info').first().waitFor({timeout:200000});
for(let i=0;i<30;i++){const t=await page.locator('#main-content').innerText();if(!/Loading the support plan/.test(t))break;await sleep(2000);}
const t=await page.locator('#main-content').innerText();log((t.match(/Support Plan Info[\s\S]{0,300}/)||[''])[0].replace(/\s+/g,' '));
log('allFields',(t.match(/Support Plan[^\n]*\n[^\n]*/g)||[]).join(' ## '));
await shot('2841-3-contract-created-with-deptB-plan.png');
