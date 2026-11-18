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
const R={};const reqs=[];page.on('request',q=>{if(/\/workflow\/rules/.test(q.url())&&q.method()!=='GET')reqs.push(q.method()+' '+q.url().split('/api/v1')[1]);});
await wiz('QA RT18 WF 2964 triple click');await openCond();
await setCond(0,'Subject','starts with','QA RT18 WF 2964 ');
await clk(main.getByRole('button',{name:'Done'}).first()).catch(()=>{});await sleep(600);
await clk(main.getByRole('button',{name:'Add action'}).first());await sleep(600);
await clk(main.getByRole('button',{name:/^Field Update/}).first());await sleep(900);
await clk(main.getByRole('button',{name:'Add field'}).first());await sleep(600);
await choose(main.locator('button[aria-label="— select field —"]').last(),'Description');
await main.locator('xpath=//button[@aria-label="Remove Description"]/..//input | //button[@aria-label="Remove Description"]/..//textarea').last().fill('QA RT18 2964 FU');
// header name maxlength (2955)
await page.getByRole('button',{name:'Edit rule name'}).first().click();await sleep(600);
const hn=page.locator('input:focus');R.headerMax=await hn.getAttribute('maxlength').catch(()=>null);
if(await hn.count()){await hn.press('End');await page.keyboard.type('y'.repeat(220),{delay:0});R.headerLen=(await hn.inputValue()).length;await shot('2955-3-header-name.png');
 await hn.fill('QA RT18 WF 2964 triple click');await hn.press('Enter');await sleep(500);}
// three synchronous clicks in one task
await main.getByRole('button',{name:'Save & Activate'}).first().evaluate(b=>{b.click();b.click();b.click();});
await sleep(7000);R.reqs=[...reqs];
const all=arr2=(await page.evaluate(()=>1));
return R;
