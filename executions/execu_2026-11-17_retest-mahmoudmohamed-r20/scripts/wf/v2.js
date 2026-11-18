const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');const R={};
const reqs=[];page.on('request',q=>{if(/tag/i.test(q.url())&&q.method()!=='GET')reqs.push(q.method()+' '+q.url().replace(H,''));});
await page.goto(H+'/settings/automation/workflow-rules/09f71f2f-36df-416e-8f7a-c39634886b39',{waitUntil:'domcontentloaded'});await sleep(10000);
for(const [k,name] of [['add','Add Tags'],['rem','Remove Tags']]){
 await clk(main().getByRole('button',{name:'Add action'}).first());await sleep(800);
 await clk(main().getByRole('button',{name:new RegExp('^'+name)}).first());await sleep(2000);
 const inp=main().locator('input[placeholder]').last();R[k+'Ph']=await inp.getAttribute('placeholder');
 R[k+'AllPh']=await main().locator('input[placeholder]').evaluateAll(a=>a.map(x=>x.placeholder).filter(p=>/tag/i.test(p)));
 await inp.click();await sleep(1500);R[k+'Opts']=(await page.getByRole('option').allInnerTexts()).slice(0,15);
 await inp.scrollIntoViewIfNeeded();await shot(`3058-${k==='add'?1:3}-${k}-tags-open.png`);
 await inp.fill('qa rt20 wf nonexist');await sleep(2500);R[k+'Typed']=(await page.getByRole('option').allInnerTexts()).slice(0,5);
 R[k+'Near']=(await page.locator('body').innerText()).match(/.{0,40}(No matching tags|Create).{0,60}/g)?.slice(0,6);
 await shot(`3058-${k==='add'?2:4}-${k}-tags-typed.png`);
 await inp.press('Enter');await sleep(1500);R[k+'AfterEnter']=(await main().innerText()).includes('qa rt20 wf nonexist')?'text kept':'gone';
 await inp.fill('');await page.keyboard.press('Escape');await sleep(800);
}
R.tagReqs=reqs;
return R;
