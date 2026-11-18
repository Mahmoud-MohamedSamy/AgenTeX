await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(3000);
const sb=page.getByPlaceholder(/search/i).first();if(await sb.count()){await sb.fill('QA RT18 WF');await sleep(2500);}
log('rows',(await page.getByRole('row').allInnerTexts()).slice(0,20));
const hrefs=await page.locator('a[href*="workflow"]').evaluateAll(a=>a.map(x=>x.getAttribute('href')).slice(0,10));log('hrefs',hrefs);
await shot('wf-probe-list.png');
return {url:page.url()};
