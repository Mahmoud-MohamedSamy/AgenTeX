const main=()=>page.locator('main').last();const clk=l=>l.dispatchEvent('click');const R={};
const reqs=[];page.on('request',q=>{if(/tag/i.test(q.url())&&q.method()!=='GET')reqs.push(q.method()+' '+q.url().replace(H,''));});
const pop=async()=>{const t=(await page.locator('body').innerText()).match(/(Create "[^"]*")|No matching tags/g);return t?[...new Set(t)]:[];};
// Remove Tags rule
await page.goto(H+'/settings/automation/workflow-rules/c840c74c-9724-4af3-9915-1121c645857e',{waitUntil:'domcontentloaded'});await page.getByText('Remove Tags').first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
let inp=main().locator('input[placeholder*="tag" i]').first();R.remPh=await inp.getAttribute('placeholder').catch(()=>'none');
await inp.click();await sleep(1500);R.remOptsText=(await inp.locator('xpath=ancestor::div[3]').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
await inp.scrollIntoViewIfNeeded();await shot('3058-r2-9-remove-open.png');
await inp.fill('QA RT20 W2 other');await sleep(2000);R.remTyped=await pop();await shot('3058-r2-10-remove-typed.png');
// multi-dept rule
await page.goto(H+'/settings/automation/workflow-rules/1fad3bd6-afc0-4408-877d-0c56cabc66fa',{waitUntil:'domcontentloaded'});await page.getByText('Add Tags').first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
R.hdr=(await main().innerText()).replace(/\s+/g,' ').slice(0,200);
inp=main().locator('input[placeholder*="tag" i]').first();R.multiPh=await inp.getAttribute('placeholder').catch(()=>'none');
R.chipsMulti=(await inp.locator('xpath=ancestor::div[2]').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200);
await inp.click();await sleep(2000);R.near=(await main().innerText()).match(/.{0,80}(one department|limit|Limit).{0,120}/g)?.slice(0,3);
const body=(await page.locator('body').innerText());R.opts=body.match(/[^\n]*·[^\n]*/g)?.slice(0,20);
await inp.scrollIntoViewIfNeeded();await shot('3058-r2-11-multi-options.png');
await inp.fill('QA RT20 W2 multinew');await sleep(2000);R.multiTyped=await pop();R.near2=(await page.locator('body').innerText()).match(/.{0,80}(one department|limit|Limit).{0,120}/g)?.slice(0,3);
await shot('3058-r2-12-multi-typed.png');
return {R,reqs};
