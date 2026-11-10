const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/tavi/';
const id='60d56647-cabf-439e-9a1d-eb4a64a149ed';const out={};const calls=[];
page.on('response',r=>{const u=r.url();const m=r.request().method();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u)&&m!=='GET'&&!/heartbeat|resolved-batch|realtime|summaries|presence|viewers/.test(u))calls.push(r.status()+' '+m+' '+u.replace(/.*api\/v1/,'').slice(0,90));});
await page.setViewportSize({width:1440,height:900});
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.locator('body').innerText().catch(()=>'');if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
const info=async()=>{const t=await page.locator('body').innerText();const i=t.indexOf('Recipients');return t.slice(Math.max(0,i-120),i+260).split('\n').filter(Boolean).slice(0,10);};
let ok=false;for(let i=0;i<3&&!ok;i++){await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:120000});const t=await wt(/CONVERSATION|Something went wrong/i);ok=t&&!/Something went wrong/.test(t);}
out.opened=ok;await page.waitForTimeout(4000);
const d=await api('GET',`/desk/tickets/${id}/drafts/mine`);out.draftBefore=d.s;
await page.screenshot({path:D+'b-email-ticket.png'});
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(3500);
out.replyAll=await info();await page.screenshot({path:D+'b-email-replyall.png'});
// close composer without typing
const cancel=page.getByRole('button',{name:/^Cancel$/}).last();if(await cancel.count()){await cancel.click().catch(()=>{});await page.waitForTimeout(2000);}
const dlg=page.locator('[role=dialog],[role=alertdialog]').last();if(await dlg.count()){out.dlg1=(await dlg.innerText()).replace(/\n/g,' | ').slice(0,200);const b=dlg.getByRole('button').filter({hasText:/discard|yes|delete/i}).first();if(await b.count())await b.click();await page.waitForTimeout(1500);}
// plain Reply via the arrow menu
const arrow=page.locator('button:has-text("Reply All")').first().locator('xpath=following-sibling::button[1]');
if(await arrow.count()){await arrow.click().catch(()=>{});await page.waitForTimeout(1500);out.menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).replace(/\n/g,' | ');
 const it=page.locator('[role=menuitem]').filter({hasText:/^Reply$/}).first();if(await it.count()){await it.click();await wt(/Insert template/);await page.waitForTimeout(3500);out.reply=await info();await page.screenshot({path:D+'b-email-reply.png'});
 const c2=page.getByRole('button',{name:/^Cancel$/}).last();if(await c2.count()){await c2.click().catch(()=>{});await page.waitForTimeout(2000);}
 const d2=page.locator('[role=dialog],[role=alertdialog]').last();if(await d2.count()){out.dlg2=(await d2.innerText()).replace(/\n/g,' | ').slice(0,200);const b=d2.getByRole('button').filter({hasText:/discard|yes|delete/i}).first();if(await b.count())await b.click();}}
 else{await page.keyboard.press('Escape');}}
await page.waitForTimeout(3000);const d3=await api('GET',`/desk/tickets/${id}/drafts/mine`);out.draftAfter=d3.s+' '+(d3.t||'').slice(0,120);
out.calls=calls;return out;
