const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2636/evidence/raw/';
const T='307cc0ce-bbc5-4507-ad7f-71370e8b93a0';const out={writes:[]};
try{
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&/repl|send|thread|mail|forward|draft|comment/i.test(u)){out.writes.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.locator('button').filter({hasText:/Reply All/}).first().click({timeout:20000});await page.waitForTimeout(5000);
await page.locator('input[placeholder*="recipient" i]').first().click({timeout:10000});await page.keyboard.type('qa.rt2636@example.com');await page.keyboard.press('Enter');await page.waitForTimeout(1500);await page.screenshot({path:D+'tavi-recipient.png'});out.caretDisabled=await page.locator('button[aria-label="More send options"]').first().isDisabled();await page.locator('button[aria-label="More send options"]').first().click({timeout:10000});await page.waitForTimeout(2000);
out.popup=await page.evaluate(()=>[...document.querySelectorAll('[role=menu],[role=listbox],[data-radix-popper-content-wrapper],[role=dialog]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,3));
await page.screenshot({path:D+'tavi-send-menu.png'});
}catch(e){out.err=String(e).slice(0,200);}
return out;
