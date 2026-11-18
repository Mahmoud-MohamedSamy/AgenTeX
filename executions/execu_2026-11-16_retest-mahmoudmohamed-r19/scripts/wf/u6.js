await page.goto(H+'/settings/workflow-executions',{waitUntil:'domcontentloaded'});await sleep(10000);
log('url',page.url().replace(H,''));
log('body',(await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(0,1500));
await shot('2962-x-exec-probe.png');
return {};
