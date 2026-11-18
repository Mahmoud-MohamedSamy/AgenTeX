await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(8000);
await page.getByRole('tab',{name:'Round Robin'}).click();await sleep(4000);
await page.getByText('Customer Support',{exact:true}).last().click();await sleep(1200);
const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill('QA RT19 SK').catch(()=>{});await sleep(1000);}
await page.locator('[role=option]').filter({hasText:/QA RT19 SK Dept/}).first().click();await sleep(4000);
const row=page.locator('div').filter({has:page.getByText(/QA RT19 SK 2931 skill/)}).filter({has:page.locator('button')}).last();
const btns=row.locator('button');log('row btns '+await btns.count());
await row.locator('button').nth((await btns.count())-2).click();await sleep(5000);
const t=await text();log('hits '+JSON.stringify([...new Set((t.match(/[^\n]*skill[^\n]*/gi)||[]).map(s=>s.trim().slice(0,300)))].slice(0,15)));
const f=page.getByText(/at least one|holds any|any of/i).first();log('found '+await f.count());if(await f.count()){await f.scrollIntoViewIfNeeded();await sleep(500);}
await shot('2931-1-rr-skill-help.png');
const dr=page.locator('[role=dialog]').last();const g=page.getByText(/Agents get the tickets that match their skills/).first();await g.scrollIntoViewIfNeeded();await sleep(600);
log('drawer skill lines '+JSON.stringify(((await dr.innerText()).match(/[^\n]*(skill|holds)[^\n]*/gi)||[])));
const tips=await dr.locator('[title],[aria-label],[data-tooltip]').evaluateAll(L=>L.map(e=>e.getAttribute('title')||e.getAttribute('aria-label')||e.getAttribute('data-tooltip')).filter(x=>/skill/i.test(x||'')));log('tips '+JSON.stringify(tips));
await shot('2931-1-rr-skill-help.png');await page.getByRole('button',{name:'Cancel'}).last().click();
