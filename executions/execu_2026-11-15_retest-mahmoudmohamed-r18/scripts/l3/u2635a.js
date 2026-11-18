const I=JSON.parse(require('fs').readFileSync('l3/ids.json','utf8')).A35;
await page.goto(H+'/views/all/tickets/'+I.t,{waitUntil:'domcontentloaded'}); for(let i=0;i<20;i++){await sleep(2000); if(/QA RT18 2635 ticket/.test(await text())) break;} await sleep(2000);
log('tabs', (await text()).split('\n').filter(l=>/ACTIVITY|CONVERSATION/.test(l)));
const tab=page.getByText(/\d+ ACTIVITY/).first(); if(await tab.count()){ await tab.click(); await sleep(4000);} await shot('2635-1-ticket-activity.png');
log('list', (await text()).split('\n').filter(l=>/QA RT18 2635/.test(l)));
for(const [k,mid] of [['e','6fb19115-9356-40f0-b064-840d8f1fad93'],['k1','d120a6c2-2596-4254-968b-a1bcd3a000bf'],['c','f7e488b5-0232-42fd-811c-1f24356af653']]){
 await page.goto(H+'/modules/'+mid+'/records/'+I[k],{waitUntil:'domcontentloaded'}); await sleep(9000); log(k+' url', page.url().replace(H,''));
 const btns=await page.locator('main button:visible').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim().slice(0,30)).filter(Boolean)); log(k+' buttons', btns.slice(0,30));
 await shot('2635-2-'+k+'-page.png'); }
