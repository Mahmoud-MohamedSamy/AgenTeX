const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';
const T='372b88df-6733-4c61-a774-0202a0148fd5';const out={blocked:[]};
try{
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&(m!=='POST'||/repl|send|draft|thread|mail|forward|comment/i.test(u))){out.blocked.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
out.contactPanel=(await page.locator('body').innerText()).split('\n').filter(l=>/example|QA RT BUG Contact/i.test(l)).slice(0,6);
await page.locator('button').filter({hasText:/^Reply All|^Reply/}).first().click({timeout:20000});await page.waitForTimeout(6000);
out.chips=await page.locator('.eti-chip-label').allInnerTexts();out.errs=await page.locator('.eti-error').allInnerTexts();
out.recipLines=(await page.locator('body').innerText()).split('\n').filter(l=>/example|Recipients|valid/i.test(l)).slice(0,8);
const ed=page.locator('[contenteditable=true]').first();await ed.click({force:true}).catch(()=>{});await page.keyboard.type('x');await page.waitForTimeout(1000);
out.sendDisabled=await page.locator('button').filter({hasText:/^Send$/}).first().isDisabled().catch(e=>'n/a');
await page.screenshot({path:D+'b1-composer-contact-prefill.png'});
await page.locator('button').filter({hasText:/^Cancel$/}).first().click({timeout:5000}).catch(()=>{});await page.waitForTimeout(1500);
}catch(e){out.err=String(e).slice(0,300);await page.screenshot({path:D+'b5-err.png'});}
return out;
