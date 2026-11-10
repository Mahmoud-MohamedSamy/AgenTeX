const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2636/evidence/raw/';
const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2636/ledger.md';
const T='307cc0ce-bbc5-4507-ad7f-71370e8b93a0';
const out={writes:[]};
try{const d0=await api('GET',`/desk/tickets/${T}/drafts/mine`);out.draftBefore=d0.s+' '+d0.t.slice(0,160);
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&/repl|send|thread|mail|forward|draft|comment/i.test(u)){const allow=/drafts\/mine/.test(u)&&m==='PUT';out.writes.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,80)+(allow?' ALLOWED':' blocked'));return allow?r.continue():r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.locator('button').filter({hasText:/Reply All/}).first().click({timeout:20000});await page.waitForTimeout(4000);
const ed=page.locator('[contenteditable=true]').first();await ed.click({force:true});await page.keyboard.type('QA RT 2636 draft autosave probe');await page.waitForTimeout(6000);
out.step='menu';await page.locator('button[aria-label="More send options"]').first().click({force:true,timeout:15000});await page.waitForTimeout(1500);
out.sendMenu=(await page.locator('[role=menu]').allInnerTexts()).join(' || ');
await page.screenshot({path:D+'tavi-send-menu.png'});
await page.keyboard.press('Escape');await page.waitForTimeout(500);
fs.appendFileSync(L,`- ${new Date().toISOString()} draft autosave allowed on throwaway ticket ${T} (PUT /desk/tickets/{id}/drafts/mine, text "QA RT 2636 draft autosave probe")\n`);
const d=await api('GET',`/desk/tickets/${T}/drafts/mine`);out.draftGet=d.s;out.draftBody=d.s===200?JSON.stringify(d.j&&d.j.data).slice(0,200):d.t.slice(0,150);
// reload, look for draft indicator
await page.goto(H+'/views/all/tickets/'+T,{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
await page.screenshot({path:D+'tavi-after-reload.png'});
out.reloadLines=(await page.locator('body').innerText()).split('\n').filter(l=>/draft/i.test(l)).slice(0,10);
}catch(e){out.err=String(e).slice(0,200);await page.screenshot({path:D+'r3-err.png'});}
return out;
