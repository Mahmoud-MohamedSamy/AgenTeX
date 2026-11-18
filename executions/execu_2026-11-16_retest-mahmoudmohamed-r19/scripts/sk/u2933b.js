await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded'});await sleep(10000);
const pickDept=async name=>{await page.getByText(/Select department…|QA SK13 Dept A|QA RT19 SK Dept|^Sales$/).first().click();await sleep(1200);
 const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill(name).catch(()=>{});await sleep(1200);}
 await page.locator('[role=option]').filter({hasText:new RegExp('^\s*'+name+'\s*$')}).first().click();await sleep(2500);};
const grp=page.locator('[data-rule-field=skills] [role=group]');
const chips=async()=>(await grp.locator('button').evaluateAll(L=>L.map(b=>b.innerText.trim().slice(0,30)+(b.getAttribute('aria-pressed')==='true'?' [ON]':''))));
const R={};
await pickDept('QA RT19 SK Dept');R.own=await chips();
await grp.locator('button',{hasText:'QA RT19 SK S1'}).click();await grp.locator('button',{hasText:'QA RT19 SK S2'}).click();await sleep(800);R.ownPicked=await chips();
await page.locator('[data-rule-field=skills]').scrollIntoViewIfNeeded();await shot('2933-2-new-ticket-own-dept-picked.png');
await pickDept('QA SK13 Dept A');await sleep(1500);R.sk13=await chips();await page.locator('[data-rule-field=skills]').scrollIntoViewIfNeeded();await shot('2933-3-new-ticket-switched-sk13.png');
await grp.locator('button',{hasText:/^QA SK13 S1$/}).click();await sleep(500);
await pickDept('QA RT19 SK Dept');await sleep(1500);R.back=await chips();await page.locator('[data-rule-field=skills]').scrollIntoViewIfNeeded();await shot('2933-4-new-ticket-back-own-dept.png');
await pickDept('Sales');await sleep(1500);R.sales=await chips();
return R;
