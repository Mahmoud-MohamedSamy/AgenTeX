await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(2000);
log('links',JSON.stringify(await page.locator('a').evaluateAll(a=>a.map(x=>[x.innerText.trim().slice(0,40),x.getAttribute('href')]).filter(x=>/exec|history|log/i.test(x.join(' '))))));
log('tabs',JSON.stringify(await page.getByRole('tab').allInnerTexts()));
log('btns',JSON.stringify((await page.getByRole('button').allInnerTexts()).slice(0,40)));
return {};
