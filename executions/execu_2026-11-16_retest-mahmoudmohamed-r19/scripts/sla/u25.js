await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new',{waitUntil:'domcontentloaded'});
await page.getByText(/Support Plan/i).first().waitFor({timeout:200000}).catch(()=>log('no SP label'));await sleep(3000);
log(page.url());
const dep=page.locator('[aria-label="Department"]').first();log('dep',await dep.count(),await dep.evaluate(e=>e.tagName).catch(()=>''));
await dep.click();await sleep(1500);
const inp=page.locator('[role=dialog] input, [role=listbox] input, [cmdk-input], input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill('QA RT19 SLA');await sleep(1500);}
log('depOpts',JSON.stringify((await page.locator('[role=option]').allInnerTexts()).slice(0,10)));
await page.locator('[role=option]').filter({hasText:/^QA RT19 SLA Dept$/}).first().click();await sleep(1500);
await page.locator('[aria-label="Support Plan"]').first().click();await sleep(2500);
const o=await page.locator('[role=option]').allInnerTexts();log('planOpts',o.length,JSON.stringify(o.filter(x=>/RT19 SLA|2841|2833/.test(x))),'total',o.length);
await shot('2841-4-new-contract-plan-picker.png');
