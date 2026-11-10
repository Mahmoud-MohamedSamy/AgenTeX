const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';const out={blocked:[]};
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf';
await page.route('**/api/v1/**',r=>{const m=r.request().method();const x=r.request().url();if(m==='PUT'||m==='PATCH'||m==='DELETE'||(m==='POST'&&/records\/|complete|timer/i.test(x)&&!/summaries|resolve/.test(x))){out.blocked.push(m+' '+x.replace(/.*api\/v1/,'').slice(0,80));return r.abort();}return r.continue();});
const resp=[];page.on('response',r=>{const u=r.url();if(/api\/v1/.test(u)&&r.status()>=400)resp.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'').slice(0,90));});
await page.setViewportSize({width:1440,height:900});
try{
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
out.title=(await page.locator('body').innerText()).match(/All Activities \(\d+\)/)?.[0];
await page.locator('button:near(:text("All Activities"))').nth(1).click({timeout:10000}).catch(e=>out.searchBtnErr=String(e).slice(0,80));await page.waitForTimeout(1000);
const si=page.locator('input[placeholder*="earch" i]').first();await si.fill('QA RT BUG');await page.keyboard.press('Enter');await page.waitForTimeout(6000);
const t=await page.locator('body').innerText();out.searchLines=t.split('\n').filter(l=>/QA RT BUG|Activities \(/.test(l)).slice(0,6);
await page.screenshot({path:D+'b2-agent-list-search.png'});
await page.locator('text=QA RT BUG dept task').first().click({timeout:10000});await page.waitForTimeout(8000);
const t2=await page.locator('body').innerText();out.detail=t2.split('\n').filter(l=>/QA RT BUG|HR|Department|denied|permission|Mark as Complete|Delete|Start timer/i.test(l)).slice(0,14);
await page.screenshot({path:D+'b2-agent-task-detail.png'});
}catch(e){out.err=String(e).slice(0,200);await page.screenshot({path:D+'b10-err.png'});}
out.http4xx=[...new Set(resp)].slice(0,20);
const tl=await api('GET',`/modules/${TM}/records?pageSize=1`);out.taskTotal=JSON.stringify(tl.j&&tl.j.meta||{}).slice(0,200);
return out;
