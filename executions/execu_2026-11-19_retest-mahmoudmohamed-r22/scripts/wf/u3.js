await page.goto(H+'/settings/automation/workflow-rules/2aa6ebf2-c1a9-41bd-b3aa-7ed0f59522e7',{waitUntil:'domcontentloaded'});await sleep(9000);
log('body',(await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(0,2500));
await shot('2962-1-rule-detail.png',{fullPage:true});
return {};
