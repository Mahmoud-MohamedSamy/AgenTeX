await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(2000);
const t=await text(); const i=t.search(/Execution/i); log('ctx',t.slice(Math.max(0,i-300),i+200).replace(/\s+/g,' '));
const el=page.getByText(/Execution History/i).first(); log('count',await page.getByText(/Execution History/i).count());
if(await el.count()){await el.click();await sleep(4000);log('url',page.url());}
return {};
