const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2787/evidence/m05/';
await page.setViewportSize({width:1440,height:900});
const res=[];
for(const p of ['/settings/users','/settings/users-and-control/users','/settings/agents']){await page.goto(H+p,{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);const t=await page.locator('body').innerText();res.push({p,url:page.url().replace(H,''),hits:t.split('\n').filter(l=>/\b\d+\b.*(user|agent|result|of)|page \d|showing/i.test(l)).slice(0,8)});await page.screenshot({path:D+p.replace(/\//g,'_')+'.png'});}
return res;
