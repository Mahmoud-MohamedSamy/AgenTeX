const I=JSON.parse(require('fs').readFileSync('l3/ids.json','utf8')); const reqs=[];
page.on('response',async r=>{const u=r.url(); const m=r.request().method(); if(/api\/v1/.test(u)&&m!=='GET'&&/blueprint|records|validat/.test(u)) reqs.push(m+' '+u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g,':id').slice(0,100)+' '+r.status()+' '+(r.request().postData()||'').slice(0,150)+' => '+(await r.text().catch(()=>'')).slice(0,300));});
await page.goto(H+'/views/all/tickets/'+I.T12,{waitUntil:'domcontentloaded'}); for(let i=0;i<20;i++){await sleep(2000); if(/QA to Hold/.test(await text())) break;}
await page.getByRole('button',{name:'QA to Hold'}).first().click(); await sleep(2500);
const inp=page.locator('input').filter({hasNot:page.locator('xpath=ancestor::header')}).and(page.locator('input:visible')); 
const all=await page.locator('input:visible').evaluateAll(es=>es.map((e,i)=>i+':'+e.value)); log('inputs', all.slice(0,20));
const target=page.locator('input:visible').nth(all.findIndex(x=>x.endsWith(':QA RT18 3012 ticket')));
await target.click({clickCount:3}); await target.fill(''); await target.type('QA RT18 BAD-bp',{delay:20}); await sleep(1500);
await shot('3012-2-typed.png'); log('after typing', ((await text()).match(/[^\n]*(QA RT18: subject|cannot start)[^\n]*/g)||[]).slice(0,3));
await page.getByRole('button',{name:/^Run$/}).last().click(); await sleep(5000);
await shot('3012-3-after-run.png');
log('msgs', ((await text()).match(/[^\n]*(QA RT18: subject|cannot|failed|Validation)[^\n]*/g)||[]).slice(0,6));
log('stepper', ((await text()).match(/QA RT18 3012 BP \/ [^\n]*/g)||[]).slice(0,2));
log('reqs', reqs);
