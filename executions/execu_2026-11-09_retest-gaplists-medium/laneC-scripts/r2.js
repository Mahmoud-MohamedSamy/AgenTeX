const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2636/evidence/raw/';
const T='307cc0ce-bbc5-4507-ad7f-71370e8b93a0';
const out={writes:[]};try{
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&/repl|send|thread|mail|forward|draft|comment/i.test(u)){out.writes.push(new Date().toISOString().slice(11,19)+' '+m+' '+u.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.locator('button').filter({hasText:/^Reply All$/}).first().click({timeout:20000});await page.waitForTimeout(4000);
out.step='menu';await page.locator('button[aria-label="More send options"]').first().click({force:true,timeout:15000});await page.waitForTimeout(1500);
out.sendMenu=await page.locator('[role=menuitem],[role=menuitemradio],[role=option],[role=menu] button').allInnerTexts();
await page.screenshot({path:D+'tavi-send-menu.png'});
await page.mouse.click(1000,500);await page.waitForTimeout(800);
out.step='type';const ed=page.locator('[contenteditable=true]').first();await ed.click({force:true,timeout:15000});await page.keyboard.type('QA RT 2636 draft autosave probe');
out.t0=new Date().toISOString().slice(11,19);
await page.waitForTimeout(150000);
out.t1=new Date().toISOString().slice(11,19);
out.ls=await page.evaluate(()=>Object.keys(localStorage).filter(k=>/draft/i.test(k)).length);
await page.screenshot({path:D+'tavi-after-150s.png'});
return out;}catch(e){out.err=String(e).slice(0,160);await page.screenshot({path:D+'r2-err.png'});return out;}
