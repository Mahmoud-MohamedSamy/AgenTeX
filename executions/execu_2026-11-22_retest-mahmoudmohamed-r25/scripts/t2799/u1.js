const go=async(id,subj,name)=>{await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(subj).first().waitFor({timeout:120000}).catch(()=>log('no subj '+subj));await sleep(7000);await shot(name+'.png');
 const tab=page.getByText(/^History$/).first();await tab.click().catch(()=>log('nohist'));await sleep(6000);await shot(name+'-history.png');log(name,(await text()).replace(/\s+/g,' ').slice(0,700));};
await go('41b5c753-ea42-4d0f-9c9a-e74649da29eb','QA RT25 BP PRIV CPRIV reply test','2799-r25-6252-CPRIV');
await go('c3a82648-7deb-4847-b16f-12fe8dd8b01c','QA RT25 BP PRIV FPRIV reply test','2799-r25-6255-FPRIV');
await go('3e77509f-f779-4115-9ba5-a96e9fcb8ddb','QA RT25 BP PUB FPUB reply test','2799-r25-6256-FPUB');
