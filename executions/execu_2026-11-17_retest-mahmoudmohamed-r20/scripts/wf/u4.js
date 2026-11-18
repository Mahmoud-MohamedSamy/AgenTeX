await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(1500);
const t=(await text()).replace(/\s+/g,' ');const i=t.indexOf('AUTOMATION');log(t.slice(i,i+600));
log('hrefs',JSON.stringify(await page.locator('a[href*="automation"]').evaluateAll(a=>a.map(x=>x.getAttribute('href')))));
return {};
