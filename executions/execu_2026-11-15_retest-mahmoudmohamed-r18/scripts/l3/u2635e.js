const bad=[]; page.on('response',r=>{const u=r.url(); if(/api\/v1/.test(u)&&r.status()===404) bad.push(r.request().method()+' '+u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g,':id').slice(0,100));});
await page.goto(H+'/activities',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByText('Tasks',{exact:true}).first().click(); await sleep(6000);
await page.locator('input[type=checkbox]:visible').nth(1).check({force:true}); await sleep(2000);
await page.mouse.click(702,84); await sleep(1500); log('menu', (await page.locator('[role=menu]').last().innerText().catch(()=>'none')).replace(/\n/g,' | ')); await shot('2635-7b-bulk-more.png');
log('404s',[...new Set(bad)]);
