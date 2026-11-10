const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/recheck/lead/evidence/';
const id='60d56647-cabf-439e-9a1d-eb4a64a149ed';const out={};
await page.setViewportSize({width:1440,height:900});
const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
const info=async()=>{const t=await body();const i=t.indexOf('Recipients');return t.slice(Math.max(0,i-120),i+300).split('\n').slice(0,12);};
let ok=false;for(let i=0;i<3&&!ok;i++){await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:120000});const t=await wt(/CONVERSATION|Something went wrong/i);ok=!!t&&!/Something went wrong/.test(t);if(!ok)await page.waitForTimeout(5000);}
out.opened=ok;await page.waitForTimeout(3000);
await page.screenshot({path:D+'b3-email-ticket.png'});
const discard=async()=>{const c=page.locator('button:has-text("Cancel")').last();if(await c.count()){await c.click();await page.waitForTimeout(1500);const dlg=page.locator('[role=dialog],[role=alertdialog]').last();if(await dlg.count()){const b=dlg.getByRole('button').filter({hasText:/discard|yes|delete/i}).first();if(await b.count())await b.click();await page.waitForTimeout(1500);}}};
// Reply All
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/,60000);await page.waitForTimeout(3500);
out.replyAll=await info();await page.screenshot({path:D+'b3-email-replyall.png'});
await discard();
// Reply via arrow menu
const arrow=page.locator('button:has-text("Reply All")').first().locator('xpath=following-sibling::button[1]');
if(await arrow.count()){await arrow.click();await page.waitForTimeout(1500);out.menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).split('\n').slice(0,10);
const it=page.locator('[role=menuitem]:has-text("Reply")').filter({hasNotText:'All'}).first();if(await it.count()){await it.click();await wt(/Insert template/,60000);await page.waitForTimeout(3500);out.reply=await info();await page.screenshot({path:D+'b3-email-reply.png'});await discard();}}
const dr=await api('GET',`/desk/tickets/${id}/drafts/mine`);out.draftAfter=dr.s+' '+dr.t.slice(0,120);
return out;
