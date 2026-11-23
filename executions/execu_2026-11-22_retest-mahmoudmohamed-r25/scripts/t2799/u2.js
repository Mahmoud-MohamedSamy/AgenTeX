const go=async(id,subj,name)=>{await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(subj).first().waitFor({timeout:120000}).catch(()=>log('no subj '+subj));await sleep(7000);
 const tab=page.getByText(/^History$/).first();await tab.click().catch(()=>log('nohist'));await sleep(6000);await shot(name+'-history.png');};
await go('4117e21e-3fce-4293-b728-6861fa6c2b77','QA RT25B BP PRIV CPRIV reply test','2799-r25b-6300-CPRIV');
await go('b3cc1421-3c55-4dd2-b7d3-967f5a2b11c8','QA RT25B BP PUB CPUB reply test','2799-r25b-6301-CPUB');
await page.goto(H+'/settings/channels/email/overview',{waitUntil:'commit'});await page.getByText(/Mail is arriving|could not check/).first().waitFor({timeout:90000}).catch(()=>log('no headline'));await sleep(8000);
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');const i=t.search(/Mail is arriving|could not check/);await shot('2837-r25b-overview-after.png');return t.slice(i,i+160);
