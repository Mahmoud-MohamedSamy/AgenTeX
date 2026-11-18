await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded'});await sleep(10000);
await page.getByText(/Select department…|QA SK13 Dept A|QA RT19 SK Dept|^Sales$|Customer Support/).first().click();await sleep(1200);
const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill('QA RT19 SK Dept').catch(()=>{});await sleep(1200);}
await page.locator('[role=option]').filter({hasText:/^\s*QA RT19 SK Dept\s*$/}).first().click();await sleep(2500);
const grp=page.locator('[data-rule-field=skills] [role=group]');await grp.scrollIntoViewIfNeeded();
log('chips '+JSON.stringify(await grp.locator('button').evaluateAll(L=>L.map(b=>b.innerText.trim().slice(0,30)))));
await shot('2971-4-new-ticket-after-delete.png');
