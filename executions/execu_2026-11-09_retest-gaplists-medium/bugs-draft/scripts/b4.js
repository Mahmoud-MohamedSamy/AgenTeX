const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';
const T='372b88df-6733-4c61-a774-0202a0148fd5';const out={writes:[],tries:[]};
try{
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'){out.writes.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
await page.screenshot({path:D+'b1-ticket.png'});
out.btns=await page.locator('button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText).trim()).filter(t=>/^reply|forward/i.test(t)));
await page.locator('button').filter({hasText:/^Reply All|^Reply/}).first().click({timeout:20000});await page.waitForTimeout(5000);
await page.screenshot({path:D+'b1-composer-prefilled.png'});
out.chips=await page.locator('.eti-chip-label').allInnerTexts();out.errs0=await page.locator('.eti-error').allInnerTexts();
out.sendDisabled0=await page.locator('button').filter({hasText:/^Send$/}).first().isDisabled().catch(e=>'n/a');
const list=['qa.rt2636@example.com','qa2636@example.com','qa.rt@anyware.software','first.last+tag@gmail.com','a@b.co','user@mail.test','user@company.example','info@example.org','user@sub.example.com','user@localhost'];
const inp=page.locator('.eti-input').first();
for(const a of list){await inp.click({timeout:10000});await page.keyboard.press('Control+A');await page.keyboard.press('Backspace');await page.keyboard.type(a);await page.keyboard.press('Enter');await page.waitForTimeout(800);
 const err=(await page.locator('.eti-error').allInnerTexts()).join(' ');const chips=await page.locator('.eti-chip-label').allInnerTexts();
 out.tries.push(a+' => '+(err?'REJECTED: '+err:(chips.includes(a)?'accepted (chip)':'?')));
 if(a==='qa.rt2636@example.com')await page.screenshot({path:D+'b1-rejected-example-com.png'});
 if(a==='user@sub.example.com')await page.screenshot({path:D+'b1-sub-example.png'});}
out.chipsEnd=await page.locator('.eti-chip-label').allInnerTexts();
await page.screenshot({path:D+'b1-after-tries.png'});
await page.locator('button').filter({hasText:/^Cancel$/}).first().click({timeout:5000}).catch(()=>{});await page.waitForTimeout(1500);
}catch(e){out.err=String(e).slice(0,300);await page.screenshot({path:D+'b4-err.png'});}
return out;
