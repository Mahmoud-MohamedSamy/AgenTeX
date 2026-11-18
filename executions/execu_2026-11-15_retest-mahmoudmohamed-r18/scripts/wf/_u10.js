const wiz=async(name)=>{
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(2000);
await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('workflow-rule-draft')).forEach(k=>localStorage.removeItem(k)));
await page.getByRole('button',{name:'New Rule'}).click();const dlg=page.getByRole('dialog').first();await dlg.waitFor();
await dlg.getByRole('button',{name:'Select a module'}).click();await page.getByRole('option',{name:'Tickets'}).click();
await dlg.getByText('Selected departments').click();await sleep(500);await dlg.getByText('QA AO Dept A',{exact:true}).click();await sleep(300);
await dlg.getByPlaceholder('e.g. High-Value Lead Notification').fill(name);
await dlg.getByRole('button',{name:'Next'}).click();await sleep(1000);
await dlg.getByRole('group').getByRole('button',{name:'Create',exact:true}).click().catch(e=>log('trig err',String(e.message).slice(0,100)));
await dlg.getByRole('button',{name:'Create',exact:true}).last().click();await sleep(4000);
};
const main=page.locator('main').last();const clk=l=>l.dispatchEvent('click');
const choose=async(btn,label)=>{await btn.click({force:true});await sleep(500);await page.locator(`xpath=//*[@role='option'][starts-with(normalize-space(.),"${label}")]`).first().click();await sleep(500);};
const setCond=async(i,field,op,value)=>{
 await choose(main.locator('button[aria-label="— select field —"]').first(),field);
 if(op)await choose(main.getByRole('button',{name:'Operator'}).nth(i),op);
 const rows=main.locator('button[aria-label="Remove condition"]');const row=rows.nth(i).locator('xpath=..');const inp=row.locator('input, textarea').first();
 if(await inp.count())await inp.fill(value);await sleep(300);};
const openCond=async()=>{await clk(main.getByText(/No conditions — actions run/).first());await sleep(800);await clk(main.getByText('Tickets matching certain conditions',{exact:true}).first());await sleep(800);};
const R={};
await wiz('QA RT18 WF 2948 pattern');await openCond();
await setCond(0,'Subject','starts with','QA RT18 WF 2948 ');
for(const [i,v] of [[1,'alpha'],[2,'beta']]){await clk(main.getByRole('button',{name:'Add condition'}).last());await sleep(700);await setCond(i,'Subject','contains',v);}
R.c=(await main.innerText()).split('CONDITION')[1]?.slice(0,500).replace(/\s+/g,' ');
const ep=main.getByText(/Edit Pattern/i).first();R.ep=await ep.count();
if(R.ep){await clk(ep);await sleep(1000);
 const box=page.locator('input[placeholder*="1"], input[aria-label*="attern"], textarea[aria-label*="attern"]').last();R.box=await box.count();
 if(!R.box){R.inputs=await page.locator('input:visible').evaluateAll(a=>a.map(x=>x.placeholder+'|'+x.getAttribute('aria-label')+'|'+x.value));}
 const b=R.box?box:page.locator('input:visible').filter({hasNot:page.locator('xx')}).last();
 R.patternBefore=await b.inputValue().catch(()=>null);
 await b.fill('1 and 2');await sleep(1200);
 R.after=(await main.innerText()).split('CONDITION')[1]?.slice(0,700).replace(/\s+/g,' ');
 const ap=page.getByRole('button',{name:/^Apply$/}).last();R.applyDisabled=await ap.isDisabled().catch(e=>'?'+e.message.slice(0,60));
 await shot('2948-1-pattern-1-and-2.png');
 await b.fill('1 and 2 and 3');await sleep(1000);R.apply3Disabled=await ap.isDisabled().catch(()=>'?');
 R.after3=(await main.innerText()).split('CONDITION')[1]?.slice(0,500).replace(/\s+/g,' ');
 await b.fill('(1 or 2)');await sleep(1000);R.applyOrDisabled=await ap.isDisabled().catch(()=>'?');R.afterOr=(await main.innerText()).match(/Condition 3[^.]*\./)?.[0];
 await b.fill('1 and 2 and 3 and 4');await sleep(1000);R.after4=(await main.innerText()).match(/[^.]*condition 4[^.]*\./i)?.[0];
 await b.fill('1 and 2');await sleep(800);
 await shot('2948-2-pattern-msg.png');
}
return R;
