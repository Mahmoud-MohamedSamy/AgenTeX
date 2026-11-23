const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/modules\/.*\/records$/.test(u)&&r.request().method()==='POST')R.reqs.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,200));});
const pick=async(label,opt)=>{const l=page.getByText(new RegExp('^[*]?'+label+'$')).first();await l.scrollIntoViewIfNeeded();const b=l.locator('xpath=following::button[1]');await b.click({timeout:10000});await sleep(700);const s=page.locator('input[placeholder*="Search" i]:visible').last();if(await s.count())await s.fill(opt);await sleep(700);await page.getByRole('option',{name:new RegExp('^'+opt,'i')}).first().click({timeout:10000});await sleep(700);};
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await page.locator('button[aria-label*="another module" i]').first().waitFor({timeout:150000});await sleep(2000);
await page.locator('button[aria-label*="another module" i]').first().click();await sleep(1500);await page.getByRole('menuitem',{name:'Ticket',exact:true}).click();await page.getByText('Create Ticket').first().waitFor({timeout:60000});await sleep(3000);
R.layout=await page.locator('select').first().evaluate(s=>s.options[s.selectedIndex].text).catch(()=>'?');
await page.getByText(/^\*?Subject$/).first().locator('xpath=following::input[1]').fill('QA RT26 sla UI ticket');
try{await pick('Department','QA RT26 VO Dept');}catch(e){R.deptErr=e.message.slice(0,120);}
try{await pick('Status','Open');}catch(e){R.stErr=e.message.slice(0,120);}
await shot('sla-ui-form.png');
await page.getByRole('button',{name:'Save',exact:true}).first().click();await sleep(8000);R.url=page.url().replace(H,'');await shot('sla-ui-saved.png');
return R;
