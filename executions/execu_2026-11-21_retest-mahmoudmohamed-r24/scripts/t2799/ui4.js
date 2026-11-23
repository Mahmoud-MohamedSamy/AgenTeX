const go=async(id,subj,name)=>{await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.getByText(subj).first().waitFor({timeout:120000}).catch(()=>log('no subj '+subj));await sleep(5000);await shot(name+'.png');
 const tab=page.getByText(/^History$/).first();await tab.click().catch(()=>log('nohist'));await sleep(6000);await shot(name+'-history.png');log(name,(await text()).replace(/\s+/g,' ').slice(0,900));};
await go('e4d64671-8e34-46cd-a04b-4e4e32b083bb','QA RT24 BP PRIV PRIV2 private test','2799-d-PRIV2');
await go('ea9ef94d-c03e-452b-a378-c948a91023fe','Re: QA RT24 PRIV2 private thread','2799-e-new5988');
await go('88c09ac2-12d4-438f-a650-d8df18d4ef2b','QA RT24 BP PRIV PRIV1 reply test','2799-f-PRIV1');
