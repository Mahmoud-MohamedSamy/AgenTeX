await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(8000);
await page.getByRole('tab',{name:'Round Robin'}).click();await sleep(4000);
const grab=async()=>{const t=await text();return [...new Set((t.match(/[^\n]*(skill)[^\n]*/gi)||[]).map(s=>s.trim().slice(0,300)))];};
log('rr tab '+JSON.stringify(await grab()));
// pick department
const dd=page.getByRole('combobox').first();log('combos '+await page.getByRole('combobox').count());
await dd.click().catch(()=>{});await sleep(1000);const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill('QA RT19 SK Dept').catch(()=>{});await sleep(1000);}
await page.locator('[role=option]').filter({hasText:/^\s*QA RT19 SK Dept\s*$/}).first().click().catch(e=>log('opt err'));await sleep(4000);
log('dept '+JSON.stringify(await grab()));
const r=page.getByText(/QA RT19 SK 2931 skill/).first();log('rule '+await r.count());if(await r.count()){await r.click();await sleep(5000);log('editor '+JSON.stringify(await grab()));}
const f=page.getByText(/at least one|holds any|any of the|every active skill|every skill/i).first();log('found '+await f.count());if(await f.count()){await f.scrollIntoViewIfNeeded();await sleep(500);log('text '+(await f.innerText()).slice(0,400));}
await shot('2931-1-rr-skill-help.png');
