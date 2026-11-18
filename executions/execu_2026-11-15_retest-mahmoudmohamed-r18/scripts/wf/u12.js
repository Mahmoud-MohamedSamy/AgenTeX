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
