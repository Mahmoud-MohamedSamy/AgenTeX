const I=JSON.parse(require('fs').readFileSync('l3/ids.json','utf8')).A35; const reqs=[];
page.on('response',async r=>{const u=r.url(); const m=r.request().method(); if(/api\/v1/.test(u)&&m==='DELETE') reqs.push(m+' '+u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g,':id')+' '+r.status());});
await page.goto(H+'/views/all/tickets/'+I.t,{waitUntil:'domcontentloaded'}); for(let i=0;i<30;i++){await sleep(2000); if(/QA RT18 2635 ticket/.test(await text())&&/ACTIVITY/i.test(await text())) break;} await sleep(3000);
log('tabs', (await text()).split('\n').filter(l=>/ACTIVITY|CONVERSATION/i.test(l)).slice(0,4));
const tab=page.getByText(/\d+ ACTIVITY/i).first(); if(await tab.count()){ await tab.click(); await sleep(5000);} await shot('2635-1-ticket-activity.png');
log('list', (await text()).split('\n').filter(l=>/QA RT18 2635/.test(l)));
await page.goto(H+'/modules/6fb19115-9356-40f0-b064-840d8f1fad93/records/'+I.e,{waitUntil:'domcontentloaded'}); for(let i=0;i<20;i++){await sleep(2000); if(/QA RT18 2635 event/.test(await text())) break;}
await page.locator('main button:visible',{hasText:/^Delete$/}).first().click().catch(async()=>{await page.getByRole('button',{name:'Delete'}).first().click();}); await sleep(2000);
const d=page.locator('[role=dialog],[role=alertdialog]').last(); log('dlg', (await d.innerText().catch(()=>'none')).replace(/\n/g,' | ').slice(0,300)); await shot('2635-3-event-delete-confirm.png');
await d.getByRole('button',{name:/^(Delete|Move to Recycle Bin|Yes)/i}).last().click(); await sleep(5000); log('url after', page.url().replace(H,'')); log('toast', (await text()).split('\n').filter(l=>/deleted|recycle/i.test(l)).slice(0,3)); await shot('2635-4-after-delete.png');
log('reqs',reqs);
